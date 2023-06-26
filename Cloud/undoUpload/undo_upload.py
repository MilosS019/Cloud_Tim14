import json
import boto3
from utility.utils import create_response


def undo_upload(event, contenxt):
    s3 = boto3.client('s3')
    body = json.loads(event['Cause'])
    content = eval(body["errorMessage"])
    print(content)
    path = content["path"]
    s3.delete_object(Bucket="tim7-project-files-bucket", Key=path)
    return create_response(500, {"code":500, "message":"Meta data failed to upload, file upload has been declined"})
