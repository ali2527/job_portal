import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { Layout, Menu, Button } from 'antd';
import { UserOutlined, LogoutOutlined, LoginOutlined, AppstoreOutlined } from '@ant-design/icons';
import '../App.css';

const { Header } = Layout;

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
    navigate('/login');
  };

  return (
    <Header className="navbar">
      <div className="logo">
        <Link to="/" className="logo-text">JobPortal</Link>
      </div>
      <Menu theme="dark" mode="horizontal" className="menu">
        <Menu.Item key="1" icon={<AppstoreOutlined />}>
          <Link to="/">Home</Link>
        </Menu.Item>
        {user && (
          <Menu.Item key="2" icon={<UserOutlined />}>
            <Link to="/favorites">Favorites</Link>
          </Menu.Item>
        )}
      </Menu>
      <div className="auth-buttons">
        {user ? (
          <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>Logout</Button>
        ) : (
          <>
            <Button type="default" icon={<LoginOutlined />} style={{ marginRight: 10 }} onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button type="primary" onClick={() => navigate('/signup')}>Sign Up</Button>
          </>
        )}
      </div>
    </Header>
  );
};

export default Navbar;
