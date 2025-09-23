import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({ role: 'farmer', name: '', wallet: '' });
  const [useOtp, setUseOtp] = useState(true);
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [signup, setSignup] = useState({ name: '', region: '', wallet: '' });

  useEffect(() => {
    try {
      const existing = localStorage.getItem('ayush_current_user');
      if (existing) {
        const user = JSON.parse(existing);
        setLoginForm({ role: user.role || 'farmer', name: user.name || '', wallet: user.wallet || '' });
      }
    } catch (_) {}
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (useOtp) {
      if (!phone || phone.length < 10) return;
      if (!otpSent) {
        setOtpSent(true);
        return;
      }
      // Simulate OTP verification step
      if (!otp || otp.length < 4) return;
      setOtpVerified(true);
      return;
    }
    if (!loginForm.name || !loginForm.wallet) return;
    try { localStorage.setItem('ayush_current_user', JSON.stringify(loginForm)); } catch (_) {}
    navigate('/');
  };

  const handleCompleteSignup = (e) => {
    e.preventDefault();
    const name = (signup.name || '').trim();
    const region = (signup.region || '').trim() || 'Unknown Region';
    const wallet = (signup.wallet || '').trim() || `PHONE:${phone}`;
    if (!name) return;

    const newFarmer = {
      id: `CF-${Date.now()}`,
      name,
      region,
      wallet,
      points: 0,
      totalTokens: 0,
      badges: ['New Farmer']
    };

    try {
      const raw = localStorage.getItem('ayush_custom_farmers');
      const list = raw ? JSON.parse(raw) : [];
      const idx = list.findIndex((f) => (f.wallet || '').toLowerCase() === wallet.toLowerCase());
      if (idx >= 0) list[idx] = { ...list[idx], ...newFarmer };
      else list.push(newFarmer);
      localStorage.setItem('ayush_custom_farmers', JSON.stringify(list));
      localStorage.setItem('ayush_current_user', JSON.stringify({ role: 'farmer', name, wallet }));
    } catch (_) {}

    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6">
        <div className="mb-4">
          <Link to="/" className="text-sm text-blue-600 hover:underline">← Back to Home</Link>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Login</h1>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Farmer-friendly: Phone OTP</span>
          <button type="button" onClick={()=>setUseOtp(!useOtp)} className="text-sm text-blue-600 hover:underline">
            {useOtp ? 'Use Wallet/Role' : 'Use Phone OTP'}
          </button>
        </div>
        {useOtp ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                value={phone}
                onChange={(e)=>setPhone(e.target.value.replace(/[^0-9]/g,''))}
                placeholder="e.g., 9876543210"
                className="w-full border rounded-lg px-4 py-3 text-lg"
                required
              />
            </div>
            {!otpSent ? (
              <button type="button" onClick={()=>setOtpSent(true)} className="w-full py-3 bg-green-600 text-white rounded-lg text-lg">
                Send OTP
              </button>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={(e)=>setOtp(e.target.value.replace(/[^0-9]/g,''))}
                    placeholder="6-digit code"
                    className="w-full border rounded-lg px-4 py-3 text-lg tracking-widest text-center"
                    required
                  />
                </div>
                {!otpVerified ? (
                  <button type="submit" className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg text-lg">
                    Verify OTP
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="text-sm text-gray-700">Create your farmer profile</div>
                    <input className="w-full border rounded-lg px-4 py-3" placeholder="Full Name" value={signup.name} onChange={(e)=>setSignup({...signup, name:e.target.value})} required />
                    <input className="w-full border rounded-lg px-4 py-3" placeholder="Region (e.g., Karnataka Western Ghats)" value={signup.region} onChange={(e)=>setSignup({...signup, region:e.target.value})} />
                    <input className="w-full border rounded-lg px-4 py-3" placeholder="Wallet (optional)" value={signup.wallet} onChange={(e)=>setSignup({...signup, wallet:e.target.value})} />
                    <button onClick={handleCompleteSignup} className="w-full py-3 bg-green-600 text-white rounded-lg text-lg">Finish Sign Up</button>
                  </div>
                )}
              </>
            )}
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={loginForm.role}
              onChange={(e) => setLoginForm({ ...loginForm, role: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="farmer">Farmer</option>
              <option value="processor">Processor</option>
              <option value="buyer">Buyer</option>
              <option value="auditor">Auditor</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={loginForm.name}
              onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
              placeholder="e.g., Ravi Kumar"
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wallet Address</label>
            <input
              type="text"
              value={loginForm.wallet}
              onChange={(e) => setLoginForm({ ...loginForm, wallet: e.target.value })}
              placeholder="0x..."
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
          <button type="submit" className="w-full py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg">
            Continue
          </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;


