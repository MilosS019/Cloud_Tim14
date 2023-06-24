import json
import boto3
from utility.utils import *
from utility.registration_request_service import *

dynamodb = boto3.resource('dynamodb')

registration_request_table_name = "registrationRequestTable2"
registration_request_table = dynamodb.Table(registration_request_table_name)


def remove_request(event, context):
    try:
        request_body = json.loads(event['body'])

        invited_user_email = request_body["invited_user_email"]
        logged_user_email = get_logged_user_email(event)

        _is_request_exist(invited_user_email, logged_user_email)
        remove_registration_request(invited_user_email, logged_user_email)

        return create_response(200, {"message": "Request successfully deleted!"})

    except Exception as e:
        return create_response(400, str(e))


def _is_request_exist(invited_user_email, logged_user_email):
    if not is_registration_request_exist(logged_user_email, invited_user_email):
        raise Exception("Request not exist")
