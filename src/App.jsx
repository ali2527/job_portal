import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { setUser } from './redux/authslice';
import JobListings from './components/jobListings';
import Favorites from './components/Favorites';
import Login from './components/login';
import Signup from './components/signup';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { Spin, Layout } from 'antd';
import './App.css';

const { Content } = Layout;

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUserState] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      store.dispatch(setUser(user ? { uid: user.uid, email: user.email } : null));
      setUserState(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );

  return (
    <Provider store={store}>
      <Router>
        <div className="app-container"> {/* ✅ Full-width, full-height wrapper */}
          {user && <Navbar />} {/* ✅ Show Navbar only if logged in */}
          <Layout className="app-layout">
            <Content className="app-content">
              <Routes>
                {/* Protected Routes */}
                <Route path="/" element={<ProtectedRoute><JobListings /></ProtectedRoute>} />
                <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />

                {/* Public Routes */}
                <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
                <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />

                {/* Default Route */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Content>
          </Layout>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
