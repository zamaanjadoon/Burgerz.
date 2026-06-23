import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      parts: [
        {
          text: "Hi there! 🍔 I'm your FAST Burgerz AI Assistant, ready to help you navigate our menu. Ask me about our spiciest burgers, loaded fries, delivery times, or whatever you're craving right now!"
        }
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "🔥 What is the spiciest burger?",
    "🧀 Show me loaded cheesy fries",
    "🍟 Any combo deals for the boys?",
    "🕒 What are your business hours?",
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const newMessages: Message[] = [
      ...messages,
      { role: 'user', parts: [{ text: textToSend }] }
    ];

    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      if (!response.ok) {
        throw new Error('Chat failed');
      }

      const data = await response.json();
      setMessages([
        ...newMessages,
        { role: 'model', parts: [{ text: data.text }] }
      ]);
    } catch (error) {
      console.error(error);
      setMessages([
        ...newMessages,
        {
          role: 'model',
          parts: [{ text: "Oops, I'm having trouble connecting to the grill right now. Please try again in a bit!" }]
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="fixed bottom-6 left-6 z-[140]">
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center h-14 w-14 rounded-full bg-editorial-orange text-black shadow-2xl hover:brightness-110 transition-all select-none cursor-pointer"
        id="ai-assistant-btn"
        title="Open AI Assistant"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={20} className="text-black" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative flex items-center justify-center"
            >
              <MessageSquare size={20} className="text-black" />
              <Sparkles size={10} className="text-black absolute -top-1 -right-1.5 animate-bounce" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.25, type: 'spring', damping: 20 }}
            className="absolute bottom-16 left-0 w-[92vw] sm:w-[350px] h-[450px] bg-editorial-dark border border-editorial shadow-2xl flex flex-col justify-between overflow-hidden rounded-none"
            id="ai-assistant-chat-panel"
          >
            {/* Chat Header */}
            <div className="bg-editorial-darker border-b border-editorial px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-editorial-orange/10 border border-editorial-orange/20 rounded-lg">
                  <Sparkles size={14} className="text-editorial-orange" />
                </div>
                <div>
                  <h4 className="text-xs font-black tracking-wider uppercase text-editorial-cream">FAST Burgerz Bot</h4>
                  <span className="text-[8px] text-green-400 font-mono tracking-widest block uppercase animate-pulse">● Online Grill Assistant</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-editorial-cream/40 hover:text-editorial-cream hover:bg-editorial-cream/5 border border-editorial rounded-lg p-1 transition-all cursor-pointer"
                aria-label="Close Chat"
              >
                <X size={12} />
              </button>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-none text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-editorial-orange text-black font-semibold'
                        : 'bg-editorial-darker border border-editorial text-editorial-cream'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.parts[0]?.text}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-editorial-darker border border-editorial text-editorial-cream max-w-[85%] px-3.5 py-2.5 rounded-none text-xs flex items-center space-x-2">
                    <Loader2 size={12} className="animate-spin text-editorial-orange" />
                    <span className="font-mono text-[10px] text-editorial-cream/40">Frying answers...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Suggestions (if no user responses yet or to facilitate conversation) */}
            {messages.length === 1 && !isLoading && (
              <div className="px-4 py-2 border-t border-editorial bg-editorial-darker/35 space-y-1.5">
                <p className="text-[8px] font-extrabold uppercase tracking-widest text-editorial-cream/30">Suggestions</p>
                <div className="flex flex-wrap gap-1">
                  {suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(s.substring(2))}
                      className="text-[9px] font-semibold text-editorial-cream/70 hover:text-editorial-cream bg-editorial-dark border border-editorial px-2.5 py-1 rounded-none hover:border-editorial-strong transition-all cursor-pointer text-left"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message Input Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="p-3 bg-editorial-darker border-t border-editorial flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about ingredients, delivery, deals..."
                className="flex-1 bg-editorial-dark text-editorial-cream px-3 py-2 border border-editorial focus:outline-none focus:border-editorial-orange/50 text-[11px] font-semibold placeholder:text-editorial-cream/20 rounded-none"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="p-2 bg-white text-black border border-transparent rounded-none hover:bg-editorial-orange disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer"
                aria-label="Send message"
              >
                <Send size={12} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
