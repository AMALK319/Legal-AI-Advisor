from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance
from app.config import settings
import os



class DocumentProcessor:
    def __init__(self):
        self.client = QdrantClient(
            url=settings.QDRANT_URL,
            api_key=settings.QDRANT_API_KEY or None
        )
        self.chunk_size = 1000
        self.chunk_overlap = 100
        self.embedding_model = OllamaEmbeddings(model=settings.EMBEDDING_MODEL)
        self.collection_name = settings.QDRANT_COLLECTION

        self._create_collection_if_not_exists()

        self.vector_store = QdrantVectorStore(
            client=self.client,
            collection_name=self.collection_name,
            embedding=self.embedding_model
        )
    
    def _create_collection_if_not_exists(self):
        try:
            self.client.get_collection(self.collection_name)
        except Exception:
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(
                    size=768, 
                    distance=Distance.COSINE  
                )
            )

    def load_document(self, file_path):

        if os.path.exists(file_path) and file_path.endswith('.pdf'):
            loader = PyPDFLoader(file_path)
        else:
            raise ValueError("Invalid File Path")
        return loader.load()

    def process_document(self, file_path):
        docs = self.load_document(file_path)
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=self.chunk_size, chunk_overlap=self.chunk_overlap)
        chunks = text_splitter.split_documents(docs)
        print(len(chunks))
        self.vector_store.add_documents(chunks)

    def retrieve_relevant_context(self, query, k=3):
        if self.vector_store is None:
            return []
        return self.vector_store.similarity_search(query, k=3)
    
    def reset_vectors(self):
        self.vector_store = None



