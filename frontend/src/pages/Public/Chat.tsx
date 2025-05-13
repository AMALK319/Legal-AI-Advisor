import { useEffect, useState } from "react";
import axios from "axios";
import Message from "../../components/message/Message";

import "../../styles/Chat.css";

export enum ChatRole{
  USER, SYSTEM
}

export interface ChatMessage{
  id: number,
  role: ChatRole,
  data: string
  
}

let nextId = 0;

function Chat() {
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  console.log(messages);
  

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      console.log((e.target as HTMLTextAreaElement).value);
      setQuery((e.currentTarget as HTMLTextAreaElement).value);
      (e.target as HTMLTextAreaElement).value = "";
    }
  }

  useEffect( () => {
    if (query) {
      console.log(query);
      
      const sendMessage = async () => {
        setMessages(messages => [
            ...messages,
            { id:nextId++, role: ChatRole.USER, data: query }
        ]);
        setIsLoading(true);
        try {
          const res = await axios.post("http://localhost:8000/send_message", { query: query });
          setMessages(prev => [
            ...prev,
            { id: nextId++, role: ChatRole.SYSTEM, data: res.data.response }
          ]);
        } catch (err) {
          console.log(err);
          setMessages(prev => [
            ...prev,
            { id: nextId++, role: ChatRole.SYSTEM, data: "Sorry, an error occurred while processing your request." }
          ]);
        } finally {
          setIsLoading(false);
        }
      }
      sendMessage();
    }
  }, [query]);

  return (
    <div className="chat-container">
      {messages.length==0 && <h1>Welcome to LEGalGEN</h1>}
      {messages.length==0 && <p>What do you want to know today?</p> }
       <div className="messages-container">
        {messages.map(msg => (
          <Message key={msg.id} role={msg.role} data={msg.data} id={msg.id}/>
        ))}
        {isLoading && <p className="system-message">Thinking...</p>}
      </div>
      <textarea
        
        className="chat-input"
        placeholder="Ask your AI advisor..."
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

export default Chat;
