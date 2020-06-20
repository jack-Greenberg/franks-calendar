from flask import Flask
from .config import DevelopmentConfig, ProductionConfig
from .blueprints.api import API

"""
Register API from modules/api.py
From http://flask.pocoo.org/docs/1.0/views/#method-views-for-apis
"""

def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)

    from .blueprints.public import public
    app.register_blueprint(public)

    def register_api(view, endpoint, url, pk='id', pk_type='string'):
        view_func = view.as_view(endpoint)
        app.add_url_rule(url, defaults={pk: None},
                         view_func=view_func, methods=['GET',])
        app.add_url_rule(url, view_func=view_func, methods=['POST',])
        app.add_url_rule('%s<%s:%s>' % (url, pk_type, pk), view_func=view_func, methods=['POST', 'GET', 'PUT', 'DELETE'])

    register_api(API, 'api', '/api/v1/', pk='id', pk_type='int')

    return app

app = create_app(DevelopmentConfig)

if __name__ == '__main__':
    app.run(host="0.0.0.0")
