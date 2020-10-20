window.messages = (() => {
    let message_data;

    async function get_message_data() {
        if (message_data === undefined) {
            const response = await fetch(
                '/z/messages?num_before=5&anchor=newest&num_after=0'
            );
            message_data = await response.json();
        }

        return message_data;
    }

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

    async function render() {
        const data = await get_message_data();
        return build_message_table(data.messages);
    }

    return {
        render: render,
        build_message_table: build_message_table,
    };
})();
