import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "./gemini-config";
import "../Styles/chatBot.css";

// ... existing imports ...

function ChatBot() {
  const [messages, setMessages] = useState([
    // Add a welcome message
    {
      text: "Hello! I'm Curetica, your health assistant. How can I help you today?",
      isBot: true
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = { text: inputMessage, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Initialize Gemini AI
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      // Generate response
      const result = await model.generateContent(inputMessage);
      const response = await result.response;
      const botMessage = { text: response.text(), isBot: true };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: "Sorry, I encountered an error. Please try again.", 
        isBot: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-fullpage">
      <div className="chatbot-header">
        <h3>Curetica Chat</h3>
        <p className="chatbot-subtitle">Your AI Health Assistant</p>
      </div>
      
      <div className="chatbot-messages-container">
        {messages.length === 1 && (
          <div className="chat-suggestions">
            <p>You can ask me about:</p>
            <div className="suggestion-buttons">
              <button onClick={() => setInputMessage("What are common symptoms of the flu?")}>
                Flu symptoms
              </button>
              <button onClick={() => setInputMessage("How can I improve my sleep?")}>
                Sleep tips
              </button>
              <button onClick={() => setInputMessage("What's a balanced diet?")}>
                Healthy diet
              </button>
              <button onClick={() => setInputMessage("How much exercise do I need daily?")}>
                Exercise advice
              </button>
            </div>
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.isBot ? 'bot-message' : 'user-message'}`}
          >
            {message.text}
          </div>
        ))}
        {isLoading && (
          <div className="message bot-message loading-message">
            Typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chatbot-input-form">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          className="chatbot-input"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="chatbot-send-btn"
          disabled={isLoading || !inputMessage.trim()}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </form>
    </div>
  );
}

export default ChatBot;