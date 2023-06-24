import json
import boto3
from utility.utils import create_response
from utility.utils import query_table

dynamodb = boto3.resource('dynamodb')
user_table_name = 'userTable'
user_table = dynamodb.Table(user_table_name)


def fetch_users():
    response = user_table.scan()
    items = response.get('Items', [])
    users = [item for item in items]
    return users


def save_user(request_body):
    response = user_table.put_item(
        Item={
            'email': request_body["email"],
            'password': request_body["password"],
            'name': request_body["name"],
            'lastname': request_body["lastname"],
            'birthday': request_body["birthday"],
        })


def is_user_exist(user_email):
    existing_user = query_table(
        table_name=user_table_name, key="email", value=user_email)

    if len(existing_user) != 0:
        return True
    else:
        return False
