import React, { useState, useEffect } from 'react';
import API from '../api/axiosInstance';
import ItemCard from '../components/ItemCard';
import { useAuth } from '../context/AuthContext';
import { Bookmark, Sparkles, X, CheckCircle2 } from 'lucide-react';

const MyPosts = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);

  const { user, showToast } = useAuth();

  const fetchMyPosts = async () => {
    setLoading(true);
    try {
      const res = await API.get('/items/my-posts');
      setItems(res.data);
    } catch (err) {
      console.error('Error fetching my posts:', err);
      showToast('Failed to load your posts.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const handleMarkReturned = async (id) => {
    try {
      await API.patch(`/items/${id}/returned`);
      showToast('Item marked as returned!');
      fetchMyPosts();
    } catch (err) {
      showToast('Failed to update status.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item post?')) return;
    try {
      await API.delete(`/items/${id}`);
      showToast('Item post deleted.');
      fetchMyPosts();
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
      fetchMyPosts();
    } catch (err) {
      showToast('Failed to update post.', 'error');
    }
  };

  return (
    <div>
      <section className="hero-banner" style={{ padding: '2rem 1.5rem', marginBottom: '2rem' }}>
        <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>My <span style={{ color: 'var(--color-emerald)' }}>Posts</span></h1>
        <p className="hero-subtitle" style={{ fontSize: '1.05rem', marginBottom: 0 }}>
          Manage your reported items, mark lost objects as returned, edit descriptions, or remove resolved posts.
        </p>
      </section>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-emerald)', fontSize: '1.2rem' }}>
          <Sparkles className="spin" size={24} style={{ display: 'inline', marginRight: '8px' }} />
          Loading your posts...
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <Bookmark className="empty-icon" size={48} />
          <h3 className="empty-title">You haven't posted any items yet</h3>
          <p className="empty-subtitle">
            Report a lost item or post something you found on campus to get started!
          </p>
        </div>
      ) : (
        <div className="item-grid">
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

export default MyPosts;
