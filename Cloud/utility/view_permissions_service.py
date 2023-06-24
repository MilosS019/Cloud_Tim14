import json
import boto3
import json


dynamodb = boto3.resource('dynamodb')

file_permission_table_name = "file-permissions"
file_permissions_table = dynamodb.Table(file_permission_table_name)


def save_permission(request_body, granted_by_user):
    file_permissions_table.put_item(
        Item={
            'granted_user': request_body['granted_user'],
            'granted_by_user': granted_by_user,
            'file_path': request_body['file_path'],
        })


def get_all_permissions_for_granted_user(granted_user):

    response = file_permissions_table.scan()
    items = response.get('Items', [])

    permissions = [item for item in items]
    granted_user_permissions = []

    for permission in permissions:
        if permission['granted_user'] == granted_user:
            granted_user_permissions.append(permission)
    return granted_user_permissions


def is_user_already_have_permission(body_request, granted_by_user):
    granted_user = body_request["granted_user"]
    file_path = body_request["file_path"]

    granted_user_permissions = get_all_permissions_for_granted_user(
        granted_user)

    for granted_user_permission in granted_user_permissions:
        if granted_user_permission['file_path'] == file_path and granted_user_permission['granted_by_user'] == granted_by_user:
            return True
    return False


def remove_permission_service(body_request):
    file_permissions_table.delete_item(
        Key={
            "granted_user": body_request["granted_user"],
            "file_path": body_request["file_path"]
        }
    )
