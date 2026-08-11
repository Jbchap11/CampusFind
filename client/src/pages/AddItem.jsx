import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Tag, MapPin, Calendar, Mail, FileText } from 'lucide-react';

const CATEGORIES = [
  'Electronics',
  'ID & Cards',
  'Books & Notes',
  'Clothing & Bags',
  'Keys',
  'Accessories',
  'Other'
];

const AddItem = () => {
  const { user, showToast } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Electronics',
    status: 'Lost',
    location: '',
    date: new Date().toISOString().split('T')[0],
    contact: user?.email || ''
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.location || !formData.contact) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await API.post('/items', formData);
      showToast('Item post created successfully!');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Error creating post.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-card" style={{ maxWidth: '640px' }}>
      <h2 className="form-title">Report an Item</h2>
      <p className="form-subtitle">Post a lost object or report an item you found on campus</p>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.4rem' }}>
          <div style={{ flex: 1 }}>
            <label className="form-label">Post Status Type</label>
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button
                type="button"
                className={`pill-btn ${formData.status === 'Lost' ? 'active' : ''}`}
                style={{ flex: 1, padding: '0.8rem' }}
                onClick={() => setFormData({ ...formData, status: 'Lost' })}
              >
                🔴 Lost Item
              </button>
              <button
                type="button"
                className={`pill-btn ${formData.status === 'Found' ? 'active' : ''}`}
                style={{ flex: 1, padding: '0.8rem' }}
                onClick={() => setFormData({ ...formData, status: 'Found' })}
              >
                🟢 Found Item
              </button>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label"><FileText size={16} style={{ marginRight: '6px' }} /> Item Title</label>
          <input
            type="text"
            name="title"
            className="form-input"
            placeholder="e.g. Blue Hydro Flask / Sony Wireless Headphones"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label"><Tag size={16} style={{ marginRight: '6px' }} /> Category</label>
          <select
            name="category"
            className="form-select"
            value={formData.category}
            onChange={handleChange}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label"><MapPin size={16} style={{ marginRight: '6px' }} /> Campus Location</label>
          <input
            type="text"
            name="location"
            className="form-input"
            placeholder="e.g. Science Block B Room 204 / Library Lawn"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label"><Calendar size={16} style={{ marginRight: '6px' }} /> Date Lost/Found</label>
            <input
              type="date"
              name="date"
              className="form-input"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label"><Mail size={16} style={{ marginRight: '6px' }} /> Contact Details</label>
            <input
              type="text"
              name="contact"
              className="form-input"
              placeholder="Email or Phone Number"
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Detailed Description</label>
          <textarea
            name="description"
            className="form-textarea"
            placeholder="Describe key features, color, brand, or specific distinguishing marks..."
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn-primary" disabled={submitting}>
          <PlusCircle size={20} />
          {submitting ? 'Publishing post...' : 'Publish Item Post'}
        </button>
      </form>
    </div>
  );
};

export default AddItem;
