import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
// 1. Import your custom API tool instead of axios
import api from '../api'; 
import ResultCard from '../components/ResultCard';

const CollectionView = ({ type }) => {
  const { value } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      setLoading(true);
      try {
        const queryParam = type === 'letter' ? 'letter' : 'category';
        
        // 2. Use api.get() - no full URL, no manual token headers needed
        const res = await api.get(`/archive?${queryParam}=${value}`);
        
        // 3. Keep using res.data.items as you correctly identified
        setResults(res.data.items || []); 
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCollection();
  }, [type, value]);

  return (
    <div style={{ 
      padding: '40px', 
      backgroundColor: '#EFE7DD', 
      minHeight: '100vh' 
    }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/" style={{ color: '#737958', textDecoration: 'none', fontSize: '0.9rem' }}>
          ← Back to Search
        </Link>
      </div>

      <h2 style={{ 
        fontFamily: 'serif', 
        color: '#737958', 
        borderBottom: '2px solid #ACA37E',
        paddingBottom: '10px',
        textTransform: 'capitalize'
      }}>
        {type === 'letter' ? 'Surname Index' : 'Collection'}: {value}
      </h2>

      {loading ? (
        <p style={{ marginTop: '20px', color: '#666' }}>⏳ Loading records...</p>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '25px', 
          marginTop: '30px' 
        }}>
          {results.length > 0 ? (
            results.map(record => (
              <ResultCard key={record._id} record={record} />
            ))
          ) : (
            <div style={{ textAlign: 'center', width: '100%', marginTop: '40px', color: '#888' }}>
               <p style={{ fontSize: '2rem' }}>📂</p>
               <p>No records found in this section yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CollectionView;