import logging
from typing import Any

import graphene
from graphene_federation import build_schema, key, provides

log = logging.getLogger(__name__)


@key(fields="id")
class User(graphene.ObjectType):
    id = graphene.ID(required=True)
    username = graphene.String()

    def __resolve_reference(self, info, **kwargs):
        """
        Here we resolve the reference of the user entity referenced by its `id` field.
        """
        print(f"User.subgraph.resolve() kwargs={kwargs}")
        return User(id=self.id, username=f"user_{self.id}")

    # def resolve_id(self, info: graphene.ResolveInfo) -> Any:
    #     print(f"User.resolve_id()")
    #     return self.id

    # def resolve_username(self, info: graphene.ResolveInfo) -> Any:
    #     print(f"User.resolve_username()")
    #     return self.username


class Query(graphene.ObjectType):
    user = graphene.Field(User)
    users = graphene.List(User)

    def resolve_user(self, info, **kwargs):
        print(f"Query.resolve_user() kwargs={kwargs}")
        return User(id="0", username="user0")

    def resolve_users(self, info, **kwargs):
        print(f"Query.resolve_users() kwargs={kwargs}")
        return [
            User(id="0", username="user0"),
            User(id="1", username="user1"),
            User(id="2", username="user2"),
        ]


schema = build_schema(query=Query, enable_federation_2=True)
