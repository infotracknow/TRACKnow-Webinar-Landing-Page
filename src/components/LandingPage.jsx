import { useState, useEffect } from 'react';
import { Calendar, Clock, Sparkles } from 'lucide-react';

const targetDate = new Date('2026-06-15T10:00:00');
const calculateTimeLeft = () => {
  const difference = +targetDate - +new Date();
  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }
  return { days: 0, hours: 0, minutes: 0, seconds: 0 };
};

export default function LandingPage({ onRegister }) {

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [formData, setFormData] = useState({ name: '', company: '', email: '', role: '', phone: '', companySize: '', country: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const portalId = "21715241"; // Replace with your HubSpot Portal ID
    const formGuid = "066154cc-2331-4a80-b5d4-1344d33d3f1b"; // Replace with your HubSpot Form GUID
    const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`;

    const hsData = {
      fields: [
        { name: "firstname", value: formData.name.split(' ')[0] },
        { name: "lastname", value: formData.name.split(' ').slice(1).join(' ') || '' },
        { name: "email", value: formData.email },
        { name: "company", value: formData.company },
        { name: "jobtitle", value: formData.role },
        { name: "phone", value: formData.phone },
        { name: "country", value: formData.country },
        { name: "company_size", value: formData.companySize },
        { name: "message", value: formData.message }
      ]
    };

    try {
      if (portalId !== "PLACEHOLDER_PORTAL_ID") {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(hsData)
        });
        if (!response.ok) {
          const errorData = await response.text();
          console.error("HubSpot API Error:", errorData);
          alert("There was an issue submitting the form. Please check the console for details.");
          setIsSubmitting(false);
          return;
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Mock delay
      }
      setIsSuccess(true);
      // Temporarily disable redirecting to webinar page
      // if (onRegister) onRegister(formData);
    } catch (error) {
      console.error("HubSpot Submission Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = { padding: '10px 14px', fontSize: '0.9rem' };
  const labelStyle = { fontSize: '0.85rem', marginBottom: '6px', fontWeight: 600, color: '#334155' };

  return (
    <>
      <style>{`
        .split-layout {
          display: flex;
          min-height: 100vh;
          flex-direction: row;
          background: white;
        }
        .sidebar {
          width: 400px;
          flex-shrink: 0;
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          border-right: 1px solid var(--border-solid);
          box-shadow: 4px 0 24px rgba(0,0,0,0.03);
          padding: 40px 32px;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          max-height: 100vh;
          position: sticky;
          top: 0;
          z-index: 20;
        }
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          background: #ffffff;
        }
        .header-area {
          border-bottom: 1px solid var(--border-solid);
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .content-grid {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 60px;
          padding: 40px 60px;
        }
        .panelist-column {
          border-left: 1px solid var(--border-solid);
          padding-left: 40px;
        }
        .panelist-card {
          display: flex;
          gap: 16px;
          align-items: center;
          padding: 16px;
          border-radius: 16px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: white;
          border: 1px solid transparent;
        }
        .panelist-card:hover {
          background: #f8fafc;
          border-color: var(--border-solid);
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -8px rgba(15, 23, 42, 0.08);
        }
        
        @media (max-width: 1024px) {
          .mobile-register-btn {
            display: inline-flex !important;
            padding: 8px 16px;
            font-size: 0.85rem;
          }
          .split-layout {
            flex-direction: column-reverse;
          }
          .sidebar {
            width: 100%;
            max-height: none;
            position: relative;
            border-right: none;
            border-top: 1px solid var(--border-solid);
          }
          .content-grid {
            grid-template-columns: 1fr;
            padding: 32px 24px;
            gap: 40px;
          }
          .panelist-column {
            border-left: none;
            padding-left: 0;
            border-top: 1px solid var(--border-solid);
            padding-top: 40px;
          }
        }
        
        /* Utility Classes extracted for mobile responsiveness */
        .header-nav {
          padding: 24px 60px;
          background: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .mobile-register-btn {
          display: none;
        }
        .header-banner {
          background: #f8fafc;
          color: black;
          padding: 12px 60px;
          font-weight: 600;
          font-size: 0.9rem;
          display: flex;
          gap: 24px;
          align-items: center;
          font-family: var(--font-display);
          letter-spacing: 0.02em;
          border-top: 1px solid var(--border-solid);
        }
        .form-row {
          display: flex;
          gap: 16px;
        }
        .hero-title {
          font-size: 2.5rem;
          margin-bottom: 16px;
          color: #0f172a;
          line-height: 1.1;
          font-family: var(--font-display);
          letter-spacing: -0.02em;
        }
        .meta-info {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 32px;
          color: var(--accent-blue);
          font-size: 1rem;
          font-weight: 700;
          flex-wrap: wrap;
        }
        .sidebar-title {
          font-size: 1.5rem;
          color: #0f172a;
          margin-bottom: 24px;
          font-family: var(--font-display);
          font-weight: 800;
        }
        
        @media (max-width: 768px) {
          .header-nav {
            padding: 16px 20px;
          }
          .header-banner {
            padding: 12px 20px;
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .sidebar {
            padding: 32px 20px;
          }
          .sidebar-title {
            font-size: 1.25rem;
          }
          .form-row {
            flex-direction: column;
            gap: 16px;
          }
          .hero-title {
            font-size: 1.8rem;
          }
          .content-grid {
            padding: 24px 20px;
            gap: 32px;
          }
          .meta-info {
            font-size: 0.9rem;
          }
        }
      `}</style>

      <div className="split-layout">
        
        {/* Left Sidebar: Lead Form */}
        <div className="sidebar" id="lead-form">
          <h2 className="sidebar-title">Lead Form</h2>
          
          <div style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(45deg, #1d4ed8, #2563eb, #3b82f6)', color: 'white', padding: '16px', borderRadius: '8px', marginBottom: '24px', textAlign: 'center', boxShadow: '0 8px 16px rgba(37, 99, 235, 0.2)', border: '1px solid rgba(255,255,255,0.2)', width: '100%', minHeight: '100px' }}>
            {/* The shining sweep animation */}
            <div style={{ position: 'absolute', top: 0, left: '-150%', width: '50%', height: '100%', background: 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)', transform: 'skewX(-20deg)', animation: 'shineSweep 4s infinite', pointerEvents: 'none', zIndex: 1 }}></div>
            
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.9)', marginBottom: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Webinar starts in</div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem', width: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ lineHeight: 1 }}>{String(timeLeft.days).padStart(2, '0')}</span>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Days</span>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.5)', paddingBottom: '12px' }}>:</span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ lineHeight: 1 }}>{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Hrs</span>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.5)', paddingBottom: '12px' }}>:</span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ lineHeight: 1 }}>{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Min</span>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.5)', paddingBottom: '12px' }}>:</span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ lineHeight: 1 }}>{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Sec</span>
                </div>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            <div className="form-row">
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>First name *</label>
                <input required type="text" className="form-input" style={inputStyle} value={formData.name.split(' ')[0] || ''} onChange={e => {
                  const parts = formData.name.split(' ');
                  parts[0] = e.target.value;
                  setFormData({...formData, name: parts.join(' ')});
                }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Last name *</label>
                <input required type="text" className="form-input" style={inputStyle} value={formData.name.split(' ').slice(1).join(' ') || ''} onChange={e => {
                  const first = formData.name.split(' ')[0] || '';
                  setFormData({...formData, name: first + (e.target.value ? ' ' + e.target.value : '')});
                }} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Work email *</label>
              <input required type="email" className="form-input" style={inputStyle} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>

            <div>
              <label style={labelStyle}>Company *</label>
              <input required type="text" className="form-input" style={inputStyle} value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
            </div>

            <div>
              <label style={labelStyle}>Company size *</label>
              <select required className="form-select" style={inputStyle} value={formData.companySize} onChange={e => setFormData({...formData, companySize: e.target.value})}>
                <option value="" disabled>Please select one</option>
                <option value="1-50">1-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-1000">201-1,000 employees</option>
                <option value="1001+">1,001+ employees</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Role *</label>
              <input required type="text" className="form-input" style={inputStyle} value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
            </div>

            <div>
              <label style={labelStyle}>Phone number *</label>
              <input required type="tel" className="form-input" style={inputStyle} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>

            <div>
              <label style={labelStyle}>Country *</label>
              <input required type="text" className="form-input" style={inputStyle} value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} />
            </div>

            <div style={{ flex: 1 }}></div>

            <div style={{ marginTop: '24px' }}>
              {isSuccess ? (
                <div style={{ padding: '16px', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', borderRadius: '4px', fontWeight: 600, textAlign: 'center' }}>
                  Successfully Registered! We'll be in touch soon.
                </div>
              ) : (
                <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ padding: '16px', width: '100%', fontSize: '1rem', opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                  {isSubmitting ? 'SENDING REQUEST...' : 'Register Now'}
                </button>
              )}
            </div>
            
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '8px', lineHeight: 1.5 }}>
              By registering, you confirm that you agree to the <a href="#" style={{ color: 'var(--accent-blue)' }}>Terms of Service</a> and <a href="#" style={{ color: 'var(--accent-blue)' }}>Privacy Statement</a>.
            </div>
          </form>
        </div>

        {/* Right Content Area */}
        <div className="main-content">
          
          {/* Top Header Area: Branding & Banner */}
          <div className="header-area shine-line-bottom">
            <nav className="header-nav">
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-display)' }}>
                TRACK<span className="text-gradient">now</span>
              </div>
              <button 
                className="btn btn-primary mobile-register-btn" 
                onClick={() => document.getElementById('lead-form').scrollIntoView({ behavior: 'smooth' })}
              >
                Register
              </button>
            </nav>
            
            <div className="header-banner">
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)'}}>Webinar on "TRACKnow PR" starts in :</span>
              <span style={{background: 'linear-gradient(45deg, #1d4ed8, #2563eb, #3b82f6)', borderRadius: '6px', padding: '2px 12px', color: 'white'}}><Calendar size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }}/> June 15, 2026 10:00 AM</span>
              <span style={{ background: 'rgba(0,0,0,0.05)', padding: '2px 12px', borderRadius: '99px' }}><Clock size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }}/> {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</span>
            </div>
          </div>



          {/* Main Content Grid */}
          <div className="content-grid">
            
            {/* Title, Date/Time, Description, Bullets */}
            <div>
              <div className="shine-box" style={{ marginBottom: '32px', borderRadius: '12px', overflow: 'hidden', border: '1px solid transparent' }}>
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                  <iframe 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} 
                    src="https://www.youtube.com/embed/18QUasMMY_o?si=726mquqTyqXGPy62" 
                    title="Webinar Teaser Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen>
                  </iframe>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <span className="badge badge-solid"><Sparkles size={14} /> AI-POWERED PLATFORM</span>
                <span className="badge badge-soft">NATIVE NETSUITE EXTENSION</span>
              </div>
              
              <h1 className="hero-title">
                The AI Operations Platform<br/>Built Inside NetSuite.
              </h1>
              
              <div className="meta-info">
                <Calendar size={18} /> June 15, 2026 • 10:00 AM EST • <Clock size={18} style={{ marginLeft: '8px' }} /> 60 min
              </div>

              <div style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '40px' }}>
                <p style={{ marginBottom: '16px' }}>
                  Procurement isn't easy, and when your team relies on outdated spreadsheets or disconnected tools, it can be even harder. Communication failures can run the gamut, from misunderstanding approval hierarchies to disjointed supplier tracking.
                </p>
                <p>
                  Join this webinar to learn how to help get everyone aligned in a digital HQ and make sure that no information is lost. Learn how better automation means better performance for you and your procurement team.
                </p>
              </div>

              <h3 style={{ fontSize: '1.25rem', marginBottom: '24px', color: '#0f172a', fontWeight: 700 }}>Things you'll learn:</h3>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  "How to give employees a sense of purpose and engagement and increase employee retention rates",
                  "How to boost company resilience in times of crisis",
                  "How to clarify messaging and improve transparency"
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', color: '#334155', fontSize: '1rem', fontWeight: 500, lineHeight: 1.6 }}>
                    <span className="shine-text" style={{ fontSize: '1.2rem', marginTop: '-2px' }}>■</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Panelist Information */}
            <div className="panelist-column shine-line-left">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '32px', color: '#0f172a', fontWeight: 700 }}>Panelist Information</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginLeft: '-16px' }}>
                <div className="panelist-card">
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)', flexShrink: 0, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}></div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1.1rem', color: '#0f172a', marginBottom: '4px' }}>Jade Manley</strong>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'block', lineHeight: 1.4 }}>Employee Learning & Development Manager</span>
                  </div>
                </div>
                
                <div className="panelist-card">
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)', flexShrink: 0, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}></div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1.1rem', color: '#0f172a', marginBottom: '4px' }}>Jay Van Bavel</strong>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'block', lineHeight: 1.4 }}>Associate Professor of Psychology</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
