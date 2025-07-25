import React, { useState } from "react";

const roles = ["Vendor", "Supplier", "Admin"];

const Login = ({ onSuccess, onClose }) => {
  const [isSignup, setIsSignup] = useState(false);
  // Login fields
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  // Signup fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState(roles[0]);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginId || !loginPassword) {
      setError("Please enter email/username and password");
      return;
    }
    // Simulate successful login
    onSuccess(loginId);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!name || !email || !signupPassword || !phone || !role) {
      setError("Please fill all fields");
      return;
    }
    // Simulate successful signup
    onSuccess(name);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-100 via-white to-green-50 bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative border border-green-100">
        <button
          className="absolute top-3 right-4 text-gray-400 hover:text-green-600 text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className="flex justify-center mb-4 gap-4">
          <button
            className={`font-semibold px-4 py-2 rounded-lg transition-all duration-150 shadow-sm border ${!isSignup ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-green-50'}`}
            onClick={() => { setIsSignup(false); setError(""); }}
          >
            Login
          </button>
          <button
            className={`font-semibold px-4 py-2 rounded-lg transition-all duration-150 shadow-sm border ${isSignup ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-green-50'}`}
            onClick={() => { setIsSignup(true); setError(""); }}
          >
            Signup
          </button>
        </div>
        <div className="w-full border-b border-gray-200 mb-6"></div>
        {isSignup ? (
          <>
            <h2 className="text-lg font-bold mb-2 text-green-700 text-center tracking-wide">Create your account</h2>
            <form onSubmit={handleSignup} className="flex flex-col gap-4 mt-2">
              <input
                type="text"
                placeholder="Name"
                className="border border-green-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 transition"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                className="border border-green-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 transition"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="border border-green-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 transition"
                value={signupPassword}
                onChange={e => setSignupPassword(e.target.value)}
              />
              <input
                type="tel"
                placeholder="Phone"
                className="border border-green-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 transition"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
              <select
                className="border border-green-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 transition"
                value={role}
                onChange={e => setRole(e.target.value)}
              >
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg mt-2 shadow-md transition-all"
              >
                Signup
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-lg font-bold mb-2 text-green-700 text-center tracking-wide">Welcome back</h2>
            <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-2">
              <input
                type="text"
                placeholder="Email or Username"
                className="border border-green-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 transition"
                value={loginId}
                onChange={e => setLoginId(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="border border-green-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 transition"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
              />
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg mt-2 shadow-md transition-all"
              >
                Login
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login; 