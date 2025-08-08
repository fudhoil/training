odoo.define('owl.odoo_services', function (require) {
    "use strict";

    const AbstractAction = require('web.AbstractAction');
    const core = require('web.core');
    const session = require('web.session');
    const rpc = require('web.rpc');
    const Dialog = require('web.Dialog');
    const Notification = require('web.Notification');
    const ajax = require('web.ajax');

    const qweb = core.qweb;
    const _t = core._t;

    const OdooServices = AbstractAction.extend({
        template: 'owl.OdooServices',
        events: _.extend({}, AbstractAction.prototype.events, {
            'click #btn_notification': 'showNotification',
            'click #btn_dialog': 'showDialog',
            'click #btn_effect': function () {
                this.do_notify("Effect", "This is a rainbow effect", true);
            },
            'click #btn_cookie': 'setCookieService',
            'click #btn_http_get': 'getHttpService',
            'click #btn_http_post': 'postHttpService',
            'click #btn_rpc': 'getRpcService',
            'click #btn_orm': 'getOrmService',
            'click #btn_action': 'getActionService',
            'click #btn_router': 'getRouterService',
            'click #btn_user': 'getUserService',
            'click #btn_company': 'getCompanyService',
        }),

        init: function (parent, action) {
            this._super(parent, action);
            this.state = {
                dark_theme: false,
                get_http_data: [],
                post_http_data: [],
                rpc_data: [],
                orm_data: [],
                user_data: '',
                company_data: '',
                bg_success: '0',
                container_class: '',
            };
        },

        willStart: function () {
            return this._super.apply(this, arguments).then(() => {
                console.log("willStart OdooServices");
            });
        },

        start: function () {
            return this._super.apply(this, arguments);
        },

        renderElement: function () {
            this._super.apply(this, arguments);

            // Ensure state is always defined
            this.state = this.state || {};

            // Safely assign container_class
            this.state.container_class = 'o_content' + (this.state.dark_theme ? ' bg-dark text-white' : '');

            const html = qweb.render('owl.OdooServices', {
                ...this.state,
                widget: this,
            });

            const $content = $(html);
            this.$el.empty().append($content);
        },

        showNotification: function () {
            new Notification(this, {
                title: _t("Notification"),
                message: _t("This is a sample notification."),
                type: 'info',
            }).appendTo(this.$el);
        },

        showDialog: function () {
            new Dialog(this, {
                title: _t("Dialog Service"),
                buttons: [
                    {
                        text: _t("Confirm"),
                        classes: 'btn-primary',
                        click: () => console.log("Confirmed"),
                    },
                    {
                        text: _t("Cancel"),
                        close: true,
                    }
                ],
                $content: $('<div>').text("Are you sure you want to continue this action?")
            }).open();
        },

        showEffect: function () {
            this.do_notify("Effect", "This is a rainbow effect", true);
        },

        setCookieService: function () {
            this.state.dark_theme = !this.state.dark_theme;
            document.cookie = `dark_theme=${this.state.dark_theme}; path=/; max-age=31536000`;
            this.renderElement();
        },

        getHttpService: function () {
            ajax.jsonRpc('/owl/get_products', 'call', {})
                .then(response => {
                    this.state.get_http_data = response;
                    this.renderElement();
                });
        },

        postHttpService: function () {
            ajax.jsonRpc('/owl/post_product', 'call', { title: "BMW Pencil" })
                .then(response => {
                    this.state.post_http_data = response;
                    this.renderElement();
                });
        },

        getRpcService: function () {
            rpc.query({
                model: 'res.partner',
                method: 'search_read',
                args: [[], ['name', 'email']],
                kwargs: { limit: 5 },
            }).then(data => {
                this.state.rpc_data = data;
                this.renderElement();
            });
        },

        getOrmService: function () {
            rpc.query({
                model: 'res.partner',
                method: 'search_read',
                args: [[], ['name', 'email']],
            }).then(data => {
                this.state.orm_data = data;
                this.renderElement();
            });
        },

        getUserService: function () {
            this.state.user_data = session.uid;
            this.renderElement();
        },

        getCompanyService: function () {
            this.state.company_data = session.company_id;
            this.renderElement();
        },

        getRouterService: function () {
            this.do_action("base.action_res_users");
        },

        getActionService: function () {
            this.do_action({
                type: "ir.actions.act_window",
                res_model: "res.partner",
                view_mode: "list,form",
                views: [[false, 'list'], [false, 'form']],
                target: "current",
            });
        },
    });

    core.action_registry.add('odoo_services', OdooServices);

    return OdooServices;
});