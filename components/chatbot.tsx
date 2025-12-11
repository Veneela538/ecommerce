"use client";
import { MessageCircle, Send } from "lucide-react";
import { useState } from "react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMsg = { sender: "bot", text: data.reply || "No response" };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error contacting server. " + err },
      ]);
    }
  };

  return (
    <div>
      {/* Floating Chat Icon */}
      <button
        onClick={toggleChat}
        className="fixed bottom-5 right-5 bg-gray-700 hover:bg-gray-900 text-white p-4 rounded-full shadow-lg"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 w-80 bg-white shadow-xl rounded-2xl flex flex-col border">
          <div className="bg-gray-700 text-white p-3 rounded-t-2xl font-semibold">
            Chatbot
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto max-h-80">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`my-1 p-2 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-gray-100 self-end text-right"
                    : "bg-gray-200 text-left"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input box */}
          <div className="p-2 border-t flex items-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border rounded-lg p-2 text-sm"
            />
            <button
              onClick={sendMessage}
              className="ml-2 p-2 bg-gray-700 text-white rounded-lg"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
