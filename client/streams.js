window.streams = (() => {
    function make_view() {
        function right_handler(stream_id) {
            const compose_widget = {
                render: () => {
                    const widget = compose_box.build({
                        stream_id: stream_id,
                        topic: 'proxy-test-topic',
                    });
                    _.set_pane_title('Stream View', widget);
                    return widget;
                },
            };
            return compose_widget;
        }

        function key_to_label(stream_id) {
            return model.Streams.by_id(stream_id).name;
        }

        function get_keys() {
            return model.Streams.get_keys();
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
