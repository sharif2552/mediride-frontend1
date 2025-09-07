// src/pages/admin/forgot-password.js
import React, { useState } from 'react';
import Link from 'next/link';

export default function AdminForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset instructions have been sent to your email.');
      } else {
        setError(data.detail || 'Failed to send reset email');
      }
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <div className="logo">
            <div className="logo-icon">🔑</div>
            <h1>Forgot Password</h1>
            <p>Admin Portal</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <h2>Reset Your Password</h2>
          <p className="form-description">
            Enter your admin email address and we&apos;ll send you instructions to reset your password.
          </p>
          
          {error && (
            <div className="error-message">
              <span>⚠️</span>
              {error}
            </div>
          )}

          {message && (
            <div className="success-message">
              <span>✅</span>
              {message}
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@mediride.com"
            />
          </div>

          <button type="submit" disabled={loading} className="reset-btn">
            {loading ? (
              <>
                <span className="spinner"></span>
                Sending...
              </>
            ) : (
              <>
                <span>📧</span>
                Send Reset Instructions
              </>
            )}
          </button>

          <div className="form-footer">
            <Link href="/admin/login" className="back-link">
              ← Back to Login
            </Link>
            <Link href="/" className="home-link">
              Back to Main Site
            </Link>
          </div>
        </form>
      </div>

      <style jsx>{`
        .forgot-password-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .forgot-password-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
          overflow: hidden;
          width: 100%;
          max-width: 450px;
          animation: slideUp 0.6s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .forgot-password-header {
          background: linear-gradient(135deg, #2c3e50, #34495e);
          color: white;
          padding: 3rem 2rem;
          text-align: center;
        }

        .logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .logo-icon {
          font-size: 3rem;
          background: rgba(255,255,255,0.2);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .logo h1 {
          margin: 0;
          font-size: 1.8rem;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .logo p {
          margin: 0;
          font-size: 1.1rem;
          opacity: 0.9;
          font-weight: 500;
        }

        .forgot-password-form {
          padding: 3rem 2rem;
        }

        .forgot-password-form h2 {
          margin: 0 0 1rem 0;
          color: #2c3e50;
          font-size: 1.5rem;
          font-weight: 600;
          text-align: center;
        }

        .form-description {
          margin: 0 0 2rem 0;
          color: #6c757d;
          text-align: center;
          line-height: 1.5;
        }

        .form-group {
          margin-bottom: 2rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #495057;
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-group input {
          width: 100%;
          padding: 15px 20px;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #f8f9fa;
          box-sizing: border-box;
        }

        .form-group input:focus {
          outline: none;
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
        }

        .error-message {
          background: linear-gradient(135deg, #ffeaea, #ffcccb);
          color: #c0392b;
          padding: 1rem 1.5rem;
          border-radius: 10px;
          margin-bottom: 2rem;
          border-left: 4px solid #e74c3c;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
        }

        .success-message {
          background: linear-gradient(135deg, #e8f5e8, #d4edda);
          color: #155724;
          padding: 1rem 1.5rem;
          border-radius: 10px;
          margin-bottom: 2rem;
          border-left: 4px solid #27ae60;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
        }

        .reset-btn {
          width: 100%;
          padding: 18px 24px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 4px 15px rgba(102,126,234,0.3);
        }

        .reset-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102,126,234,0.4);
        }

        .reset-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .form-footer {
          margin-top: 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .back-link,
        .home-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .back-link:hover,
        .home-link:hover {
          color: #764ba2;
          text-decoration: underline;
        }

        .home-link {
          color: #6c757d;
          font-size: 0.9rem;
        }

        @media (max-width: 480px) {
          .forgot-password-container {
            padding: 1rem;
          }
          
          .forgot-password-header {
            padding: 2rem 1rem;
          }
          
          .forgot-password-form {
            padding: 2rem 1rem;
          }
          
          .logo-icon {
            width: 60px;
            height: 60px;
            font-size: 2rem;
          }
          
          .logo h1 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
