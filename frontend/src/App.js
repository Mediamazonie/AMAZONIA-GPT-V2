import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);

  const sendMessage = async () => {
    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
  
    console.log("➡️ Envoi de la requête avec messages :", updatedMessages); // ← Nouveau log
  
    setMessages(updatedMessages);
    setInput("");
  
    try {
      const res = await axios.post("http://localhost:3001/api/chat", {
        messages: updatedMessages
      });
  
      console.log("✅ Réponse API reçue :", res.data); // ← Tu l'avais déjà, nickel
  
      const assistantMessage = res.data.choices?.[0]?.message;
      console.log("🤖 Message assistant extrait :", assistantMessage); // ← Nouveau log
  
      if (assistantMessage) {
        setMessages([...updatedMessages, assistantMessage]);
      } else {
        console.warn("⚠️ Aucun message assistant trouvé dans la réponse.");
      }
    } catch (error) {
      console.error("❌ Erreur pendant l'appel API :", error); // ← Log des erreurs
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
