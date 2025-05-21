
import React,{useState,useEffect,useRef} from 'react';

const EmailModal=({onSubmit})=>{
  const [email,setEmail]=useState('');
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
      <div className="bg-neutral-900 p-8 rounded-xl w-full max-w-sm animate-pulse-in">
        <h2 className="text-xl font-bold mb-4">Access <span className="text-emerald-400">Prompt&nbsp;Me</span></h2>
        <input className="w-full p-2 rounded mb-4 text-black" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>
        <button className="bg-emerald-500 w-full py-2 rounded hover:bg-emerald-400" onClick={()=>onSubmit(email)}>Unlock</button>
      </div>
    </div>
  );
};

export default function App(){
  const [emailCaptured,setEmailCaptured]=useState(localStorage.getItem('emailCaptured')==='true');
  const [messages,setMessages]=useState([]);
  const [input,setInput]=useState('');
  const [loading,setLoading]=useState(false);
  const bottom=useRef(null);

  useEffect(()=>{bottom.current?.scrollIntoView({behavior:'smooth'});},[messages]);

  const sendEmail=async email=>{
    const res=await fetch('/api/email',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email})});
    if(res.ok){localStorage.setItem('emailCaptured','true');setEmailCaptured(true);}
    else alert('Invalid email');
  };

  const send=async()=>{
    if(!input.trim()) return;
    const userMsg={role:'user',content:input.trim()};
    const newMsgs=[...messages,userMsg];
    setMessages(newMsgs);setInput('');setLoading(true);
    const res=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:newMsgs})});
    const data=await res.json();
    const ai=data.choices?.[0]?.message||{role:'assistant',content:'Error.'};
    setMessages([...newMsgs,ai]);setLoading(false);
  };

  const copyLast=()=>{
    const last=messages.filter(m=>m.role==='assistant').slice(-1)[0];
    if(last){navigator.clipboard.writeText(last.content);alert('Prompt copied!');}
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      {!emailCaptured && <EmailModal onSubmit={sendEmail}/>}
      <h1 className="text-3xl font-extrabold mb-6">Prompt&nbsp;<span className="text-emerald-400">Me</span></h1>
      <div className="w-full max-w-2xl bg-neutral-900 rounded-lg p-4 flex flex-col grow space-y-2 overflow-y-auto">
        {messages.map((m,i)=>(
          <div key={i} className={`p-2 rounded max-w-prose ${m.role==='user'?'self-end bg-neutral-800':'self-start bg-emerald-600'}`}>{m.content}</div>
        ))}
        {loading&&<div className="self-start bg-emerald-600 p-2 rounded animate-pulse">Thinking…</div>}
        <div ref={bottom}/>
      </div>
      <div className="w-full max-w-2xl mt-4 flex space-x-2">
        <textarea className="flex-grow p-2 rounded text-black" rows={2} placeholder="What do you want to build? Include end‑goal…" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}}/>
        <button className="bg-emerald-500 px-4 rounded hover:bg-emerald-400" onClick={send} disabled={loading}>Send</button>
      </div>
      <button className="mt-2 text-sm text-emerald-400 underline" onClick={copyLast}>Copy last prompt</button>
    </div>
  );
}
