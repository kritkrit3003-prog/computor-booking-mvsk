
import React, { useState } from 'react';
import { getLabAdvice } from '../services/geminiService';

const AIAssistant: React.FC<{ roomStatus: any }> = ({ roomStatus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    const result = await getLabAdvice(query, roomStatus);
    setResponse(result || '');
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white w-80 md:w-96 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <span className="font-bold">MVSK Lab Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">✕</button>
          </div>
          
          <div className="h-64 overflow-y-auto p-4 bg-slate-50 space-y-4">
            {response ? (
              <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl text-sm text-slate-700">
                {response}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic text-center mt-10">
                How can I help you today?<br/>Ask me about lab equipment or room availability!
              </p>
            )}
            {loading && <div className="text-center text-xs text-indigo-500 animate-pulse">Assistant is thinking...</div>}
          </div>

          <form onSubmit={handleSubmit} className="p-3 border-t bg-white flex gap-2">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type your question..."
              className="flex-grow bg-slate-100 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button 
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              ➔
            </button>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-indigo-600 rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-indigo-700 transition-transform hover:scale-110 active:scale-95"
        >
          ✨
        </button>
      )}
    </div>
  );
};

export default AIAssistant;
