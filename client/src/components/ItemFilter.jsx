import React from 'react';
import { Search, Filter } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Electronics',
  'ID & Cards',
  'Books & Notes',
  'Clothing & Bags',
  'Keys',
  'Accessories',
  'Other'
];

const ItemFilter = ({ search, setSearch, statusFilter, setStatusFilter, categoryFilter, setCategoryFilter }) => {
  return (
    <div>
      <div className="search-container" style={{ marginBottom: '1.8rem' }}>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search by title, location, or description (e.g. MacBook, Library, ID)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="search-btn" type="button">
          <Search size={18} /> Search
        </button>
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <span className="filter-label"><Filter size={16} style={{ marginRight: '4px' }} /> Status:</span>
          {['All', 'Lost', 'Found', 'Returned'].map((st) => (
            <button
              key={st}
              className={`pill-btn ${statusFilter === st ? 'active' : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="filter-group">
          <span className="filter-label">Category:</span>
          <select 
            className="select-input" 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ItemFilter;
