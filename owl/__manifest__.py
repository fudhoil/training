# -*- coding: utf-8 -*-
{
    'name' : 'OWL',
    'version' : '1.1',
    'summary': 'OWL',
    'description': """OWL""",
    'category': 'OWL',
    'depends' : ['base', 'web'],
    'data': [
        'views/assets.xml',
        'views/odoo_services.xml',
    ],
    'qweb': [
        'static/src/services/odoo_services.xml'
    ],
    'installable': True,
    'application': True,
}