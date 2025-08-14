from odoo import http


class ProductController(http.Controller):
    #  getHttpService: function () {
    #         ajax.jsonRpc('/owl/get_products', 'call', {})
    #             .then(response => {
    #                 this.state.get_http_data = response;
    #                 this.renderElement();
    #             });
    #     },

    #     postHttpService: function () {
    #         ajax.jsonRpc('/owl/post_product', 'call', { 
    #             title: "BMW Pencil" 
    #         }).then(response => {
    #             this.state.post_http_data = response;
    #             this.renderElement();
    #         });
    #     },

    @http.route('/owl/get_products', type='json', auth='user')
    def get_products(self):
        return {
            "products": [
                {
                    "id": 1,
                    "name": "BMW Pencil",
                    "price": 10.0
                }
            ]
        }

    @http.route('/owl/post_product', type='json', auth='user')
    def post_product(self, title):
        return {
            "product": {
                "id": 2,
                "name": title,
                "price": 10.0
            }
        }