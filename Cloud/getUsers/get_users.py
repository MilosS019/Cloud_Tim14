import json
import boto3
from utility.utils import create_response

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('userTable')


def get_all_users(event, context):
    response = table.scan()
    items = response.get('Items', [])

    if not items:
        message = 'No users found'
        return create_response(404, {'message': message})

    users = [item for item in items]
    return create_response(200, users)
