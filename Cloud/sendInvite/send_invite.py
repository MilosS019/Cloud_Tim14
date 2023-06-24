import json
import boto3
from utility.utils import *


def send_invite(event, context):
    try:
        request_body = json.loads(event['body'])
        logged_user_email = get_logged_user_email(event)
        receiver = request_body["receiver_email"]

        send_email(logged_user_email, receiver, "Invite",
                   "http://localhost:4200/register-family-member")
        return create_response(200, {"message": "Invitation successfully sent!"})
    except Exception as e:
        return create_response(400, str(e))
