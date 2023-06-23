import json
import boto3
from utility.utils import create_response

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('userTable')


def save(event, context):
    body_message = {'message': ''}
    try:
        print(event)
        request_body = json.loads(event['body'])
        is_request_valid(request_body)
        is_user_exist(request_body["email"])
        save_user(request_body)

        message = 'Registration successful'
        return create_response(200, message)
    except Exception as e:
        return create_response(400, str(e))


def is_request_valid(body_request):
    email = body_request["email"]
    password = body_request["password"]
    name = body_request["name"]
    lastname = body_request["lastname"]
    birthday = body_request["birthday"]

    if not email or not password or not name or not lastname or not birthday:
        raise Exception("All fields are required!")

    if any(not field for field in (password, name, lastname, birthday, email)):
        raise Exception("Fields cannot be empty!")


def is_user_exist(user_email):
    existing_user = table.get_item(Key={'email': user_email})
    if existing_user.get('Item'):
        raise Exception("User already exists!")


def save_user(request_body):
    response = table.put_item(
        Item={
            'email': request_body["email"],
            'password': request_body["password"],
            'name': request_body["name"],
            'lastname': request_body["lastname"],
            'birthday': request_body["birthday"],
        })
