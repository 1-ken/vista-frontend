import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Bot } from 'lucide-react';

const ChatDrawer = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "We're online and ready to help. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnectingToAgent, setIsConnectingToAgent] = useState(false);
  const [isOffline, setIsOffline] = useState(false); // Set to true when team is away
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Simulate checking online/offline status
  useEffect(() => {
    // Example: You can set isOffline based on time or API response
    // For demo, let's assume online mode. Set to true for offline simulation
    setIsOffline(false);
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate bot processing
    setTimeout(() => {
      // Add acknowledgment message
      const acknowledgmentMessage = {
        id: Date.now() + 1,
        text: "Thank you for your message. Let me check on that for you.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, acknowledgmentMessage]);
      
      // Check if offline or need human agent
      setTimeout(() => {
        if (isOffline) {
          // Offline scenario
          const offlineMessage = {
            id: Date.now() + 2,
            text: "Our team is currently away. A consultant will respond to your message as soon as possible. Thank you for your patience.",
            sender: 'bot',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, offlineMessage]);
          setIsTyping(false);
        } else {
          // Online scenario - escalate to human agent
          setIsConnectingToAgent(true);
          
          const escalationMessage = {
            id: Date.now() + 2,
            text: "I'm connecting you with a consultant now. Please stay with us.",
            sender: 'bot',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, escalationMessage]);
          
          // Simulate agent connection delay
          setTimeout(() => {
            const closingMessage = {
              id: Date.now() + 3,
              text: "If you need further assistance, feel free to reply here. We'll get back to you promptly.",
              sender: 'bot',
              timestamp: new Date()
            };
            setMessages(prev => [...prev, closingMessage]);
            setIsTyping(false);
            setIsConnectingToAgent(false);
          }, 2000);
        }
      }, 1500);
    }, 1000);
  };

  // Optional: Show typing indicator while waiting for user input
  const showTypingPrompt = () => {
    if (messages.length === 1 && !input && !isTyping) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-start mt-2"
        >
          <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-none">
            <p className="text-xs text-white/50 italic">
              Please feel free to type your question or concern below.
            </p>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
          />

          {/* DRAWER */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-[450px] bg-gradient-to-br from-[#0A0A0A] to-[#002B2A] text-white z-[9999] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* SUBTLE TEXTURE OVERLAY */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]" />

            {/* HEADER */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center relative z-10 bg-black/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                  <Bot size={20} className="text-black" />
                </div>
                <div>
                  <h2 className="text-lg font-serif text-accent tracking-tight leading-tight">
                    VistaVoyage Chat
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full animate-pulse ${isOffline ? 'bg-gray-500' : 'bg-green-500'}`} />
                    <span className="text-[10px] uppercase tracking-widest text-white/40">
                      {isOffline ? 'Offline Support' : 'Online Support'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors group"
              >
                <X size={20} className="text-white group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* MESSAGES AREA */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative z-10">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                      msg.sender === 'user' ? 'bg-primary' : 'bg-white/10 border border-white/10'
                    }`}>
                      {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} className="text-accent" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-primary text-white rounded-tr-none shadow-lg' 
                        : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-none'
                    }`}>
                      {msg.text}
                      <p className={`text-[9px] mt-2 opacity-30 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Typing prompt for initial interaction */}
              {showTypingPrompt()}
              
              {/* Bot typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
                      <Bot size={14} className="text-accent" />
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Connecting to agent indicator */}
              {isConnectingToAgent && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-accent/10 border border-accent/20 p-3 rounded-2xl rounded-tl-none">
                    <p className="text-xs text-accent">
                      Connecting to consultant...
                    </p>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT AREA */}
            <div className="p-6 bg-black/40 border-t border-white/10 relative z-10">
              <form onSubmit={handleSend} className="relative">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 pr-16 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all placeholder:text-white/20 text-sm"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isConnectingToAgent}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-black hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-glow"
                >
                  <Send size={18} />
                </button>
              </form>
              <p className="text-[10px] text-center mt-4 text-white/20 uppercase tracking-[0.2em]">
                VistaVoyage Virtual Concierge
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatDrawer;