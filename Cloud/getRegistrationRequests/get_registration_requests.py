import json
import boto3
from utility.utils import *
from utility.registration_request_service import *

dynamodb = boto3.resource('dynamodb')

registration_request_table_name = "registrationRequestTable2"
registration_request_table = dynamodb.Table(registration_request_table_name)


def get_requests(event, context):
    try:
        logged_user_email = get_logged_user_email(event)
        logged_user_requests = get_all_registration_request_for_inviter(
            logged_user_email)
        return create_response(200, logged_user_requests)
    except Exception as e:
        return create_response(400, str(e))
