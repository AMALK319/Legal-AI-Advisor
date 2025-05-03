from langchain_ollama import ChatOllama
from langchain.schema.messages import SystemMessage, HumanMessage, AIMessage
from langchain.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder
from app.config import settings

class ChatEngine:
    def __init__(self):
      self.llm = ChatOllama(model="llama2", temperature=1.5, presence_penalty=0.1) 
      self.system_message = SystemMessage(
        "You are a trusted legal assistant for moroccan law that answers based on context and conversation history."
      ) 
      self.prompt = ChatPromptTemplate.from_messages([
            SystemMessagePromptTemplate.from_template(template=self.system_message.content),
            MessagesPlaceholder(variable_name="chat_history"), 
            HumanMessagePromptTemplate.from_template(
              template="Context: \n {context} \n \nQuestion: {question}"
            )
      ])
      self.chat_history = []
    

    def send_message(self, user_message, context=""):
        message = self.prompt.format_messages(
            context=context,
            question=user_message,
            chat_history=self.chat_history 
        )

        response = self.llm.invoke(message)

        self.chat_history.extend([
            HumanMessage(content=user_message),
            AIMessage(content=response.content)
        ])

        return response.content

    def reset_chat(self):
       self.chat_history.clear()