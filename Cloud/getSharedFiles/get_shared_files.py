import boto3
from utility.utils import create_response
from utility.utils import query_table

def get_shared_files(event, context):
    try:
        dynamodb = boto3.client('dynamodb')

        email = event['requestContext']['authorizer']['claims']['email']        
        # Specify the table name and partition key value
        response = query_table(
        table_name="file-permissions", key="granted_user", value=email)
        # Retrieve the items from the response
        folders = []
        files  = []
        print(response)
        for item in response:
            if item['file_path'][-1] == "/":
                folders.append(item['file_path'])
            else:
                files.append(item['file_path'])
        
        return_obj = {"folders" : folders, "files" : files}
        print(return_obj)
        return create_response(200, return_obj)
    except Exception as e:
        print(e)
        return create_response(500, e)
    