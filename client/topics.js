window.topics = (() => {
    function make_view(stream_id) {
        function right_handler(topic_name) {
            const recipient = {
                type: 'stream',
                stream_id: stream_id,
                topic: topic_name,
            };
            return window.topic_view.make(recipient);
        }

        function key_to_label(topic_name) {
            return topic_name;
        }

        function get_keys() {
            const topics = _.find_topics_for(stream_id);
            return topics;
        }

        const opts = {
            key_to_label,
            right_handler,
            get_keys,
            hide_left: true,
        };

        const pane_widget = split_pane.make(opts);

        return pane_widget;
    }

    return {
        make_view,
    };
})();
