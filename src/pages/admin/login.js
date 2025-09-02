// src/pages/admin/login.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    phone_number: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.access) {
        // Store admin token
        localStorage.setItem('adminToken', data.access);
        localStorage.setItem('adminRefresh', data.refresh);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        
        // Redirect to admin dashboard
        router.push('/admin/dashboard');
      } else {
        setError(data.detail || 'Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-logo">
            <div className="logo-icon">🏥</div>
            <h1>MEDIRIDE</h1>
            <p>Admin Portal</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <h2>Administrator Login</h2>
          
          {error && (
            <div className="error-message">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
              placeholder="01XXXXXXXXX"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? (
              <>
                <span className="spinner"></span>
                Signing In...
              </>
            ) : (
              <>
                <span>🔑</span>
                Sign In to Dashboard
              </>
            )}
          </button>

          <div className="login-footer">
            <Link href="/admin/forgot-password" className="forgot-link">
              Forgot Password?
            </Link>
            <Link href="/" className="back-link">
              ← Back to Main Site
            </Link>
          </div>
        </form>
      </div>

      <style jsx>{`
        .admin-login-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .admin-login-card {
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

        .admin-login-header {
          background: linear-gradient(135deg, #2c3e50, #34495e);
          color: white;
          padding: 3rem 2rem;
          text-align: center;
        }

        .admin-logo {
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

        .admin-logo h1 {
          margin: 0;
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: 2px;
        }

        .admin-logo p {
          margin: 0;
          font-size: 1.1rem;
          opacity: 0.9;
          font-weight: 500;
        }

        .admin-login-form {
          padding: 3rem 2rem;
        }

        .admin-login-form h2 {
          margin: 0 0 2rem 0;
          color: #2c3e50;
          font-size: 1.5rem;
          font-weight: 600;
          text-align: center;
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

        .login-btn {
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

        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102,126,234,0.4);
        }

        .login-btn:disabled {
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

        .login-footer {
          margin-top: 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .forgot-link,
        .back-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .forgot-link:hover,
        .back-link:hover {
          color: #764ba2;
          text-decoration: underline;
        }

        .back-link {
          color: #6c757d;
          font-size: 0.9rem;
        }

        @media (max-width: 480px) {
          .admin-login-container {
            padding: 1rem;
          }
          
          .admin-login-header {
            padding: 2rem 1rem;
          }
          
          .admin-login-form {
            padding: 2rem 1rem;
          }
          
          .logo-icon {
            width: 60px;
            height: 60px;
            font-size: 2rem;
          }
          
          .admin-logo h1 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
