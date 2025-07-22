import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/login', credentials);
      onLogin(response.data.user, response.data.token);
    } catch (error) {
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-header">
          <div className="login-logo">
            <i className="fas fa-school"></i>
          </div>
          <h1 className="login-title">ระบบปฏิทินงาน</h1>
          <p className="login-subtitle">โรงเรียนซับใหญ่วิทยาคม</p>
        </div>

        {error && (
          <div style={{
            background: '#ffebee',
            color: '#c62828',
            padding: '12px',
            borderRadius: '5px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="username">ชื่อผู้ใช้</label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-control"
            value={credentials.username}
            onChange={handleChange}
            required
            placeholder="กรอกชื่อผู้ใช้"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">รหัสผ่าน</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            value={credentials.password}
            onChange={handleChange}
            required
            placeholder="กรอกรหัสผ่าน"
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          style={{ width: '100%' }}
          disabled={loading}
        >
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>

        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          background: '#f5f5f5', 
          borderRadius: '5px',
          fontSize: '14px'
        }}>
          <h4 style={{ marginBottom: '10px', color: '#333' }}>บัญชีทดสอบ:</h4>
          <p><strong>ผู้ดูแลระบบ:</strong> admin / admin123</p>
          <p><strong>ครู:</strong> teacher / teacher123</p>
          <p><strong>นักเรียน:</strong> student / student123</p>
        </div>
      </form>
    </div>
  );
};

export default Login;