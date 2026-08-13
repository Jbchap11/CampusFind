import React, { useState } from 'react';
import { MapPin, Calendar, Mail, CheckCircle2, Edit3, Trash2, Tag, X } from 'lucide-react';

const ItemCard = ({ item, currentUser, onMarkReturned, onDelete, onEdit }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const isOwner = currentUser && item.postedBy && (() => {
    const currentUserId = String(currentUser.id || currentUser._id || '');
    const posterId = typeof item.postedBy === 'object'
      ? String(item.postedBy._id || item.postedBy.id || '')
      : String(item.postedBy);
    return currentUserId && currentUserId === posterId;
  })();

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const reporterName = item.postedBy && typeof item.postedBy === 'object' ? item.postedBy.name : 'Campus Student';
  const reporterEmail = item.postedBy && typeof item.postedBy === 'object' ? item.postedBy.email : '';

  const handleCardClick = (e) => {
    // If the click is inside card-actions, do not trigger the detail modal
    if (e.target.closest('.card-actions')) {
      return;
    }
    setIsDetailOpen(true);
  };

  return (
    <>
      <div className="item-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
        <div>
          <div className="item-reporter">
            <span className="reporter-avatar">{reporterName.charAt(0).toUpperCase()}</span>
            <div className="reporter-info">
              <span className="reporter-name">{reporterName}</span>
              {reporterEmail && <span className="reporter-email">{reporterEmail}</span>}
            </div>
          </div>

          <div className="item-card-header">
            <h3 className="item-title">{item.title}</h3>
            <span className={`status-badge ${item.status}`}>
              {item.status === 'Returned' && <CheckCircle2 size={13} />}
              {item.status}
            </span>
          </div>

          <div className="item-category">
            <Tag size={13} style={{ display: 'inline', marginRight: '4px' }} />
            {item.category}
          </div>

          <p className="item-description">{item.description}</p>

          <div className="item-meta">
            <div className="meta-row">
              <MapPin size={16} />
              <span><strong>Location:</strong> {item.location}</span>
            </div>
            <div className="meta-row">
              <Calendar size={16} />
              <span><strong>Date:</strong> {formatDate(item.date)}</span>
            </div>
          </div>
        </div>

        {isOwner && (
          <div className="card-actions">
            {item.status !== 'Returned' && onMarkReturned && (
              <button 
                onClick={() => onMarkReturned(item._id)} 
                className="btn-action btn-returned"
                title="Mark as Returned"
              >
                <CheckCircle2 size={16} /> Returned
              </button>
            )}

            {onEdit && (
              <button 
                onClick={() => onEdit(item)} 
                className="btn-action btn-edit"
                title="Edit Post"
              >
                <Edit3 size={16} /> Edit
              </button>
            )}

            {onDelete && (
              <button 
                onClick={() => onDelete(item._id)} 
                className="btn-action btn-delete"
                title="Delete Post"
              >
                <Trash2 size={16} /> Delete
              </button>
            )}
          </div>
        )}
      </div>

      {/* Detail Modal Overlay */}
      {isDetailOpen && (
        <div className="modal-overlay" onClick={() => setIsDetailOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsDetailOpen(false)}>
              <X size={20} />
            </button>

            <div className="detail-status-section">
              <div className="item-category" style={{ margin: 0 }}>
                <Tag size={13} style={{ display: 'inline', marginRight: '4px' }} />
                {item.category}
              </div>
              <span className={`status-badge ${item.status}`}>
                {item.status === 'Returned' && <CheckCircle2 size={13} />}
                {item.status}
              </span>
            </div>

            <h2 className="detail-title">{item.title}</h2>

            <div className="item-reporter" style={{ marginBottom: '1.5rem' }}>
              <span className="reporter-avatar" style={{ width: '36px', height: '36px', fontSize: '1.1rem' }}>
                {reporterName.charAt(0).toUpperCase()}
              </span>
              <div className="reporter-info">
                <span className="reporter-name" style={{ fontSize: '1.05rem' }}>{reporterName}</span>
                {reporterEmail && <span className="reporter-email" style={{ fontSize: '0.8rem' }}>{reporterEmail}</span>}
              </div>
            </div>

            <div className="detail-meta-box">
              <div className="meta-row">
                <MapPin size={18} />
                <span><strong>Location:</strong> {item.location}</span>
              </div>
              <div className="meta-row">
                <Calendar size={18} />
                <span><strong>Date Reported:</strong> {formatDate(item.date)}</span>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <strong style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>Description</strong>
              <p className="detail-desc">{item.description}</p>
            </div>

            {/* Conditionally show management actions for the owner or the claim card for other users */}
            {isOwner ? (
              <div className="modal-owner-actions" style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                <div style={{ marginBottom: '1.5rem', background: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <strong style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>Contact Details Provided</strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}>
                    <Mail size={16} />
                    <span>{item.contact}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                  {item.status !== 'Returned' && onMarkReturned && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onMarkReturned(item._id); setIsDetailOpen(false); }} 
                      className="btn-action btn-returned"
                      style={{ flex: 1, padding: '0.8rem 1.2rem', height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
                    >
                      <CheckCircle2 size={16} /> Mark Returned
                    </button>
                  )}

                  {onEdit && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onEdit(item); setIsDetailOpen(false); }} 
                      className="btn-action btn-edit"
                      style={{ flex: 1, padding: '0.8rem 1.2rem', height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
                    >
                      <Edit3 size={16} /> Edit Post
                    </button>
                  )}

                  {onDelete && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(item._id); setIsDetailOpen(false); }} 
                      className="btn-action btn-delete"
                      style={{ flex: 1, padding: '0.8rem 1.2rem', height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
                    >
                      <Trash2 size={16} /> Delete Post
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className={`claim-card ${item.status}`}>
                {item.status === 'Lost' && (
                  <>
                    <div className="claim-title Lost">🙋 Is this yours?</div>
                    <div className="claim-subtitle">If you found this item or have any information, please reach out to the owner.</div>
                  </>
                )}
                {item.status === 'Found' && (
                  <>
                    <div className="claim-title Found">🔍 Is this yours?</div>
                    <div className="claim-subtitle">If you lost this item, please contact the finder to verify and claim it.</div>
                  </>
                )}
                {item.status === 'Returned' && (
                  <>
                    <div className="claim-title Returned">🎉 Successfully Returned</div>
                    <div className="claim-subtitle">This item has been reclaimed by its owner. Thank you!</div>
                  </>
                )}

                <div className="claim-contact-details">
                  <Mail size={18} style={{ color: 'var(--color-emerald-glow)' }} />
                  <span>{item.contact}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ItemCard;
