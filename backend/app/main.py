from fastapi import FastAPI, UploadFile, HTTPException, status
from fastapi.responses import RedirectResponse
from fastapi.routing import APIRouter
from fastapi.middleware.cors import CORSMiddleware
from minio.error import S3Error
from app.rag_chatbot import RAGChatbot
from app.utils import save_file
from app.minio_storage import minio_client
from app.schemas import UploadResponse, RAGRequest, RAGResponse
import os
import tempfile
import logging

class MainController:
    def __init__(self):
        self.router = APIRouter()
        self.rag_chatbot = RAGChatbot() 
        self._setup_routes()

    def _setup_routes(self):
        self.router.get("/")(self.root)
        self.router.post("/upload_document")(self.upload_document)
        self.router.post("/send_message")(self.send_message)
        self.router.delete("/reset_chat",status_code=status.HTTP_204_NO_CONTENT,)(self.reset_chat)
        self.router.delete("/reset_docs",status_code=status.HTTP_204_NO_CONTENT,)(self.reset_docs)
        self.router.delete("/reset_all",status_code=status.HTTP_204_NO_CONTENT,)(self.reset_all)

    def root(self):
        return RedirectResponse('/docs')

    async def upload_document(self, file: UploadFile):
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only PDF files allowed")

        try:
            minio_path = minio_client.upload_to_minio(file.file, file.filename)
            logger.info(f"Uploaded to MinIO: {minio_path}")

            with tempfile.NamedTemporaryFile(suffix=".pdf") as tmp_file:
                minio_client.client.fget_object(
                    *minio_path.split("/", 1),
                    tmp_file.name
                )
                result = self.rag_chatbot.upload_document(tmp_file.name)
                
            return UploadResponse(
                status="success",
                minio_path=minio_path
            )
        
        except S3Error as e:
            logger.error(f"MinIO error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Storage service unavailable"
            )
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=str(e)
            )
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Document processing failed"
            )
    def send_message(self, request: RAGRequest):
        try:
            query = request.query
            if not query:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Empty or None Query"
                )
            response = self.rag_chatbot.send_message(query)
            return RAGResponse(
                status="success",
                response=response
            )
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Cannot get response"
            )
    
    def reset_chat(self):
        try:
            response = self.rag_chatbot.reset_conversation()
            logger.info(response)
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Chat reset failed"
            )
    def reset_docs(self):
        try:
            minio_client._clear_bucket()
            response = self.rag_chatbot.reset_documents()
            logger.info(response)
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Documents reset failed"
            )
    def reset_all(self):
        try:
            minio_client._clear_bucket()
            response = self.rag_chatbot.reset_all()
            logger.info(response)
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Reset failed"
            )
        

app = FastAPI()
controller = MainController()
app.include_router(controller.router)
logger = logging.getLogger(__name__)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # React
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)