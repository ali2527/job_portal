import { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Input, Button, Typography, Row, Col, Form } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../App.css';

const { Title } = Typography;

const getErrorMessage = (error) => {
  if (error.code === 'auth/invalid-credential' || error.message.includes('INVALID_LOGIN_CREDENTIALS')) {
    return 'Invalid email or password. Please try again.';
  } else if (error.message.includes('TOO_MANY_ATTEMPTS_TRY_LATER')) {
    return 'Too many failed attempts. Please try again later.';
  } else if (error.message.includes('NETWORK_ERROR')) {
    return 'Network error. Please check your internet connection.';
  }
  return 'An unexpected error occurred. Please try again.';
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: 'Welcome back!',
        timer: 2000,
        showConfirmButton: false,
      });
      navigate('/');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: getErrorMessage(error),
      });
    }
  }

  
  return (
    <div className="auth-container">
      <Row className="auth-box">
        {/* Left Section - Image */}
        <Col xs={0} sm={0} md={12} className="auth-image" />

        {/* Right Section - Form */}
        <Col xs={24} sm={24} md={12} className="auth-form">
          <Title level={2} className="auth-title">Login</Title>
          <Form layout="vertical" onFinish={handleLogin}>
            <Form.Item label="Email" name="email" className="auth-label">
              <Input size="large" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Item>
            <Form.Item label="Password" name="password" className="auth-label">
              <Input.Password size="large" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Item>
            <Button type="primary" block size="large" htmlType="submit">Login</Button>
          </Form>
          <p className="auth-switch">Don't have an account? <Link to="/signup">Sign up here</Link></p>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
