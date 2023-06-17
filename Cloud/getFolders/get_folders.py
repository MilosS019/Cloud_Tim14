import boto3
from utility.utils import create_response


def get_all_folders(event, context):
    try:
        s3 = boto3.client('s3')
        response = s3.list_objects_v2(Bucket="tim7-project-files-bucket")
        keys = []
        if 'Contents' in response:
            keys = [obj['Key'] for obj in response['Contents']]
        email = keys[0].split("/")[0]
        folders, folders_size = getFoldersByLevel(keys, email)
        files = getFiles(email + "/")
        return_obj = {"folders":folders, "folders_size":folders_size, "files": files}
        return create_response(200, return_obj)
    except Exception as e:
        return create_response(500, e)
    
def getFoldersByLevel(keys, email):
    folders = {email : []}
    folders["SignedUserEmail"] = email
    folder_size = { email:0 }
    for key in keys:
        items = key.split("/")        
        prev_item = items[0]
        for index in range(1, len(items)):
            if index == len(items) - 1 and items[index] != "":
                folder_size[prev_item] += 1
                break
            folder_size[prev_item] += 1
            folders[prev_item].append(items[index])
            if items[index] not in folders:
                folder_size[items[index]]  = 0
                folders[items[index]] = []
            prev_item = items[index]

    return folders, folder_size

def getFiles(folder_path):
    s3 = boto3.client('s3')
    response = s3.list_objects_v2(Bucket="tim7-project-files-bucket", Prefix=folder_path, Delimiter='/')
    files = []

    if 'Contents' in response:
        for obj in response['Contents']:
            if not obj['Key'].endswith('/'):  # Exclude subfolders
                files.append(obj['Key'])

    return files