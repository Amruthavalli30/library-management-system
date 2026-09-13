import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

function BrowseItems() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', author: '', category: '', totalCopies: 1 });
  const [message, setMessage] = useState('');

  const fetchItems = async (searchTerm = '') => {
    try {
      const res = await API.get(`/items${searchTerm ? `?search=${searchTerm}` : ''}`);
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems(search);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await API.post('/items', newItem);
      setMessage('Item added successfully!');
      setNewItem({ title: '', author: '', category: '', totalCopies: 1 });
      setShowAddForm(false);
      fetchItems();
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add item');
    }
  };

  const handleBorrow = async (itemId) => {
    try {
      await API.post(`/borrow/borrow/${itemId}`);
      setMessage('Item borrowed successfully!');
      fetchItems();
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to borrow item');
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await API.delete(`/items/${itemId}`);
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <Link to="/dashboard" style={styles.backLink}>← Dashboard</Link>
        <h2 style={styles.logo}>📖 Browse Items</h2>
        <div />
      </nav>

      <div style={styles.content}>
        {message && <p style={styles.message}>{message}</p>}

        <form onSubmit={handleSearch} style={styles.searchRow}>
          <input
            type="text"
            placeholder="Search by title, author, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchBtn}>Search</button>
        </form>

        {user?.role === 'admin' && (
          <div style={styles.adminSection}>
            <button onClick={() => setShowAddForm(!showAddForm)} style={styles.addBtn}>
              {showAddForm ? 'Cancel' : '+ Add New Item'}
            </button>

            {showAddForm && (
              <form onSubmit={handleAddItem} style={styles.addForm}>
                <input
                  type="text"
                  placeholder="Title"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  style={styles.input}
                  required
                />
                <input
                  type="text"
                  placeholder="Author"
                  value={newItem.author}
                  onChange={(e) => setNewItem({ ...newItem, author: e.target.value })}
                  style={styles.input}
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  style={styles.input}
                  required
                />
                <input
                  type="number"
                  placeholder="Total Copies"
                  min="1"
                  value={newItem.totalCopies}
                  onChange={(e) => setNewItem({ ...newItem, totalCopies: parseInt(e.target.value) })}
                  style={styles.input}
                />
                <button type="submit" style={styles.saveBtn}>Save Item</button>
              </form>
            )}
          </div>
        )}

        <div style={styles.itemsGrid}>
          {items.map((item) => (
            <div key={item._id} style={styles.itemCard}>
              <h3 style={styles.itemTitle}>{item.title}</h3>
              <p style={styles.itemMeta}>by {item.author || 'Unknown'}</p>
              <p style={styles.itemCategory}>{item.category}</p>
              <p style={styles.itemAvailability}>
                {item.availableCopies} / {item.totalCopies} available
              </p>
              <div style={styles.cardActions}>
                {user?.role !== 'admin' && (
                  <button
                    onClick={() => handleBorrow(item._id)}
                    disabled={item.availableCopies < 1}
                    style={{
                      ...styles.borrowBtn,
                      opacity: item.availableCopies < 1 ? 0.5 : 1,
                      cursor: item.availableCopies < 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {item.availableCopies < 1 ? 'Unavailable' : 'Borrow'}
                  </button>
                )}
                {user?.role === 'admin' && (
                  <button onClick={() => handleDelete(item._id)} style={styles.deleteBtn}>Delete</button>
                )}
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && <p style={styles.emptyText}>No items found.</p>}
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
  content: { padding: '32px', maxWidth: '1000px', margin: '0 auto' },
  message: {
    background: '#dcfce7',
    color: '#166534',
    padding: '10px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px'
  },
  searchRow: { display: 'flex', gap: '8px', marginBottom: '20px' },
  searchInput: {
    flex: 1,
    padding: '10px 14px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px'
  },
  searchBtn: {
    padding: '10px 20px',
    background: '#1e293b',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  adminSection: { marginBottom: '24px' },
  addBtn: {
    padding: '10px 20px',
    background: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '12px'
  },
  addForm: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
  },
  input: {
    padding: '10px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px'
  },
  saveBtn: {
    gridColumn: 'span 2',
    padding: '10px',
    background: '#059669',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  itemsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '16px'
  },
  itemCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
  },
  itemTitle: { margin: '0 0 4px 0', color: '#1e293b', fontSize: '16px' },
  itemMeta: { margin: '0 0 4px 0', color: '#64748b', fontSize: '13px' },
  itemCategory: {
    display: 'inline-block',
    background: '#eef2ff',
    color: '#4f46e5',
    fontSize: '12px',
    padding: '2px 8px',
    borderRadius: '6px',
    marginBottom: '8px'
  },
  itemAvailability: { fontSize: '13px', color: '#059669', margin: '8px 0' },
  cardActions: { marginTop: '12px' },
  borrowBtn: {
    width: '100%',
    padding: '8px',
    background: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px'
  },
  deleteBtn: {
    width: '100%',
    padding: '8px',
    background: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    cursor: 'pointer'
  },
  emptyText: { textAlign: 'center', color: '#94a3b8', marginTop: '40px' }
};

export default BrowseItems;
