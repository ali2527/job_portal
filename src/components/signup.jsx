import { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Input, Button, Typography, Row, Col, Form } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../App.css';

const { Title } = Typography;

const getErrorMessage = (error) => {
  const errorMessage = error.message || '';

  if (errorMessage.includes('EMAIL_EXISTS')) {
    return 'This email is already registered. Try logging in.';
  } else if (errorMessage.includes('INVALID_EMAIL')) {
    return 'Please enter a valid email address.';
  } else if (errorMessage.includes('WEAK_PASSWORD')) {
    return 'Password must be at least 6 characters long.';
  } else {
    return 'An unexpected error occurred. Please try again.';
  }
};

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Passwords do not match!',
      });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });

      Swal.fire({
        icon: 'success',
        title: 'Signup Successful',
        text: 'Welcome!',
        timer: 2000,
        showConfirmButton: false,
      });

      navigate('/login');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Signup Failed',
        text: getErrorMessage(error),
      });
    }
  };

  return (
    <div className="auth-container">
      <Row className="auth-box">
        <Col xs={0} sm={0} md={12} className="auth-image" />
        <Col xs={24} sm={24} md={12} className="auth-form">
          <Title level={2} className="auth-title">Sign Up</Title>
          <Form layout="vertical" onFinish={handleSignup}>
            <Form.Item label="Full Name" name="name" className="auth-label">
              <Input size="large" value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Item>
            <Form.Item label="Email" name="email" className="auth-label">
              <Input size="large" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Item>
            <Form.Item label="Password" name="password" className="auth-label">
              <Input.Password size="large" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Item>
            <Form.Item label="Confirm Password" name="confirmPassword" className="auth-label">
              <Input.Password size="large" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </Form.Item>
            <Button type="primary" block size="large" htmlType="submit">Sign Up</Button>
          </Form>
          <p className="auth-switch">Already have an account? <Link to="/login">Login here</Link></p>
        </Col>
      </Row>
    </div>
  );
};

export default Signup;
