import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { generateOtp, sendOtpEmail } from '../utils/otp';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState('credentials'); // 'credentials' | 'otp'
  const [otp, setOtp] = useState('');
  const [sentOtp, setSentOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const users = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('users') || '{}'); } catch { return {}; }
  }, []);

  useEffect(() => { setError(''); }, [email, password, otp, step]);

  const sendOtp = async () => {
    const user = users[email];
    if (!user) { setError('No account found for this email.'); return; }
    if (user.password !== password) { setError('Incorrect password.'); return; }
    // No OTP at login now; just sign in
    localStorage.setItem('auth', '1');
    localStorage.setItem('userEmail', email);
    navigate('/reports', { replace: true });
  };

  const onVerify = (e) => {
    e.preventDefault();
    const pending = (() => { try { return JSON.parse(localStorage.getItem('pendingOtp') || '{}'); } catch { return {}; } })();
    const code = sentOtp || pending.code;
    const valid = code && otp.trim() === code;
    if (!valid) { setError('Invalid OTP.'); return; }
    localStorage.removeItem('pendingOtp');
    localStorage.setItem('auth', '1');
    localStorage.setItem('userEmail', email);
    // Flip firstLogin to false
    try {
      const usersStore = JSON.parse(localStorage.getItem('users') || '{}');
      if (usersStore[email]) { usersStore[email].firstLogin = false; localStorage.setItem('users', JSON.stringify(usersStore)); }
    } catch {}
    navigate('/reports', { replace: true });
  };

  return (
    <div className="auth-wrapper" style={{ background: 'radial-gradient(1200px 600px at 20% 10%, #e8f2ff, transparent)' }}>
      <div className="auth-card" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 20 }}>
        <div style={{ textAlign: 'center' }}>
          <img src={process.env.PUBLIC_URL + '/logo.png'} alt="Limsense" style={{ width: 56, height: 56, objectFit: 'contain' }} onError={(e)=>{e.currentTarget.style.display='none';}} />
          <h2>Welcome to Limsense</h2>
          <p className="muted">{step === 'credentials' ? 'Sign in to continue' : `Enter the 6-digit OTP sent to ${email}`}</p>

          {error && <div style={{ color: '#ef4444', marginBottom: 8, fontSize: 13 }}>{error}</div>}

          {step === 'credentials' ? (
            <form onSubmit={(e)=>{ e.preventDefault(); sendOtp(); }} className="auth-form">
              <label className="field">
                <span>Email</span>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
              </label>
              <label className="field">
                <span>Password</span>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
              </label>
              <button className="btn primary" type="submit">Login</button>
            </form>
          ) : null}
          <div className="muted" style={{ marginTop: 8 }}>No account? <Link to="/signup">Create one</Link></div>
        </div>
        <div style={{ display:'grid', placeItems:'center', background:'#f5f9ff', borderRadius: 12 }}>
          <img src={process.env.PUBLIC_URL + '/logo.png'} alt="LIMS" style={{ width: '80%', maxWidth: 360, objectFit: 'contain' }} />
        </div>
      </div>
    </div>
  );
}


