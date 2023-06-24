import json
import boto3
from utility.utils import create_response
from utility.user_service import *

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('userTable')


def get_all_users(event, context):
    users = fetch_users()
    return create_response(200, users)
