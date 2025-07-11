'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

export interface Message {
  role: 'user' | 'ai';
  content: string;
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const router =useRouter();
  const [mode,setMode] = useState<string>('')
  const [ready,setReady] = useState<boolean>(false);
  useEffect(()=>{
    const modeItem = sessionStorage.getItem('mode');
    if(modeItem){
      setMode(JSON.parse(modeItem));
    }else{
      router.push('/home')
    }
    setReady(true)
  },[])

  const sendMessage = async () => {
    if (!input.trim()) return;
    if(!ready) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input,mode:mode }),
      });

      const data = await response.json();
      const aiMessage: Message = { role: 'ai', content: data.reply };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: '❌ ข้อผิดพลาดในการเชื่อมต่อ AI' }]);
    } finally {
      setInput('');
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="max-w-lg mx-auto p-4 border rounded-lg shadow bg-white text-black">
      <div className="h-80 overflow-y-auto mb-4 border p-3 rounded bg-gray-100 text-black">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'} text-black`}>
            <p className="text-black">
              <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.content}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <input
        type="text"
        className="w-full border p-2 rounded text-black"
        placeholder="พิมพ์คำถามเรื่องดวงหรือหุ้น..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />

      <button
        onClick={sendMessage}
        className="mt-2 w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'กำลังคิด...' : 'ส่ง'}
      </button>
    </div>
  );
}
