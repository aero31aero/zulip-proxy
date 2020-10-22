window.streams = (() => {
    function make() {
        function build_stream_view(stream) {
            return () => {
                return $('<pre>').text(stream.description);
            };
        }

        async function render() {
            const streams = model().streams;

            const conf = streams.map((stream) => ({
                label: stream.name,
                view: build_stream_view(stream),
            }));

            // TODO: persist the widget
            const pane_widget = split_pane.make(conf, 'streams');
            const pane = await pane_widget.render();

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
