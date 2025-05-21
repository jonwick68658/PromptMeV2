import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '@shared/schema';

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onCopyPrompt: () => void;
  onClearChat: () => void;
}

export default function ChatContainer({
  messages,
  isLoading,
  onSendMessage,
  onCopyPrompt,
  onClearChat
}: ChatContainerProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-resize textarea as user types
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <main className="w-full max-w-4xl flex-grow flex flex-col overflow-hidden bg-neutral-900 rounded-lg border border-neutral-800 shadow-xl">
      {/* Guide Preview */}
      <div className="bg-neutral-800 border-b border-neutral-700 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium flex items-center">
            <i className="fas fa-book text-emerald-500 mr-2"></i>
            <span>Prompting Guide</span>
          </h3>
          <button className="text-xs text-neutral-400 hover:text-white">
            <i className="fas fa-expand-alt mr-1"></i>
            <span>Expand</span>
          </button>
        </div>
        <div className="mt-2 text-xs text-neutral-400 overflow-hidden max-h-14 line-clamp-2">
          <p>Elite-quality prompt templates for both GPT "doers" and o‑series "planners". Includes templates for GPT-4.1 Chat, GPT-4.1 Response, and o-Series Response.</p>
        </div>
      </div>
      
      {/* Messages Container */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : ''} animate-fade-in`}
          >
            <div 
              className={`p-3 rounded-t-lg ${
                message.role === 'user' 
                  ? 'bg-emerald-700 rounded-bl-lg rounded-br-none' 
                  : 'bg-neutral-800 rounded-br-lg rounded-bl-none'
              } max-w-[85%] shadow-md overflow-hidden`}
            >
              {message.role === 'user' ? (
                <p>{message.content}</p>
              ) : (
                <div className="relative prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>
                    {message.content}
                  </ReactMarkdown>
                  <button 
                    onClick={() => navigator.clipboard.writeText(message.content)}
                    className="absolute top-0 right-0 text-neutral-500 hover:text-emerald-400 p-1 rounded-full transition-colors"
                    title="Copy this prompt"
                  >
                    <i className="fas fa-copy"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Loading Message */}
        {isLoading && (
          <div className="flex animate-fade-in">
            <div className="bg-neutral-800 text-white p-3 rounded-t-lg rounded-br-lg max-w-[85%] shadow-md flex items-center animate-pulse-slow">
              <div className="mr-2 h-4 w-4">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-500"></div>
              </div>
              <span className="relative">
                Thinking<span className="animate-pulse">...</span>
              </span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="border-t border-neutral-700 p-4">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          <div className="relative">
            <textarea 
              ref={textareaRef}
              className="w-full p-3 pr-10 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none text-white"
              placeholder="What do you want to build? Include your end-goal..."
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="absolute bottom-3 right-3 text-emerald-500 hover:text-emerald-400 transition-colors disabled:opacity-50"
              disabled={!input.trim() || isLoading}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-xs text-neutral-500">
              <span>Using GPT-o3-2025-04-16</span>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                type="button" 
                className="text-xs text-emerald-500 hover:text-emerald-400 flex items-center"
                onClick={onCopyPrompt}
              >
                <i className="fas fa-clipboard mr-1"></i>
                <span>Copy Last Prompt</span>
              </button>
              <button 
                type="button" 
                className="text-xs text-neutral-400 hover:text-white flex items-center"
                onClick={onClearChat}
              >
                <i className="fas fa-trash-alt mr-1"></i>
                <span>Clear Chat</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
