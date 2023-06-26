import json
import boto3
from utility.utils import create_response
from utility.utils import sendToSqs
from utility.utils import deleteSharedInformation
from utility.view_permissions_service import save_permission

def update_shared_meta_data(event, contenxt):
    try:
        dynamodb = boto3.resource('dynamodb')

        table = dynamodb.Table('file-permissions')

        body = json.loads(event['body'])
        email = body["email"]
        oldPath = body['oldPath']
        newPath = body['newPath']

        granted_user = deleteSharedInformation(table, email, oldPath)
        if granted_user != "":
            save_permission({"granted_user": granted_user, "file_path":newPath}, email)

        return create_response(200, {"email":email, "message":oldPath + " moved to " + newPath, "subject": "File edit"})

    except Exception as e:
        return create_response(500, e)