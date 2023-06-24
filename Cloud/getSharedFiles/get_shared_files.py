import boto3
from utility.utils import create_response


def get_shared_files(event, context):
    try:
        dynamodb = boto3.client('dynamodb')

        email = event['requestContext']['authorizer']['claims']['email']        
        # Specify the table name and partition key value
        table_name = 'meta-data'
        partition_key_value = email

        # Create the query parameters
        query_params = {
            'TableName': table_name,
            'KeyConditionExpression': 'PartitionKey = :partitionkeyval',
            'ExpressionAttributeValues': {
                ':partitionkeyval': {'S': partition_key_value}
            }
        }

        # Perform the query operation
        response = dynamodb.query(**query_params)

        # Retrieve the items from the response
        items = response['Items']
        folders = []
        files  = []
        for item in items:
            if item['file_path'][-1] == "/":
                folder_name = item['file_path'].split("/")[-2]
                folders.append[folder_name]
            else:
                file_name = item['file_path'].split("/")[-1]
                files.append[file_name]
        return create_response(200, {"folders" : folders, "files" : files})
    except Exception as e:
        return create_response(500, e)
    