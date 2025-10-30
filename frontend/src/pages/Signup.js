import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { generateOtp, sendOtpEmail } from '../utils/otp';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState('form'); // form | otp
  const [otp, setOtp] = useState('');
  const [sentOtp, setSentOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(()=>{ setError(''); }, [name, email, password, otp, step]);

  const onSubmit = async (e) => {
    e.preventDefault();
    // prevent duplicate accounts
    try {
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      if (users[email]) { setError('Account already exists. Please login.'); return; }
    } catch {}

    const code = generateOtp();
    try {
      await sendOtpEmail({ toEmail: email, toName: name || 'User', code });
    } catch (err) {
      setError('Failed to send OTP email. Check email service and try again.');
      return;
    }
    localStorage.setItem('pendingOtp', JSON.stringify({ email, code, ts: Date.now(), data: { name, password } }));
    setSentOtp(code);
    setStep('otp');
  };

  const onVerify = (e) => {
    e.preventDefault();
    const pending = (() => { try { return JSON.parse(localStorage.getItem('pendingOtp') || '{}'); } catch { return {}; } })();
    const code = sentOtp || pending.code;
    if (!code || otp.trim() !== code) { setError('Invalid OTP.'); return; }

    // create account
    const users = (() => { try { return JSON.parse(localStorage.getItem('users') || '{}'); } catch { return {}; } })();
    users[email] = { name, email, password };
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.removeItem('pendingOtp');

    // login immediately after verified
    localStorage.setItem('auth', '1');
    localStorage.setItem('userEmail', email);
    navigate('/reports', { replace: true });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <img src={process.env.PUBLIC_URL + '/logo.png'} alt="Limsense" className="top-logo" style={{ width: 48, height: 48 }} />
        <h2>Create your Limsense account</h2>
        <p className="muted">Verify your email to continue</p>
        {error && <div style={{ color: '#ef4444', marginBottom: 8, fontSize: 13 }}>{error}</div>}

        {step === 'form' ? (
          <form onSubmit={onSubmit} className="auth-form">
            <label className="field">
              <span>Name</span>
              <input value={name} onChange={e=>setName(e.target.value)} required />
            </label>
            <label className="field">
              <span>Email</span>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
            </label>
            <label className="field">
              <span>Password</span>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
            </label>
            <button className="btn primary" type="submit">Send OTP</button>
            <div className="muted" style={{ marginTop: 8 }}>Already have an account? <Link to="/login">Login</Link></div>
          </form>
        ) : (
          <form onSubmit={onVerify} className="auth-form">
            <label className="field">
              <span>One-time Password</span>
              <input inputMode="numeric" pattern="[0-9]*" maxLength={6} value={otp} onChange={e=>setOtp(e.target.value)} required />
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn" type="button" onClick={()=>setStep('form')}>Back</button>
              <button className="btn primary" type="submit">Verify & Create account</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}


