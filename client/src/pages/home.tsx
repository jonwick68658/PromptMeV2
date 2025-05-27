import React, { useState, useEffect } from 'react';
import EmailModal from '@/components/EmailModal';
import ChatContainer from '@/components/ChatContainer';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { apiRequest } from '@/lib/queryClient';
import { Message } from '@shared/schema';

export default function Home() {
  const [emailCaptured, setEmailCaptured] = useState<boolean>(
    localStorage.getItem('emailCaptured') === 'true'
  );
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi there! I'll help you craft the perfect prompts for GPT and o-Series models based the most updated prompting guide.\nTell me what you want and I will build you a perfect prompt for it."
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [clipboardFeedback, setClipboardFeedback] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [platforms, setPlatforms] = useState<{id: string; name: string; description: string}[]>([]);

  // Load platform templates
  useEffect(() => {
    const loadPlatforms = async () => {
      try {
        const response = await fetch('/api/platforms');
        const data = await response.json();
        setPlatforms(data.platforms || []);
        console.log('Platform templates loaded:', data);
      } catch (error) {
        console.error('Failed to load platforms:', error);
      }
    };
    
    if (emailCaptured) {
      loadPlatforms();
    }
  }, [emailCaptured]);

  const handleEmailSubmit = async (email: string) => {
    try {
      await apiRequest('POST', '/api/email', { email });
      localStorage.setItem('emailCaptured', 'true');
      setEmailCaptured(true);
    } catch (error) {
      console.error('Failed to submit email:', error);
      return false;
    }
    return true;
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = { role: 'user', content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    
    // Show loading state
    setIsLoading(true);
    
    try {
      // Send message to API with platform context
      const response = await apiRequest('POST', '/api/chat', { 
        messages: newMessages,
        platform: selectedPlatform || undefined
      });
      const data = await response.json();
      
      // Add AI response to chat
      if (data.choices && data.choices.length > 0) {
        const aiMessage = data.choices[0].message;
        setMessages([...newMessages, aiMessage]);
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Sorry, there was an error processing your request. Please try again.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPrompt = () => {
    // Get the last AI message
    const lastAiMessage = [...messages]
      .reverse()
      .find(message => message.role === 'assistant');
    
    if (lastAiMessage) {
      navigator.clipboard.writeText(lastAiMessage.content)
        .then(() => {
          setClipboardFeedback(true);
          setTimeout(() => setClipboardFeedback(false), 2000);
        })
        .catch(err => console.error('Failed to copy:', err));
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Hi there! I'll help you craft the perfect prompts for GPT and o-Series models based the most updated prompting guide.\nTell me what you want and I will build you a perfect prompt for it."
      }
    ]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {!emailCaptured && <EmailModal onSubmit={handleEmailSubmit} />}
      
      <div className="flex flex-col items-center min-h-screen px-4 py-6">
        <Header />
        
        <ChatContainer
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          onCopyPrompt={handleCopyPrompt}
          onClearChat={handleClearChat}
          selectedPlatform={selectedPlatform}
          onPlatformChange={setSelectedPlatform}
          platforms={platforms}
        />
        
        <Footer />
        
        {/* Clipboard Feedback Toast */}
        <div className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 py-2 px-4 bg-app-emerald rounded text-white transition-opacity duration-300 ${clipboardFeedback ? 'opacity-100' : 'opacity-0'}`}>
          Prompt copied to clipboard!
        </div>
      </div>
    </div>
  );
}
