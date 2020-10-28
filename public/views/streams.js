window.streams = (() => {
    function make() {
        function build_stream_view(stream) {
            return () => {
                return $('<pre>').text(
                    stream.description || `${stream.name} needs description`
                );
            };
        }

        const streams = model().streams;
        const conf = streams.map((stream) => ({
            label: stream.name,
            view: {
                render: build_stream_view(stream),
            },
        }));

        const pane_widget = split_pane.make(conf, 'streams');

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
