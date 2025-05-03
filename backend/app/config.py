from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyUrl, Field

class Settings(BaseSettings):
    MINIO_ENDPOINT: str = Field(..., alias="MINIO_ENDPOINT")
    MINIO_ACCESS_KEY: str = Field(..., alias="MINIO_ACCESS_KEY")
    MINIO_SECRET_KEY: str = Field(..., alias="MINIO_SECRET_KEY")
    MINIO_BUCKET: str = Field("moroccan-legal-docs", alias="MINIO_BUCKET")
    MINIO_SECURE: bool = Field(False, alias="MINIO_SECURE")

    QDRANT_URL: str = Field(..., alias="QDRANT_URL")
    QDRANT_API_KEY: str = Field("", alias="QDRANT_API_KEY")
    QDRANT_COLLECTION: str = Field("", alias="QDRANT_COLLECTION")

    EMBEDDING_MODEL: str = Field("llama2", alias="EMBEDDING_MODEL")
    OPENAI_API_KEY: str = Field("", alias="OPENAI_API_KEY")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True
        extra = "ignore"

settings = Settings()