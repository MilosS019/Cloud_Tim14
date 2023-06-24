import json
import boto3
from utility.utils import *
from utility.user_service import *
from utility.registration_request_service import *

dynamodb = boto3.resource('dynamodb')
user_table_name = "userTable"
registration_request_table_name = "registrationRequestTable2"

user_table = dynamodb.Table(user_table_name)
registration_request_table = dynamodb.Table(registration_request_table_name)


def save_request(event, context):
    try:
        request_body = json.loads(event['body'])

        _is_request_valid(request_body)
        _is_inviter_exist(request_body)
        _is_invited_user_registered(request_body)
        _is_inviter_exist(request_body)

        save_registration_request(request_body)
        return create_response(200, {"message": "Request successfully sent!"})
    except Exception as e:
        return create_response(400, str(e))


def _is_request_valid(body_request):
    inviter_email = body_request["inviter_email"]
    password = body_request["password"]
    name = body_request["name"]
    lastname = body_request["lastname"]
    birthday = body_request["birthday"]
    invited_user_email = body_request["invited_user_email"]

    if not invited_user_email or not password or not name or not lastname or not birthday or not inviter_email:
        raise Exception("All fields are required!")

    if any(not field for field in (password, name, lastname, birthday, invited_user_email, inviter_email)):
        raise Exception("Fields cannot be empty!")


def _is_invited_user_registered(request_body):
    if is_user_exist(request_body["invited_user_email"]):
        raise Exception("User already registered!")


def _is_request_valid(body_request):
    required_fields = ["inviter_email", "password", "name",
                       "lastname", "birthday", "invited_user_email"]

    for field in required_fields:
        if field not in body_request:
            raise Exception("Field '{}' is required!".format(field))

    if any(not body_request[field] for field in required_fields):
        raise Exception("Fields cannot be empty!")


def _is_inviter_exist(request_body):
    inviter = query_table(user_table_name, "email",
                          request_body["inviter_email"])
    if len(inviter) == 0:
        raise Exception("Inviter not exist!")
