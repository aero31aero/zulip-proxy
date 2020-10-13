let stream_data;

async function get_stream_data() {
    if (stream_data === undefined) {
        const response = await fetch('/z/users/me/subscriptions');
        stream_data = await response.json();
    }
    return stream_data;
}

function build_view(stream) {
    return () => {
        return $('<pre>').text(stream.description);
    };
}

async function render() {
    const data = await get_stream_data();
    const streams = data.subscriptions;

    streams.sort((a, b) => a.name.localeCompare(b.name));

    const conf = streams.map((stream) => ({
        label: stream.name,
        view: build_view(stream),
    }));

    const pane = await split_pane.render(conf);

    return pane;
}

window.streams = {
    render: render,
};
