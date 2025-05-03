from app.document_processor import DocumentProcessor
from app.chat_engine import ChatEngine

class RAGChatbot:
    def __init__(self):
        self.document_processor = DocumentProcessor()
        self.chat_engine = ChatEngine()
    
    def upload_document(self, file_path):
        print(file_path)
        try:
            self.document_processor.process_document(file_path)
            return "Document processed successfully."
        except ValueError as e:
            return f"Error : {str(e)}"
    
    def send_message(self, message):
        print("Query : " + message)
        relevant_docs = self.document_processor.retrieve_relevant_context(message)
        context = ""

        for doc in relevant_docs:
            source = doc.metadata.get('source', 'unknown')
            content = doc.page_content
            context += f"Source: {source}\n{content}\n\n"
        
        print("Built Context : " + context)

        return self.chat_engine.send_message(message, context)
    
    def reset_conversation(self):
        self.chat_engine.reset_chat()
        return "Chat history has been reset."

    def reset_documents(self):
        self.document_processor.reset_vectors()
        return "Documents have been reset."
    
    def reset_all(self):
        self.reset_conversation()
        self.reset_documents()
        return "Both conversation history and document knowledge have been reset."