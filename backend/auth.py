from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from backend.utils.security import decode_token
from backend.database.users import get_user_by_email

security = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials

    payload = decode_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    email = payload.get("sub")

    user = get_user_by_email(email)

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user