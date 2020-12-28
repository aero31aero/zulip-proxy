window.topic_view = (() => {
    function make(recipient) {
        let div;
        let message_div;

        function render() {
            div = $('<div>').addClass('topic-view');

            message_div = $('<div>')
                .addClass('message-list')
                .addClass('flex-main');

            div.empty();
            div.append(message_div);
            div.append(compose_box.build(recipient));

            update();

            return div;
        }

        function update() {
            message_div.empty();
            const messages = _.find_topic_messages(recipient);
            const message_table = window.messages.build_message_table(messages);
            message_div.append(message_table);
        }

        return {
            render,
            update,
        };
    }

    return {
        make,
    };
})();
