import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalItems: 0, borrowedCount: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const itemsRes = await API.get('/items');
        const totalItems = itemsRes.data.length;

        if (user.role === 'admin') {
          const borrowRes = await API.get('/borrow/all');
          const borrowedCount = borrowRes.data.filter(r => r.status === 'borrowed').length;
          setStats({ totalItems, borrowedCount });
        } else {
          const myBorrowRes = await API.get('/borrow/my-history');
          const borrowedCount = myBorrowRes.data.filter(r => r.status === 'borrowed').length;
          setStats({ totalItems, borrowedCount });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h2 style={styles.logo}>📚 Library System</h2>
        <div>
          <span style={styles.userInfo}>{user?.name} ({user?.role})</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      <div style={styles.content}>
        <h1>Welcome, {user?.name}!</h1>

        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <p style={styles.statNumber}>{stats.totalItems}</p>
            <p style={styles.statLabel}>Total Items</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statNumber}>{stats.borrowedCount}</p>
            <p style={styles.statLabel}>
              {user?.role === 'admin' ? 'Currently Borrowed (All)' : 'My Borrowed Items'}
            </p>
          </div>
        </div>

        <div style={styles.linksRow}>
          <Link to="/browse" style={styles.linkCard}>📖 Browse Items</Link>
          <Link to="/my-borrows" style={styles.linkCard}>📋 My Borrows</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#f8fafc' },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 32px',
    background: 'white',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
  },
  logo: { color: '#1e293b', margin: 0 },
  userInfo: { marginRight: '16px', color: '#475569', fontSize: '14px' },
  logoutBtn: {
    padding: '8px 16px',
    background: '#f1f5f9',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  content: { padding: '32px' },
  statsRow: { display: 'flex', gap: '16px', margin: '24px 0' },
  statCard: {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    flex: 1,
    textAlign: 'center'
  },
  statNumber: { fontSize: '32px', fontWeight: 'bold', color: '#4f46e5', margin: 0 },
  statLabel: { color: '#64748b', fontSize: '14px', marginTop: '4px' },
  linksRow: { display: 'flex', gap: '16px', marginTop: '32px' },
  linkCard: {
    padding: '20px 32px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    textDecoration: 'none',
    color: '#1e293b',
    fontWeight: '500'
  }
};

export default Dashboard;
