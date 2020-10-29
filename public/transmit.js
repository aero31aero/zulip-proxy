window.transmit = (() => {
    async function send_pm(user_id, content) {
        const data = {
            type: 'private',
            to: JSON.stringify([user_id]),
            content: content,
        };

        const response = await fetch('/z/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    }

    return {
        send_pm: send_pm,
    };
})();
