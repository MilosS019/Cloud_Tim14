import json
import boto3
from utility.utils import *
from utility.view_permissions_service import *

dynamodb = boto3.resource('dynamodb')


file_permission_table_name = "file-permissions"
file_permissions_table = dynamodb.Table(file_permission_table_name)


def get_permissions(event, context):
    logged_user_email = get_logged_user_email(event)

    permissions = get_all_permissions_for_granted_user(logged_user_email)
    return create_response(200, permissions)
