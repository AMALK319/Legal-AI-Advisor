from pydantic import BaseModel
from typing import Union

class UploadResponse(BaseModel):
    status: str
    minio_path: str

class RAGRequest(BaseModel):
    query: str 

class RAGResponse(BaseModel):
    status: str
    response: Union[str, list[Union[str, dict]]]