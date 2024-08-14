"use client"
import { useState } from "react";
import Image from "next/image";


export default function Home() {
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState([]);

  const handleSendMessage = async () => {
    const res = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    console.log("data:", data);

    setResponses([...responses, { message, response: data.content }]);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-[#040d17] text-white">
      <nav className="flex justify-between items-center p-4">
        <h1 className="text-xl font-semibold">
          Talk to <span className="highlighted-text">Lola</span>
        </h1>
      </nav>
      <div className="chat">
        <div className="response">
          {responses.map((res, index) => (
            <div key={index}>
              <p className="chat-line user-chat">
                <Image className="avatar" alt="avatar" width={40} height={40} src="/user.jpg" />
                <strong>  </strong> {res.message}
              </p>
              <p className="chat-line ai-chat">
                <Image className="avatar" alt="avatar" width={40} height={40} src="/LolaLogo.svg" />
                <strong>   </strong> {res.response}
              </p>
            </div>
          ))}
        </div>
        <div className="chat-form">
          <input
            name="input-field"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleSendMessage} className="send-button"></button>
        </div>
      </div>
    </div>
  );
}
