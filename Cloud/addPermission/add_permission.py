import json
import boto3
import json
from utility.utils import *
from utility.user_service import *
from utility.view_permissions_service import *


dynamodb = boto3.resource('dynamodb')

file_permission_table_name = "file-permissions"
file_permissions_table = dynamodb.Table(file_permission_table_name)


def add_permission(event, context):

    try:
        request_body = json.loads(event['body'])
        email = event['requestContext']['authorizer']['claims']['email']        
        logged_user_email = get_logged_user_email(event)

        _is_request_valid(request_body)
        _is_granted_user_exist(request_body)
        _is_user_already_have_permissions(request_body, logged_user_email)
        request_body["file_path"] = email + request_body["file_path"]; 
        save_permission(request_body, logged_user_email)

        return create_response(
            200, {"message": f"You have successfully granted permissions to user: {request_body['granted_user']}"})

    except Exception as e:
        return create_response(400, str(e))


def _is_request_valid(body_request):
    granted_user = body_request["granted_user"]
    file_path = body_request["file_path"]
    if not granted_user or not file_path:
        raise Exception("All fields are required!")


def _is_user_already_have_permissions(body_request, logged_user_email):

    if is_user_already_have_permission(body_request, logged_user_email):
        raise Exception("User already granted permission!")


def _is_granted_user_exist(request_body):
    granted_user_email = request_body['granted_user']

    if not is_user_exist(granted_user_email):
        raise Exception(f"User with email {granted_user_email} not exist!")
