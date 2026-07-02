from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask import g

def get_user_id_or_ip():
    if hasattr(g, 'user_id') and g.user_id:
        return g.user_id
    return get_remote_address()

limiter = Limiter(
    key_func=get_user_id_or_ip,
    storage_uri="memory://",
)
