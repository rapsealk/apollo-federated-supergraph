from typing import Any

from aiohttp import web
from flask import Flask
from graphql_server.flask import GraphQLView

from schema import schema


async def hello(request: web.Request) -> web.Response:
    return web.Response(text="Hello, world")


async def graphql(request: web.Request) -> web.Response:
    params = await request.json()
    # {'variables': None,
    #  'query': 'query SubgraphIntrospectQuery {\n
    #                # eslint-disable-next-line\n
    #                _service {\n
    #                    sdl\n
    #                }\n
    #            }',
    #  'operationName': 'SubgraphIntrospectQuery'
    # }
    # return web.json_response(schema.introspect())
    print(f"query: {params}")
    # print(f"params.query: {params['query']}")
    result = schema.execute(params["query"])
    print(f"result: {result}")
    return web.json_response(result.data)


def main():
    # app = web.Application()
    # app.router.add_route("GET", "/", hello)
    # app.router.add_route("POST", "/", graphql)
    # web.run_app(app)

    app = Flask(__name__)
    app.add_url_rule("/", view_func=GraphQLView.as_view(
        "graphql",
        schema=schema,
    ))

    app.run(host="0.0.0.0", port=8080)


if __name__ == "__main__":
    main()
