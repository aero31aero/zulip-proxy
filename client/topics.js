window.topics = (() => {
    function make_view(stream_id) {
        function right_handler(topic_name) {
            const compose_widget = {
                render: () => {
                    const widget = compose_box.build({
                        stream_id: stream_id,
                        topic: topic_name,
                    });
                    // _.set_pane_title(...);
                    return widget;
                },
            };
            return compose_widget;
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
        };

        const pane_widget = split_pane.make(opts);

        return pane_widget;
    }

    return {
        make_view,
    };
})();
