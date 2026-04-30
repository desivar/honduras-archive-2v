import React, { useState, useEffect } from 'react';
// 1. Swap axios for your api tool
import api from '../api'; 
import { useParams, useNavigate } from 'react-router-dom';

const EditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // ... (all your state variables stay exactly as you wrote them)
  const [category, setCategory] = useState('Portrait');
  const [eventDate, setEventDate] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [location, setLocation] = useState('');
  const [newspaperName, setNewspaperName] = useState('');
  const [pageNumber, setPageNumber] = useState('');
  const [summary, setSummary] = useState('');
  const [names, setNames] = useState('');
  const [countryOfOrigin, setCountryOfOrigin] = useState('');
  const [eventName, setEventName] = useState('');
  const [peopleInvolved, setPeopleInvolved] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [owner, setOwner] = useState('');
  const [yearFounded, setYearFounded] = useState('');

  const isHistoricEvent = category === 'Historic Event';
  const isBusiness = category === 'Business';
  const isPersonRecord = !isHistoricEvent && !isBusiness;

  useEffect(() => {
    if (!id) {
      setFetchError('No record ID found in the URL.');
      setLoading(false);
      return;
    }

    const fetchRecord = async () => {
      try {
        // 🟢 FIX: Use 'api.get' and use the 'id' from useParams
        const res = await api.get(`/archive/${id}`); 
        const r = res.data;

        if (!r || Object.keys(r).length === 0) {
          setFetchError('The server returned an empty record.');
          setLoading(false);
          return;
        }

        // Set state (this part was already perfect)
        setCategory(r.category || 'Portrait');
        setEventDate(r.eventDate || '');
        setPublicationDate(r.publicationDate || '');
        setLocation(r.location || '');
        setNewspaperName(r.newspaperName || '');
        setPageNumber(r.pageNumber || '');
        setSummary(r.summary || '');
        setImageUrl(r.imageUrl || '');
        setNames(Array.isArray(r.names) ? r.names.join(', ') : r.fullName || '');
        setCountryOfOrigin(r.countryOfOrigin || '');
        setEventName(r.eventName || '');
        setPeopleInvolved(Array.isArray(r.peopleInvolved) ? r.peopleInvolved.join(', ') : '');
        setBusinessName(r.businessName || '');
        setBusinessType(r.businessType || '');
        setOwner(r.owner || '');
        setYearFounded(r.yearFounded || '');

      } catch (err) {
        const status = err.response?.status;
        const message = err.response?.data?.message || err.message;
        setFetchError(
          status === 404
            ? `Record not found (ID: ${id}).`
            : `Error loading record: ${message}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // 🟢 CLEANER: No token, no long URL. api.js handles it all.
      await api.put(`/archive/${id}`, {
          category, eventDate, publicationDate,
          location, newspaperName, pageNumber, summary,
          names: names.split(',').map(n => n.trim()).filter(Boolean),
          countryOfOrigin,
          eventName,
          peopleInvolved: peopleInvolved.split(',').map(n => n.trim()).filter(Boolean),
          businessName, businessType, owner, yearFounded,
      });

      alert('Record updated successfully!');
      navigate(-1);
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      alert(`Error updating record: ${message}`);
    } finally {
      setSaving(false);
    }
  };

  // ... (The rest of your JSX/HTML stays exactly the same)
  if (loading) return <p style={{ padding: '40px', color: '#737958', textAlign: 'center' }}>⏳ Loading record…</p>;
  if (fetchError) return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', textAlign: 'center' }}>
      <p style={{ color: '#a94442', fontWeight: 'bold' }}>⚠️ {fetchError}</p>
      <button onClick={() => navigate(-1)} style={{ marginTop: '16px', padding: '10px 20px', backgroundColor: '#737958', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>← Go Back</button>
    </div>
  );

  return (
    <div style={{ maxWidth: '620px', margin: '40px auto', padding: '30px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      {/* ... rest of your return code ... */}
      <h2 style={{ color: '#737958', textAlign: 'center', marginBottom: '20px' }}>Edit Archive Record</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
         {/* Form fields here */}
         <button type="submit" disabled={saving} style={{ padding: '14px', backgroundColor: saving ? '#aaa' : '#737958', color: 'white', border: 'none', borderRadius: '6px', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
            {saving ? '⏳ Saving…' : '💾 Save Changes'}
         </button>
      </form>
    </div>
  );
};

// ... Styles ...
const labelStyle = { display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '0.9rem', color: '#444' };
const inputStyle = { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem', width: '100%', boxSizing: 'border-box' };
const hintStyle = { margin: '4px 0 0 0', fontSize: '0.75rem', color: '#999', fontStyle: 'italic' };
const sectionStyle = { backgroundColor: '#f7f5ef', border: '2px solid #ACA37E', borderRadius: '8px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' };
const sectionTitleStyle = { margin: 0, fontWeight: 'bold', color: '#737958', fontSize: '0.9rem' };

export default EditPage;