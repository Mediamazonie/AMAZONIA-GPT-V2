import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);

  const sendMessage = async () => {
    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

    const formData = new FormData();
    if (image) {
      formData.append("image", image);
      formData.append("prompt", input);

      const res = await axios.post("http://localhost:3001/api/vision", formData);
      const assistantMessage = { role: "assistant", content: res.data.response };
      setMessages([...updatedMessages, assistantMessage]);
      setImage(null);
    } else {
      const res = await axios.post("http://localhost:3001/api/chat", { messages: updatedMessages });
      const assistantMessage = res.data.choices[0].message;
      setMessages([...updatedMessages, assistantMessage]);
    }
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>GPT-4 Chat App + Vision + Text-to-Image</h1>
      <div>
        {messages.map((m, i) => (
          <p key={i}><strong>{m.role}:</strong> {m.content}</p>
        ))}
      </div>
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} style={{ width: '80%' }} />
      <input type="file" onChange={handleFileChange} />
      <button onClick={sendMessage}>Envoyer</button>
    </div>
  );
}

export default App;
