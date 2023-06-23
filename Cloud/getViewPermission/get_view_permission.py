import json
import boto3
from utility.utils import *

file_permission_table_name = "file-permissions"

dynamodb = boto3.resource('dynamodb')

file_permissions_table = dynamodb.Table(file_permission_table_name)

dynamodb = boto3.resource('dynamodb')


def get_permissions(event, context):
    logged_user_email = get_logged_user_email(event)

    permissions = query_table(file_permissions_table,
                              "granted_user", logged_user_email)
    return create_response(200, permissions)
