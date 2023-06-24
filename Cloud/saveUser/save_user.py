import json
import boto3
from utility.utils import *
from utility.user_service import *

dynamodb = boto3.resource('dynamodb')
user_table_name = "userTable"
registration_request_table_name = "registrationRequestTable2"

user_table = dynamodb.Table(user_table_name)
registration_request_table = dynamodb.Table(registration_request_table_name)


def save(event, context):
    try:
        request_body = json.loads(event['body'])

        _is_request_valid(request_body)
        _is_user_exist(request_body["email"])

        save_user(request_body)

        return create_response(200, {"message": "Registration successful"})

    except Exception as e:
        return create_response(400, str(e))


def _is_request_valid(body_request):
    email = body_request["email"]
    password = body_request["password"]
    name = body_request["name"]
    lastname = body_request["lastname"]
    birthday = body_request["birthday"]

    if not email or not password or not name or not lastname or not birthday:
        raise Exception("All fields are required!")

    if any(not field for field in (password, name, lastname, birthday, email)):
        raise Exception("Fields cannot be empty!")


def _is_user_exist(user_email):
    if is_user_exist(user_email):
        raise Exception("User already exists!")
