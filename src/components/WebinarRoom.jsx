import { useState, useEffect, useRef } from 'react';
import { MessageSquare, HelpCircle, BarChart2, Download, Send, Play, Volume2, Maximize } from 'lucide-react';

const FAKE_MESSAGES = [
  "Hello from London!",
  "Very interested in how the AI request validation works.",
  "We are currently struggling with manual PR approvals.",
  "Does it integrate directly into NetSuite without middleware?",
  "The budget enforcement feature looks exactly like what we need."
];

export default function WebinarRoom({ user }) {
  const [activeTab, setActiveTab] = useState('chat');
  const [chat, setChat] = useState([
    { id: 1, user: 'System', text: 'Welcome to the TRACKnow Live Demo!', isSystem: true }
  ]);
  const [chatInput, setChatInput] = useState('');
  
  const [pollVoted, setPollVoted] = useState(false);
  const [pollResults, setPollResults] = useState({ a: 210, b: 120, c: 45 });
  
  const chatEndRef = useRef(null);
  
  // Auto-scroll chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat]);

  // Simulate incoming chat messages
  useEffect(() => {
    const interval = setInterval(() => {
      const text = FAKE_MESSAGES[Math.floor(Math.random() * FAKE_MESSAGES.length)];
      setChat(prev => [...prev, { 
        id: Date.now(), 
        user: `Guest_${Math.floor(Math.random() * 9000)}`, 
        text 
      }]);
    }, 15000); // New message every 15s
    return () => clearInterval(interval);
  }, []);

  const sendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChat(prev => [...prev, { id: Date.now(), user: user?.name || 'Me', text: chatInput, isMe: true }]);
    setChatInput('');
  };

  const votePoll = (option) => {
    if (pollVoted) return;
    setPollResults(prev => ({ ...prev, [option]: prev[option] + 1 }));
    setPollVoted(true);
  };

  const totalVotes = pollResults.a + pollResults.b + pollResults.c;

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-secondary)' }}>
      
      {/* Main Video Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', background: '#fff', padding: '16px 24px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-card)' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>Transform NetSuite Procurement with TRACKnow PR</h2>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Live Demo Session</div>
          </div>
          <div className="badge badge-solid" style={{ background: '#ef4444' }}>
            LIVE &bull; 1,248 Viewers
          </div>
        </div>

        {/* Video Player Mock */}
        <div style={{ flex: 1, background: '#1e293b', borderRadius: 'var(--radius-md)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-card)' }}>
          
          <div style={{ textAlign: 'center' }}>
             <h1 style={{ color: 'rgba(255,255,255,0.1)', fontSize: '4rem' }}>LIVE STREAM</h1>
             <p style={{ color: 'rgba(255,255,255,0.3)' }}>Video feed will appear here.</p>
          </div>

          {/* Controls Mock */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.8), transparent)', padding: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><Play size={24} /></button>
            <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}>
               <div style={{ width: '45%', height: '100%', background: 'var(--accent-primary)', borderRadius: '2px' }}></div>
            </div>
            <button style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><Volume2 size={24} /></button>
            <button style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><Maximize size={24} /></button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="card-glass" style={{ width: '380px', borderRadius: 0, borderRight: 'none', borderTop: 'none', borderBottom: 'none', display: 'flex', flexDirection: 'column' }}>
        
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', background: '#fff' }}>
          {[
            { id: 'chat', icon: <MessageSquare size={18}/>, label: 'Chat' },
            { id: 'qa', icon: <HelpCircle size={18}/>, label: 'Q&A' },
            { id: 'polls', icon: <BarChart2 size={18}/>, label: 'Polls' },
            { id: 'resources', icon: <Download size={18}/>, label: 'Files' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{ 
                flex: 1, padding: '16px 0', background: 'transparent', border: 'none', 
                color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                borderBottom: activeTab === tab.id ? '2px solid var(--accent-primary)' : '2px solid transparent',
                cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                transition: 'all 0.2s'
              }}
            >
              {tab.icon}
              <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
          
          {activeTab === 'chat' && (
            <>
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                {chat.map(msg => (
                  <div key={msg.id} style={{ alignSelf: msg.isMe ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                    {!msg.isMe && !msg.isSystem && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{msg.user}</div>}
                    <div style={{ 
                      padding: '10px 14px', 
                      background: msg.isSystem ? '#e2e8f0' : (msg.isMe ? 'var(--accent-primary)' : '#ffffff'),
                      borderRadius: 'var(--radius-md)',
                      color: msg.isSystem ? 'var(--text-secondary)' : (msg.isMe ? 'white' : 'var(--text-primary)'),
                      fontSize: msg.isSystem ? '0.85rem' : '0.95rem',
                      fontStyle: msg.isSystem ? 'italic' : 'normal',
                      border: msg.isSystem ? 'none' : '1px solid var(--border-light)',
                      borderBottomRightRadius: msg.isMe ? 0 : 'var(--radius-md)',
                      borderBottomLeftRadius: !msg.isMe && !msg.isSystem ? 0 : 'var(--radius-md)',
                      boxShadow: msg.isMe || msg.isSystem ? 'none' : 'var(--shadow-card)'
                    }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={sendChat} style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ flex: 1 }} 
                  placeholder="Say something..." 
                  value={chatInput} 
                  onChange={e => setChatInput(e.target.value)} 
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0 16px', borderRadius: 'var(--radius-sm)' }}>
                  <Send size={18} />
                </button>
              </form>
            </>
          )}

          {activeTab === 'polls' && (
            <div>
              <h3 style={{ marginBottom: '16px', fontSize: '1.2rem', fontFamily: 'var(--font-display)' }}>Live Poll</h3>
              <div className="card-glass" style={{ padding: '24px' }}>
                <p style={{ fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)' }}>How do you currently handle NetSuite Purchase Requests?</p>
                
                {[
                  { key: 'a', label: 'Manual/Email Approvals' },
                  { key: 'b', label: 'Custom Scripts' },
                  { key: 'c', label: 'Third-party Middleware' }
                ].map(opt => {
                  const pct = Math.round((pollResults[opt.key] / totalVotes) * 100) || 0;
                  return (
                    <div key={opt.key} style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{opt.label}</span>
                        {pollVoted && <span style={{ fontWeight: 600 }}>{pct}%</span>}
                      </div>
                      <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', cursor: !pollVoted ? 'pointer' : 'default' }} onClick={() => votePoll(opt.key)}>
                        <div style={{ width: pollVoted ? `${pct}%` : '0%', height: '100%', background: 'var(--accent-primary)', transition: 'width 1s ease-out' }}></div>
                      </div>
                    </div>
                  );
                })}

                {!pollVoted && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '24px', textAlign: 'center' }}>Click a bar to cast your vote</p>}
                {pollVoted && <p style={{ fontSize: '0.85rem', color: '#16a34a', marginTop: '24px', textAlign: 'center', fontWeight: 600 }}>Thanks for voting!</p>}
              </div>
            </div>
          )}

          {activeTab === 'qa' && (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '50px' }}>
              <HelpCircle size={48} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
              <p>Q&A is currently empty.</p>
              <p style={{ fontSize: '0.85rem' }}>Be the first to ask a question!</p>
            </div>
          )}

          {activeTab === 'resources' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { title: "TRACKnow PR Overview", type: "PDF, 2.4MB" },
                { title: "Case Study: Modern Procurement", type: "PDF, 1.1MB" }
              ].map((res, i) => (
                <div key={i} className="card-glass" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{res.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{res.type}</div>
                  </div>
                  <button className="btn btn-outline" style={{ padding: '8px', borderRadius: 'var(--radius-sm)' }}>
                    <Download size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
