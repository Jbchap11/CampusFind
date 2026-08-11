import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axiosInstance';
import ItemCard from '../components/ItemCard';
import ItemFilter from '../components/ItemFilter';
import { LogIn, FileText, Search, UserCheck, ShieldCheck, Sparkles, Inbox, X, CheckCircle2 } from 'lucide-react';

const Home = () => {
  const { user, showToast } = useAuth();
  const navigate = useNavigate();

  // Feed states (only used when user is logged in)
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [editingItem, setEditingItem] = useState(null);

  const fetchItems = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const params = {};
      if (searchText.trim() !== '') params.search = searchText;
      if (statusFilter !== 'All') params.status = statusFilter;
      if (categoryFilter !== 'All') params.category = categoryFilter;

      const res = await API.get('/items', { params });
      setItems(res.data);
    } catch (err) {
      console.error('Error fetching items:', err);
      showToast('Failed to load campus items.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    if (user) {
      // Debounce search input to avoid hitting backend on every keypress
      const delayDebounceFn = setTimeout(() => {
        if (active) fetchItems();
      }, 300);

      return () => {
        active = false;
        clearTimeout(delayDebounceFn);
      };
    }
  }, [searchText, statusFilter, categoryFilter, user]);

  const handleMarkReturned = async (id) => {
    try {
      await API.patch(`/items/${id}/returned`);
      showToast('Item marked as returned!');
      fetchItems();
    } catch (err) {
      showToast('Failed to update status.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item post?')) return;
    try {
      await API.delete(`/items/${id}`);
      showToast('Item post deleted.');
      fetchItems();
    } catch (err) {
      showToast('Failed to delete item post.', 'error');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.patch(`/items/${editingItem._id}`, editingItem);
      showToast('Post updated successfully!');
      setEditingItem(null);
      fetchItems();
    } catch (err) {
      showToast('Failed to update post.', 'error');
    }
  };

  if (!user) {
    return (
      <div style={{ margin: 0, padding: 0 }}>
        {/* Front Landing Hero Section */}
        <section className="landing-hero">
          <div className="landing-bg"></div>
          <div className="landing-overlay"></div>

          <div className="landing-content">
            <h1 className="landing-title">
              Campus<span style={{ color: 'var(--color-emerald)' }}>Find</span>
            </h1>
            <p className="landing-tagline">
              The official campus portal for reporting lost belongings, reclaiming found items, and helping fellow students.
            </p>

            <button onClick={() => navigate('/login')} className="hero-signin-btn">
              <LogIn size={20} /> Sign In
            </button>
          </div>
        </section>

        {/* Why CampusFind Section */}
        <section className="why-section">
          <div className="why-container">
            <h2 className="section-title">Why CampusFind?</h2>
            <p className="section-subtitle">
              Built to make recovering lost belongings simple and organized.
            </p>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon" style={{ color: 'var(--color-emerald)' }}>
                  <FileText size={44} />
                </div>
                <h3>📝 Report Items</h3>
                <p>Post lost or found items with essential details.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon" style={{ color: '#38bdf8' }}>
                  <Search size={44} />
                </div>
                <h3>🔍 Search & Filter</h3>
                <p>Quickly find listings by keyword or status.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon" style={{ color: '#fbbf24' }}>
                  <UserCheck size={44} />
                </div>
                <h3>👤 Personal Dashboard</h3>
                <p>Manage your own posts with ease.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon" style={{ color: '#f472b6' }}>
                  <ShieldCheck size={44} />
                </div>
                <h3>🔐 Secure Community</h3>
                <p>Available only to authenticated campus users.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // If user is logged in, show Browse Items page
  return (
    <div style={{ padding: '0 0 2rem 0' }}>
      <section className="hero-banner" style={{ padding: '2rem 1.5rem', marginBottom: '2rem' }}>
        <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>Browse Campus <span style={{ color: 'var(--color-emerald)' }}>Items</span> 🧭</h1>
        <p className="hero-subtitle" style={{ fontSize: '1.05rem', marginBottom: 0 }}>
          Search and view lost & found items posted by fellow campus mates.
        </p>
      </section>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <ItemFilter
          search={searchText}
          setSearch={setSearchText}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
        />

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-emerald)', fontSize: '1.2rem' }}>
            <Sparkles className="spin" size={24} style={{ display: 'inline', marginRight: '8px' }} />
            Loading campus items...
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state" style={{ marginTop: '2rem' }}>
            <Inbox className="empty-icon" size={48} />
            <h3 className="empty-title">No items match your filters</h3>
            <p className="empty-subtitle">
              Try adjusting your search terms or filters, or report a new item.
            </p>
          </div>
        ) : (
          <div className="item-grid" style={{ marginTop: '2rem' }}>
            {items.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                currentUser={user}
                onMarkReturned={handleMarkReturned}
                onDelete={handleDelete}
                onEdit={(item) => setEditingItem(item)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal Overlay */}
      {editingItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="form-card" style={{ width: '100%', maxWidth: '580px', margin: 0, position: 'relative' }}>
            <button
              onClick={() => setEditingItem(null)}
              style={{
                position: 'absolute',
                top: '1.2rem',
                right: '1.2rem',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              <X size={24} />
            </button>

            <h3 className="form-title" style={{ fontSize: '1.8rem' }}>Edit Post</h3>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingItem.location}
                  onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Details</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingItem.contact}
                  onChange={(e) => setEditingItem({ ...editingItem, contact: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn-primary">
                <CheckCircle2 size={18} /> Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
