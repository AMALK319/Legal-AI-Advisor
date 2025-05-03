from minio import Minio
from minio.error import S3Error
from app.config import settings

    

class MinIOClient:
    def __init__(self):
        self.client = Minio(
            settings.MINIO_ENDPOINT,
            access_key=settings.MINIO_ACCESS_KEY,
            secret_key=settings.MINIO_SECRET_KEY,
            secure=settings.MINIO_SECURE
        )
        self.bucket = settings.MINIO_BUCKET
        self._ensure_bucket()

    def _ensure_bucket(self):
        if not self.client.bucket_exists(self.bucket):
            self.client.make_bucket(self.bucket)
    
    def _clear_bucket(self):
        if not self.client.bucket_exists(self.bucket):
            raise ValueError("Bucket does not exist")   
        objects = list(self.client.list_objects(self.bucket))
        for obj in objects:
            self.client.remove_object(self.bucket, obj.object_name)
            

    def upload_to_minio(self, file_stream, object_name) -> str:
        self.client.put_object(
            settings.MINIO_BUCKET, 
            object_name, 
            file_stream,  
            length=-1,
            part_size=10*1024*1024
        )
        print(f"Success: {object_name} uploaded to {self.bucket}")
        return f"{self.bucket}/{object_name}" 

minio_client = MinIOClient()