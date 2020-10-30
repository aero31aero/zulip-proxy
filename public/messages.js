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

    return {
        build_message_table: build_message_table,
    };
})();
