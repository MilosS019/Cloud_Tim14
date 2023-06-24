import json
import boto3
from utility.utils import *
from utility.registration_request_service import *
from utility.user_service import *
from utility.view_permissions_service import save_permission

dynamodb = boto3.resource('dynamodb')

registration_request_table_name = "registrationRequestTable2"
registration_request_table = dynamodb.Table(registration_request_table_name)


def accept_request(event, context):
    try:
        request_body = json.loads(event['body'])

        invited_user_email = request_body["invited_user_email"]

        logged_user_email = get_logged_user_email(event)
        registration_request = get_registration_request(
            logged_user_email, invited_user_email)
        print(registration_request)
        create_and_verify_cognito_user(
            invited_user_email, registration_request['password'])
        remove_registration_request(invited_user_email, logged_user_email)

        user = _convert_registration_request_to_user(registration_request)
        save_user(user)

        permission = _create_permission(invited_user_email, logged_user_email)
        save_permission(permission, logged_user_email)
        return create_response(200, {"message": "User successfully verified!"})

    except Exception as e:
        return create_response(400, str(e))


def _convert_registration_request_to_user(registration_request):
    user = {}
    user["email"] = registration_request["invited_user_email"]
    user["password"] = registration_request["password"]
    user["name"] = registration_request["name"]
    user["lastname"] = registration_request["lastname"]
    user["birthday"] = registration_request["birthday"]
    return user


def _create_permission(granted_user, granted_by_user):
    permission = {
        'granted_user': granted_user,
        'file_path': (granted_by_user + "/"),
    }

    return permission
