window.messages = (() => {
    function build_message_table(messages) {
        const message_ul = $('<ul>').addClass('message-list-wrapper');

        for (let i = 0; i < messages.length; i++) {
            if (
                i == 0 ||
                messages[i - 1].sender_full_name != messages[i].sender_full_name
            ) {
                // add names as separate <li>s without repetition
                const name = $('<li>').addClass('name');
                name.append($('<b>').text(messages[i].sender_full_name));
                message_ul.append(name);
            }
            const li = $('<li>').addClass('message');
            li.append(messages[i].content);
            message_ul.append(li);
        }

        return message_ul;
    }

    return {
        build_message_table: build_message_table,
    };
})();
