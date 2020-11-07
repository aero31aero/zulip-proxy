function sleep(ms) {
    // TODO add jitter.
    return new Promise((resolve) => setTimeout(resolve, ms));
}

exports.make = (z) => {
    let stopped = false;

    function logError(error) {
        console.log('zulip-js: Error while communicating with server:', error);
    }

    function stop() {
        console.log('event handler is being told to stop');
        stopped = true;
    }

    async function registerQueue(eventTypes = null, query_params) {
        let res;
        while (!stopped) {
            try {
                const params = { eventTypes };
                res = await z.post('register', params, query_params);

                if (stopped) {
                    break;
                }

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

    async function start(callback, eventTypes = null, query_params) {
        let queueId = null;
        let lastEventId = -1;
        const handleEvent = (event) => {
            lastEventId = Math.max(lastEventId, event.id);
            callback(event);
        };
        while (!stopped) {
            if (!queueId) {
                const queueData = await registerQueue(eventTypes, query_params);

                if (stopped) {
                    break;
                }

                queueId = queueData.queueId;
                lastEventId = queueData.lastEventId;
                console.log('SENDING QUEUE ID');
                callback({
                    type: 'queue_id',
                    queue_id: queueId,
                });
            }
            try {
                const res = await z.get('events', {
                    queue_id: queueId,
                    last_event_id: lastEventId,
                    dont_block: false,
                });

                if (stopped) {
                    break;
                }

                if (res.events) {
                    res.events.forEach(handleEvent);
                }
            } catch (e) {
                logError(e);
            }
            await sleep(1000);
        }
        console.log(`ending event loop for ${queueId}`);
    }

    return {
        start,
        stop,
    };
};
