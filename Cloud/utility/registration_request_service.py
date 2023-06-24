import json
import boto3
from utility.utils import *

dynamodb = boto3.resource('dynamodb')

registration_request_table_name = "registrationRequestTable2"
registration_request_table = dynamodb.Table(registration_request_table_name)


def save_registration_request(request_body):
    registration_request_table.put_item(
        Item={
            'inviter_email': request_body['inviter_email'],
            'password': request_body['password'],
            'name': request_body['name'],
            'lastname': request_body['lastname'],
            'birthday': request_body['birthday'],
            'invited_user_email': request_body['invited_user_email'],
        })


def remove_registration_request(invited_user_email, logged_user_email):
    registration_request_table.delete_item(
        Key={
            "inviter_email": logged_user_email,
            "invited_user_email": invited_user_email}
    )


def is_registration_request_exist(inviter_email, invited_user_email):
    response = registration_request_table.scan()
    items = response.get('Items', [])

    requests = [item for item in items]
    for request in requests:
        if request["invited_user_email"] == invited_user_email and request['inviter_email'] == inviter_email:
            return True
    return False


def get_all_registration_request_for_inviter(inviter_email):
    response = registration_request_table.scan()
    items = response.get('Items', [])

    requests = [item for item in items]
    inviter_user_requests = []
    for request in requests:
        if request["inviter_email"] == inviter_email:
            inviter_user_requests.append(request)
    return inviter_user_requests


def get_registration_request(inviter_email, invited_user_email):
    response = registration_request_table.scan()
    items = response.get('Items', [])

    requests = [item for item in items]
    print(requests)
    for request in requests:
        if request["invited_user_email"] == invited_user_email and request['inviter_email'] == inviter_email:
            return request
    raise Exception("User not found!")
