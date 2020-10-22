window.messages = (() => {
    function build_message_table(messages) {
        const message_ul = $('<ul>');

        for (const msg of messages) {
            const li = $('<li>');
            li.append($('<b>').text(msg.sender_full_name));
            li.append($('<br>'));
            li.append(msg.content);
            message_ul.append(li);
        }

        return message_ul;
    }

    function make() {
        let fetched;
        let message_data;
        let div;

        async function get_message_data() {
            const response = await fetch(
                '/z/messages?num_before=15&anchor=newest&num_after=0'
            );
            message_data = await response.json();
            fetched = true;
        }

        function render() {
            div = $('<div>');
            if (fetched) {
                console.info('already fetched!');
                populate(div);
                return div;
            }

            div.html('loading...');
            console.info('loading');
            get_message_data().then(() => {
                populate(div);
            });

            return div;
        }

        function populate(div) {
            const table = build_message_table(message_data.messages);
            div.empty();
            div.append(table);
        }

        return {
            render: render,
        };
    }

    return {
        make: make,
        build_message_table: build_message_table,
    };
})();
