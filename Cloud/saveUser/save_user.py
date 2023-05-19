import json
import boto3
from utility.utils import create_response


dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('userTable')


def save(event, context):

    body_message = {
        'message': ''
    }

    body = json.loads(event['body'])

    email = body['email'].strip()
    password = body['password'].strip()
    name = body['name'].strip()
    lastname = body['lastname'].strip()
    birthday = body['birthday'].strip()

    if not password or not name or not lastname or not email or not birthday:
        message = 'All fields are required!'
        body_message['message'] = message
        return create_response(400, body_message)

    if any(not field for field in (password, name, lastname, birthday, email)):
        message = 'Fields cannot be empty!'
        body_message['message'] = message
        return create_response(400, body_message)

    existing_user = table.get_item(Key={'username': email})
    if existing_user.get('Item'):
        message = 'User already exists!'
        body_message['message'] = message
        return create_response(400, body_message)

    response = table.put_item(
        Item={
            'email': email,
            'password': password,
            'name': name,
            'lastname': lastname,
            'birthday': birthday,
        })


# return a properly formatted JSON object
    message = 'Registration successful'
    return create_response(200, message)
