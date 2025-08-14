odoo.define('owl.odoo_services', function (require) {
    "use strict";

    const AbstractAction = require('web.AbstractAction');
    const core = require('web.core');
    const session = require('web.session');
    const rpc = require('web.rpc');
    const Dialog = require('web.Dialog');
    const Notification = require('web.Notification');
    const Framework = require('web.framework');
    const ajax = require('web.ajax');

    const qweb = core.qweb;
    const _t = core._t;

    const OdooServices = AbstractAction.extend({
        template: 'owl.OdooServices',
        events: _.extend({}, AbstractAction.prototype.events, {
            'click #btn_notification': 'showNotification',
            'click #btn_dialog': 'showDialog',
            'click #btn_effect': 'showEffect',
            'click #btn_cookie': 'setCookieService',
            'click #btn_http_get': 'getHttpService',
            'click #btn_http_post': 'postHttpService',
            'click #btn_rpc': 'getRpcService',
            'click #btn_action': 'getActionService',
            'click #btn_router': 'getRouterService',
            'click #btn_user': 'getUserService',
            'click #btn_company': 'getCompanyService',
        }),

        init: function (parent, action) {
            this._super(parent, action);
            this.state = {
                dark_theme: false,
                output_data: '',
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
            Framework.blockUI();
            setTimeout(() => {
                Framework.unblockUI();
            }, 2000);
        },

        setCookieService: function () {
            this.state.dark_theme = !this.state.dark_theme;
            document.cookie = `dark_theme=${this.state.dark_theme}; path=/; max-age=31536000`;
            this.renderElement();
        },

        getHttpService: function () {
            ajax.jsonRpc('/owl/get_products', 'call', {})
                .then(response => {
                    this.state.output_data = response;
                    this.renderElement();
                });
        },

        postHttpService: function () {
            ajax.jsonRpc('/owl/post_product', 'call', { 
                title: "BMW Pencil" 
            }).then(response => {
                this.state.output_data = response;
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
                this.state.output_data = data;
                this.renderElement();
            });
        },

        getUserService: function () {
            this.state.output_data = session.uid;
            this.renderElement();
        },

        getCompanyService: function () {
            this.state.output_data = session.company_id;
            this.renderElement();
        },

        getRouterService: function () {
            const [base, hash] = window.location.href.split('#');
            const url = new URL(base, window.location.origin);
        
            const currentDebug = url.searchParams.get('debug');
            if (currentDebug === '1') {
                url.searchParams.delete('debug');
            } else {
                url.searchParams.set('debug', '1');
            }
        
            window.location.href = url.pathname + url.search + (hash ? '#' + hash : '');
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