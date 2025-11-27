import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!credentials.email || !credentials.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      if (credentials.email && credentials.password) {
        navigate('/analytics');
      } else {
        setError('Invalid credentials. Please try again.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-hr-dark to-[#1c2128] p-5 relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-30">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(57, 211, 83, 0.03) 50px, rgba(57, 211, 83, 0.03) 51px),
              repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(57, 211, 83, 0.03) 50px, rgba(57, 211, 83, 0.03) 51px)
            `
          }}
        ></div>
      </div>

      {/* Login Container */}
      <div className="bg-hr-card border border-hr-border rounded-xl p-12 w-full max-w-md shadow-2xl relative z-10 animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-hr-green flex items-center justify-center gap-3 mb-2">
            <span>🌾</span>
            <span>AgroTech</span>
          </h1>
          <p className="text-hr-text-secondary text-sm">
            Digital Farm Management Platform
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-hr-red/10 border border-hr-red rounded-md p-3 mb-4 flex items-center gap-2 text-hr-red text-sm">
            <span className="text-base">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email Field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-hr-text font-medium text-sm">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="farmer@agrotech.com"
              value={credentials.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className="
                bg-hr-dark border border-hr-border rounded-md px-4 py-3
                text-hr-text text-sm transition-all duration-200
                focus:outline-none focus:border-hr-green focus:ring-4 focus:ring-hr-green/10
                placeholder:text-hr-text-secondary placeholder:opacity-60
              "
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-hr-text font-medium text-sm">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={credentials.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              className="
                bg-hr-dark border border-hr-border rounded-md px-4 py-3
                text-hr-text text-sm transition-all duration-200
                focus:outline-none focus:border-hr-green focus:ring-4 focus:ring-hr-green/10
                placeholder:text-hr-text-secondary
              "
            />
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 cursor-pointer accent-hr-green"
            />
            <label 
              htmlFor="remember" 
              className="text-hr-text-secondary text-sm cursor-pointer select-none"
            >
              Remember me
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              bg-hr-green text-hr-darker font-semibold text-base py-3.5 rounded-md
              transition-all duration-200 mt-3
              hover:bg-hr-green-dark hover:shadow-lg hover:shadow-hr-green/30 hover:-translate-y-0.5
              active:translate-y-0
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
            "
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Additional Links */}
        <div className="flex justify-between mt-4 text-sm">
          <a 
            href="#forgot" 
            className="text-hr-blue hover:text-hr-green hover:underline transition-colors"
          >
            Forgot password?
          </a>
          <a 
            href="#signup" 
            className="text-hr-blue hover:text-hr-green hover:underline transition-colors"
          >
            Create account
          </a>
        </div>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-b border-hr-border"></div>
          <span className="px-4 text-hr-text-secondary text-xs">OR</span>
          <div className="flex-1 border-b border-hr-border"></div>
        </div>

        {/* SSO Button */}
        <button
          type="button"
          className="
            w-full bg-transparent border border-hr-border text-hr-text
            py-3 rounded-md font-medium text-sm flex items-center justify-center gap-2.5
            transition-all duration-200
            hover:bg-hr-hover hover:border-hr-green
          "
        >
          <span>🔑</span>
          <span>Continue with SSO</span>
        </button>
      </div>
    </div>
  );
};

export default Login;