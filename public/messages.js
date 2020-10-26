window.messages = (() => {
    function build_message_table(messages) {
        const message_ul = $('<ul>');

        for (const msg of messages) {
            const li = $('<li>');
            li.append($('<b>').text(msg.sender_full_name));
            li.append($('<br>'));
            li.append(msg.content);
            message_ul.append(li);
        }

        return message_ul;
    }

    function make() {
        let fetched;
        let message_data;
        let div;
        const LIMIT = 20; // load last 20 messages;

        function render() {
            div = $('<div>').addClass('message-list');
            let message_data = model().messages;
            if (message_data.length > LIMIT) {
                message_data = message_data.slice(LIMIT * -1);
            }
            const table = build_message_table(message_data);
            div.empty();
            div.append(table);
            return div;
        }

        return {
            render: render,
        };
    }

    return {
        make: make,
        build_message_table: build_message_table,
    };
})();
