import { useEffect, useState } from "react";
import axios from "axios";

import "../../styles/Chat.css";

function Chat() {
  const [query, setQuery] = useState(null);

  function handleKeyDown(e) {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      console.log(e.target.value);
      
      setQuery(e.target.value);
      console.log(query);
      
    }
  }

  useEffect(() => {
    if (query) {
      axios
        .post("http://localhost:8000/send_message", { query: query })
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [query]);

  return (
    <>
      <h1>Welcome to LEGalGEN</h1>
      <p>The power of AI at your service - Tame the knowledge !</p>
      <textarea
        className="chat-input"
        type="text"
        placeholder="Ask your AI advisor..."
        onKeyDown={handleKeyDown}
      />
    </>
  );
}

export default Chat;
