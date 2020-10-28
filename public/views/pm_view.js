window.pm_view = (() => {
    function populate(self, widget_container) {
        message_data = _.find_pms_with(self.user.user_id);
        self.message_table = messages.build_message_table(message_data);
        self.message_table_container = $('<div>').addClass('message-list');
        self.compose_box = compose_box.build_for_user(self.user);
        widget_container.empty();
        widget_container.append();
        self.message_table_container.append(self.message_table);
        widget_container.append(self.message_table_container);
        widget_container.append(self.compose_box);
    }

    function update(self, widget_container, data) {
        message_data = _.find_pms_with(self.user.user_id);
        self.message_table = messages.build_message_table(message_data);
        self.message_table_container.empty();
        self.message_table_container.append(self.message_table);
    }

    function should_update(self, data) {
        return window.widgets.PARTIAL;
    }

    function make(user) {
        function init_self(self) {
            self.user = user;
        }
        const widget = widgets.make({
            name: 'pm-list-widget',
            should_update: should_update,
            populate: populate,
            update: update,
            init_self: init_self,
        });
        return widget;
    }
    return {
        make: make,
    };
})();
