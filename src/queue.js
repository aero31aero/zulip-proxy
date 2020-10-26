function sleep(ms) {
    // TODO add jitter.
    return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = (z) => {
    function logError(error) {
        console.log('zulip-js: Error while communicating with server:', error);
    }

    async function registerQueue(req, eventTypes = null) {
        let res;
        while (true) {
            try {
                const params = { eventTypes };
                res = await z.post('register', params);
                if (res.result === 'error') {
                    logError(res.msg);
                    await sleep(1000);
                } else {
                    return {
                        queueId: res.queue_id,
                        lastEventId: res.last_event_id,
                    };
                }
            } catch (e) {
                logError(e);
            }
        }
    }

    async function callOnEachEvent(callback, eventTypes = null) {
        let queueId = null;
        let lastEventId = -1;
        const handleEvent = (event) => {
            lastEventId = Math.max(lastEventId, event.id);
            callback(event);
        };
        while (true) {
            if (!queueId) {
                const queueData = await registerQueue(eventTypes);
                queueId = queueData.queueId;
                lastEventId = queueData.lastEventId;
            }
            try {
                const res = await z.get('events', {
                    queue_id: queueId,
                    last_event_id: lastEventId,
                    dont_block: false,
                });
                if (res.events) {
                    res.events.forEach(handleEvent);
                }
            } catch (e) {
                logError(e);
            }
            await sleep(1000);
        }
    }

    return callOnEachEvent;
};
