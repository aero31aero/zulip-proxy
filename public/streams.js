window.streams = (() => {
    function make() {
        const streams = model().streams;
        const stream_map = new Map();

        for (const stream of streams) {
            stream_map.set(stream.stream_id, stream);
        }

        const stream_ids = Array.from(stream_map.keys());

        function right_handler(stream_id) {
            const stream = stream_map.get(stream_id);

            function render() {
                return $('<pre>').text(
                    stream.description || `${stream.name} needs description`
                );
            }

            return {
                view: render,
            };
        }

        function key_to_label(stream_id) {
            return stream_map.get(stream_id).name;
        }

        const opts = {
            keys: stream_ids,
            key_to_label: key_to_label,
            right_handler: right_handler,
        };

        const pane_widget = split_pane.make(opts);

        function render() {
            const pane = pane_widget.render();
            return pane;
        }

        return {
            render: render,
        };
    }

    return {
        make: make,
    };
})();
