async function render(config) {
    const pane = $("<div>");

    const right = $("<div>");
    const left = $("<div>");

    pane.css("display", "flex");

    for (const conf of config) {
        const button = $("<button>").text(conf.label);
        const div = $("<div>").html(button);

        right.append(div);

        button.on("click", async () => {
            left.html("loading...");
            const left_contents = await conf.view();
            left.empty();
            left.append(left_contents);
        });

        button.css("width", "90%");
    }

    const left_contents = await config[0].view();
    left.html(left_contents);

    pane.append(right);
    pane.append(left);

    return pane;
}

window.split_pane = {
    render: render,
};
