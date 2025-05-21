import React, { useState } from 'react';

interface EmailModalProps {
  onSubmit: (email: string) => Promise<boolean>;
}

export default function EmailModal({ onSubmit }: EmailModalProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    try {
      const success = await onSubmit(email);
      if (!success) {
        setError('There was a problem saving your email. Please try again.');
      }
    } catch (err) {
      setError('There was a problem saving your email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-neutral-900 border border-neutral-800 p-6 md:p-8 rounded-xl w-full max-w-md shadow-2xl animate-slide-up">
        <div className="mb-6 text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-2">
            Welcome to <span className="text-emerald-500">Prompt Me</span>
          </h2>
          <p className="text-neutral-400 text-sm">
            Enter your email to access advanced prompting tools based on the latest OpenAI models
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-1">
              Email Address
            </label>
            <input 
              type="email" 
              id="email-input" 
              className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors text-white"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
            {error && <p className="mt-1 text-red-500 text-xs">{error}</p>}
          </div>
          
          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-white font-medium rounded-lg transition-colors shadow-lg flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2 h-4 w-4">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  </span>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Unlock Access</span>
                  <i className="fas fa-arrow-right ml-2"></i>
                </>
              )}
            </button>
          </div>
          
          <p className="text-xs text-center text-neutral-500 mt-4">
            Your email is only used for authentication and will never be shared.
          </p>
        </form>
      </div>
    </div>
  );
}
