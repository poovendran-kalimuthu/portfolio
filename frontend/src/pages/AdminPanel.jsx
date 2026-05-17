import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../index.css';

function AdminPanel() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectNum: '',
    stack: '',
    images: [],
    githubLink: '',
    liveDemoLink: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async (showLoader = true) => {
    if (showLoader) setIsFetching(true);
    try {
      const res = await axios.get(`${apiBaseUrl}/api/projects`);
      setProjects(res.data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      if (showLoader) setIsFetching(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const promises = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises)
      .then(base64Images => {
        setFormData(prev => ({
          ...prev,
          images: [...(prev.images || []), ...base64Images]
        }));
      })
      .catch(err => console.error("Error reading files", err));
  };

  const removeImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        stack: formData.stack ? formData.stack.split(',').map(s => s.trim()).filter(Boolean) : []
      };

      if (editingId) {
        await axios.put(`${apiBaseUrl}/api/projects/${editingId}`, payload);
        setEditingId(null);
      } else {
        await axios.post(`${apiBaseUrl}/api/projects`, payload);
      }
      
      setFormData({
        title: '', description: '', projectNum: '', stack: '', images: [], githubLink: '', liveDemoLink: ''
      });
      await fetchProjects(false);
    } catch (error) {
      console.error('Error saving project', error);
      alert('Error saving project. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (project) => {
    setEditingId(project._id);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      projectNum: project.projectNum || '',
      stack: Array.isArray(project.stack) ? project.stack.join(', ') : '',
      images: Array.isArray(project.images) ? project.images : [],
      githubLink: project.githubLink || '',
      liveDemoLink: project.liveDemoLink || ''
    });
    // Scroll to top to see the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        await axios.delete(`${apiBaseUrl}/api/projects/${id}`);
        await fetchProjects(false);
      } catch (error) {
        console.error('Error deleting project', error);
        alert('Error deleting project.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '100px 5%', maxWidth: '1400px', margin: '0 auto', color: 'var(--text)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px', flexWrap: 'wrap', gap: '20px' }}>
        <div className="section-header reveal visible" style={{ margin: 0 }}>
          <span className="section-num" style={{ fontSize: '1.2rem' }}>Dashboard</span>
          <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: 0 }}>Admin Panel</h1>
        </div>
        <Link to="/" className="btn btn-ghost" style={{ padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Portfolio
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px', alignItems: 'start' }}>
        
        {/* Form Section */}
        <div style={{ 
          background: 'var(--bg-light)', 
          padding: '40px', 
          borderRadius: '16px', 
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          position: 'sticky',
          top: '100px'
        }}>
          <h2 style={{ marginBottom: '25px', fontSize: '1.5rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {editingId ? (
              <><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Edit Project</>
            ) : (
              <><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add New Project</>
            )}
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px' }}>
              <div>
                <label style={labelStyle}>Project #</label>
                <input type="text" name="projectNum" value={formData.projectNum} onChange={handleInputChange} placeholder="e.g. P.001" required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Project Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. E-Commerce App" required style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Detailed description of the project..." required rows="5" style={{...inputStyle, resize: 'vertical'}}></textarea>
            </div>

            <div>
              <label style={labelStyle}>Tech Stack</label>
              <input type="text" name="stack" value={formData.stack} onChange={handleInputChange} placeholder="React, Node.js, MongoDB (comma separated)" required style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Upload Project Images</label>
              <div style={{
                border: '2px dashed rgba(255, 255, 255, 0.1)',
                padding: '25px',
                borderRadius: '8px',
                textAlign: 'center',
                background: 'rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative'
              }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--accent)'} onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="2" style={{ marginBottom: '8px' }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', margin: 0 }}>Click or Drag files here to upload</p>
                <input type="file" multiple accept="image/*" onChange={handleFileChange} style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer'
                }} />
              </div>
              
              {/* Draft Images Preview Grid */}
              {formData.images && formData.images.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px', marginTop: '15px' }}>
                  {formData.images.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative', height: '80px', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button type="button" onClick={() => removeImage(idx)} style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: 'rgba(255,77,77,0.8)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        fontSize: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        lineHeight: 1
                      }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={labelStyle}>GitHub Link <span style={{opacity: 0.5}}>(Optional)</span></label>
                <input type="url" name="githubLink" value={formData.githubLink} onChange={handleInputChange} placeholder="https://github.com/..." style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Live Demo <span style={{opacity: 0.5}}>(Optional)</span></label>
                <input type="url" name="liveDemoLink" value={formData.liveDemoLink} onChange={handleInputChange} placeholder="https://..." style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '14px', fontSize: '1rem', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                {editingId ? 'Save Changes' : 'Create Project'}
              </button>
              
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ title: '', description: '', projectNum: '', stack: '', images: [], githubLink: '', liveDemoLink: '' });
                  }} 
                  className="btn btn-ghost" 
                  style={{ flex: 1, padding: '14px', fontSize: '1rem' }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Projects List Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '500' }}>Manage Projects <span style={{ color: 'var(--text-dim)', fontSize: '1rem' }}>({projects.length})</span></h2>
          </div>

          {isFetching ? (
            <div className="cyber-loader-container" style={{ minHeight: '300px' }}>
              <div className="cyber-spinner">
                <div className="cyber-pulse-core"></div>
              </div>
              <div className="cyber-loader-text">Synchronizing collection...</div>
            </div>
          ) : projects.length === 0 ? (
            <div style={{ 
              padding: '60px 20px', 
              background: 'rgba(255,255,255,0.02)', 
              borderRadius: '12px', 
              textAlign: 'center',
              border: '1px dashed rgba(255,255,255,0.1)'
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="1" style={{ marginBottom: '15px' }}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>No projects found in the database.</p>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginTop: '5px' }}>Use the form to add your first project.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {projects.map((project) => (
                <div key={project._id} className="project-card" style={{ 
                  transform: 'none', 
                  transition: 'all 0.3s ease', 
                  border: editingId === project._id ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.05)',
                  boxShadow: editingId === project._id ? '0 0 20px rgba(0, 255, 157, 0.1)' : 'none',
                  padding: '25px',
                  margin: 0
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                      {project.images && project.images.length > 0 && (
                        <div style={{ position: 'relative', marginBottom: '15px', borderRadius: '8px', overflow: 'hidden', height: '140px', background: 'rgba(0,0,0,0.2)' }}>
                          <img src={project.images[0]} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div style={{
                            position: 'absolute',
                            bottom: '8px',
                            right: '8px',
                            background: 'rgba(0, 0, 0, 0.7)',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            color: 'white'
                          }}>
                            {project.images.length} {project.images.length === 1 ? 'image' : 'images'}
                          </div>
                        </div>
                      )}
                      <div className="project-num" style={{ marginBottom: '8px' }}>{project.projectNum}</div>
                      <div className="project-name" style={{ fontSize: '1.3rem', marginBottom: '12px' }}>{project.title}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => handleEdit(project)} style={editBtnStyle}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(project._id)} style={deleteBtnStyle}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <p className="project-desc" style={{ marginBottom: '20px', fontSize: '0.95rem', opacity: 0.8, display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {project.description}
                  </p>
                  
                  <div className="project-stack" style={{ marginBottom: '15px' }}>
                    {Array.isArray(project.stack) && project.stack.map(tag => (
                      <span className="stack-tag" key={tag} style={{ padding: '4px 10px', fontSize: '0.8rem' }}>{tag}</span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px' }}>
                    {project.githubLink ? (
                      <a href={project.githubLink} target="_blank" rel="noreferrer" style={{ color: 'var(--text-dim)', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
                        GitHub
                      </a>
                    ) : <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem', opacity: 0.5 }}>No GitHub Link</span>}
                    
                    {project.liveDemoLink ? (
                      <a href={project.liveDemoLink} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        Live Demo
                      </a>
                    ) : <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem', opacity: 0.5 }}>No Live Demo</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <footer style={{ marginTop: '100px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '30px', textAlign: 'center', color: 'var(--text-dim)' }}>
        <p>© 2025 Poovendran Kalimuthu. Admin Dashboard.</p>
      </footer>

      {isSaving && (
        <div className="crud-loader-overlay">
          <div className="cyber-spinner">
            <div className="cyber-pulse-core"></div>
          </div>
          <div className="cyber-loader-text" style={{ fontSize: '14px' }}>
            {editingId ? 'Updating project in core...' : 'Creating new entity...'}
          </div>
          <div className="crud-progress-bar-wrap">
            <div className="crud-progress-bar-fill"></div>
          </div>
        </div>
      )}

      {isDeleting && (
        <div className="crud-loader-overlay">
          <div className="cyber-spinner">
            <div className="cyber-pulse-core"></div>
          </div>
          <div className="cyber-loader-text" style={{ fontSize: '14px', color: 'var(--accent3)' }}>
            Purging project from database...
          </div>
          <div className="crud-progress-bar-wrap">
            <div className="crud-progress-bar-fill" style={{ background: 'linear-gradient(to right, var(--accent3), var(--accent))' }}></div>
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontSize: '0.9rem',
  color: 'var(--text-dim)',
  fontWeight: '500'
};

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  background: 'rgba(0, 0, 0, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '8px',
  color: 'var(--text)',
  fontSize: '1rem',
  outline: 'none',
  transition: 'all 0.3s ease',
  fontFamily: 'inherit'
};

const editBtnStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: 'var(--text)',
  padding: '8px 14px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.85rem',
  fontWeight: '500',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '6px'
};

const deleteBtnStyle = {
  background: 'rgba(255, 77, 77, 0.1)',
  border: '1px solid rgba(255, 77, 77, 0.3)',
  color: '#ff4d4d',
  padding: '8px 14px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.85rem',
  fontWeight: '500',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '6px'
};

export default AdminPanel;
