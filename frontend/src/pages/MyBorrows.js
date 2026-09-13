import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

function MyBorrows() {
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState('');

  const fetchHistory = async () => {
    try {
      const res = await API.get('/borrow/my-history');
      setRecords(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleReturn = async (recordId) => {
    try {
      await API.post(`/borrow/return/${recordId}`);
      setMessage('Item returned successfully!');
      fetchHistory();
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to return item');
    }
  };

  const currentlyBorrowed = records.filter(r => r.status === 'borrowed');
  const returned = records.filter(r => r.status === 'returned');

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <Link to="/dashboard" style={styles.backLink}>← Dashboard</Link>
        <h2 style={styles.logo}>📋 My Borrows</h2>
        <div />
      </nav>

      <div style={styles.content}>
        {message && <p style={styles.message}>{message}</p>}

        <h3 style={styles.sectionTitle}>Currently Borrowed ({currentlyBorrowed.length})</h3>
        {currentlyBorrowed.length === 0 && <p style={styles.emptyText}>No items currently borrowed.</p>}
        <div style={styles.list}>
          {currentlyBorrowed.map((record) => (
            <div key={record._id} style={styles.recordCard}>
              <div>
                <p style={styles.itemTitle}>{record.item?.title}</p>
                <p style={styles.itemMeta}>by {record.item?.author || 'Unknown'}</p>
                <p style={styles.dateText}>
                  Borrowed: {new Date(record.borrowDate).toLocaleDateString()}
                </p>
              </div>
              <button onClick={() => handleReturn(record._id)} style={styles.returnBtn}>
                Return
              </button>
            </div>
          ))}
        </div>

        <h3 style={styles.sectionTitle}>Past Returns ({returned.length})</h3>
        {returned.length === 0 && <p style={styles.emptyText}>No return history yet.</p>}
        <div style={styles.list}>
          {returned.map((record) => (
            <div key={record._id} style={styles.recordCardReturned}>
              <div>
                <p style={styles.itemTitle}>{record.item?.title}</p>
                <p style={styles.dateText}>
                  Borrowed: {new Date(record.borrowDate).toLocaleDateString()} →
                  Returned: {new Date(record.returnDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 32px',
    background: 'white',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
  },
  backLink: { color: '#4f46e5', textDecoration: 'none', fontSize: '14px' },
  logo: { margin: 0, color: '#1e293b' },
  content: { padding: '32px', maxWidth: '700px', margin: '0 auto' },
  message: {
    background: '#dcfce7',
    color: '#166534',
    padding: '10px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px'
  },
  sectionTitle: { color: '#1e293b', marginTop: '24px', marginBottom: '12px' },
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  recordCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'white',
    padding: '16px 20px',
    borderRadius: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
  },
  recordCardReturned: {
    background: '#f1f5f9',
    padding: '16px 20px',
    borderRadius: '10px'
  },
  itemTitle: { margin: '0 0 2px 0', fontWeight: '600', color: '#1e293b' },
  itemMeta: { margin: '0 0 4px 0', color: '#64748b', fontSize: '13px' },
  dateText: { margin: 0, color: '#94a3b8', fontSize: '12px' },
  returnBtn: {
    padding: '8px 16px',
    background: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    cursor: 'pointer'
  },
  emptyText: { color: '#94a3b8', fontSize: '14px' }
};

export default MyBorrows;
