import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

/* ─── Injected styles ──────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Syne:wght@400;600;700;800&display=swap');

  :root {
    --bg:       #080c10;
    --surface:  #0d1117;
    --s2:       #161b22;
    --s3:       #1c2128;
    --border:   #21262d;
    --accent:   #00ff9d;
    --blue:     #00bfff;
    --red:      #ff4d4d;
    --text:     #e6edf3;
    --dim:      #7d8590;
    --mono:     'JetBrains Mono', monospace;
    --sans:     'Syne', sans-serif;
  }

  .ap-root * { box-sizing: border-box; margin: 0; padding: 0; }

  .ap-root {
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    font-family: var(--mono);
    position: relative;
    overflow-x: hidden;
  }

  /* grid bg */
  .ap-root::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(0,255,157,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,157,0.025) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  /* ── TOP BAR ─────────────────────────────────── */
  .ap-topbar {
    position: sticky; top: 0; z-index: 50;
    height: 56px;
    background: rgba(8,12,16,0.9);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 28px;
  }
  .ap-topbar-brand {
    display: flex; align-items: center; gap: 10px;
    font-family: var(--mono); font-size: 13px; font-weight: 500;
    color: var(--text);
  }
  .ap-topbar-brand-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 8px var(--accent);
    animation: apPulse 2s ease-in-out infinite;
  }
  @keyframes apPulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:.45; transform:scale(.7); }
  }
  .ap-topbar-badge {
    font-size: 10px; color: var(--accent); border: 1px solid rgba(0,255,157,.25);
    padding: 2px 8px; letter-spacing:.15em; text-transform:uppercase;
  }
  .ap-topbar-right { display:flex; align-items:center; gap:12px; }
  .ap-back-btn {
    display:flex; align-items:center; gap:6px;
    font-family:var(--mono); font-size:11px; color:var(--dim);
    text-decoration:none; text-transform:uppercase; letter-spacing:.1em;
    border:1px solid var(--border); padding:6px 14px;
    transition: color .2s, border-color .2s;
  }
  .ap-back-btn:hover { color:var(--text); border-color:var(--dim); }

  /* ── LAYOUT ──────────────────────────────────── */
  .ap-body {
    position: relative; z-index: 1;
    max-width: 1360px; margin: 0 auto;
    padding: 32px 28px 80px;
  }

  /* ── STAT STRIP ──────────────────────────────── */
  .ap-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
    margin-bottom: 32px;
    animation: apFadeUp .5s ease forwards;
  }
  @keyframes apFadeUp {
    from { opacity:0; transform:translateY(12px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .ap-stat {
    background: var(--surface);
    padding: 20px 24px;
    display: flex; align-items: center; gap: 16px;
    transition: background .2s;
    cursor: default;
  }
  .ap-stat:hover { background: var(--s2); }
  .ap-stat-icon {
    width: 38px; height: 38px;
    display: flex; align-items:center; justify-content:center;
    border: 1px solid var(--border);
    background: var(--s2);
    flex-shrink: 0;
    color: var(--accent);
  }
  .ap-stat-body {}
  .ap-stat-num {
    font-family: var(--sans); font-size: 24px; font-weight: 800;
    line-height: 1; color: var(--text);
    margin-bottom: 2px;
  }
  .ap-stat-label {
    font-size: 10px; color: var(--dim);
    text-transform: uppercase; letter-spacing:.12em;
  }

  /* ── TABS ────────────────────────────────────── */
  .ap-tabs {
    display: flex; gap: 0;
    border-bottom: 1px solid var(--border);
    margin-bottom: 28px;
    animation: apFadeUp .55s ease forwards .05s; opacity:0;
  }
  .ap-tab {
    padding: 10px 22px;
    font-family:var(--mono); font-size:12px;
    text-transform:uppercase; letter-spacing:.12em;
    color: var(--dim); background:transparent; border:none;
    border-bottom: 2px solid transparent;
    cursor:pointer; transition: all .2s;
    display:flex; align-items:center; gap:7px;
    margin-bottom:-1px;
  }
  .ap-tab.active  { color:var(--accent); border-bottom-color:var(--accent); }
  .ap-tab:hover:not(.active) { color:var(--text); }
  .ap-tab-count {
    background: var(--s2); border:1px solid var(--border);
    padding:1px 6px; font-size:9px; border-radius:2px;
  }
  .ap-tab.active .ap-tab-count { background:rgba(0,255,157,.1); border-color:rgba(0,255,157,.3); color:var(--accent); }

  /* ── MAIN GRID ───────────────────────────────── */
  .ap-main-grid {
    display: grid;
    grid-template-columns: 380px 1fr;
    gap: 24px;
    align-items: start;
    animation: apFadeUp .6s ease forwards .1s; opacity:0;
  }
  @media (max-width:900px) {
    .ap-main-grid { grid-template-columns: 1fr; }
    .ap-stats { grid-template-columns: repeat(2,1fr); }
  }

  /* ── FORM CARD ───────────────────────────────── */
  .ap-form-card {
    background: var(--surface);
    border: 1px solid var(--border);
    position: sticky; top: 76px;
  }
  .ap-form-header {
    padding: 20px 24px 16px;
    border-bottom: 1px solid var(--border);
    display:flex; align-items:center; gap:10px;
  }
  .ap-form-header-icon {
    width:32px; height:32px;
    background: rgba(0,255,157,.08);
    border:1px solid rgba(0,255,157,.2);
    display:flex; align-items:center; justify-content:center;
    color: var(--accent);
  }
  .ap-form-title {
    font-family:var(--sans); font-size:16px; font-weight:700;
    letter-spacing:-.02em;
  }
  .ap-form-body { padding: 24px; display:flex; flex-direction:column; gap:18px; }

  /* field */
  .ap-field { display:flex; flex-direction:column; gap:7px; }
  .ap-label {
    font-size:10px; color:var(--dim);
    text-transform:uppercase; letter-spacing:.12em;
    display:flex; align-items:center; gap:6px;
  }
  .ap-label-opt { color:var(--border); }
  .ap-input {
    width:100%;
    padding:10px 13px;
    background: var(--s2);
    border: 1px solid var(--border);
    color: var(--text);
    font-family: var(--mono); font-size:13px;
    outline:none;
    transition: border-color .2s, background .2s;
  }
  .ap-input:focus { border-color: rgba(0,255,157,.5); background:var(--s3); }
  .ap-input::placeholder { color:var(--border); }
  textarea.ap-input { resize:vertical; min-height:90px; }

  .ap-field-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }

  /* upload zone */
  .ap-upload-zone {
    border:1px dashed var(--border);
    background: var(--s2);
    padding:22px 16px;
    text-align:center; cursor:pointer;
    position:relative;
    transition: border-color .2s, background .2s;
  }
  .ap-upload-zone:hover { border-color:var(--accent); background:rgba(0,255,157,.03); }
  .ap-upload-zone input {
    position:absolute; inset:0; opacity:0; cursor:pointer;
  }
  .ap-upload-icon { color:var(--dim); margin-bottom:6px; }
  .ap-upload-text { font-size:11px; color:var(--dim); }
  .ap-upload-text span { color:var(--accent); }

  /* image preview */
  .ap-img-grid {
    display:grid; grid-template-columns:repeat(auto-fill,minmax(64px,1fr));
    gap:8px; margin-top:12px;
  }
  .ap-img-thumb {
    position:relative; height:64px;
    border:1px solid var(--border); overflow:hidden;
  }
  .ap-img-thumb img { width:100%; height:100%; object-fit:cover; }
  .ap-img-remove {
    position:absolute; top:3px; right:3px;
    background:rgba(255,77,77,.85); color:#fff;
    border:none; width:16px; height:16px;
    font-size:9px; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
  }

  /* form actions */
  .ap-form-actions { display:flex; gap:10px; padding-top:4px; }
  .ap-btn-primary {
    flex:1; padding:11px 16px;
    background:var(--accent); color:var(--bg);
    border:1px solid var(--accent); font-family:var(--mono);
    font-size:11px; font-weight:700; letter-spacing:.1em;
    text-transform:uppercase; cursor:pointer;
    display:flex; align-items:center; justify-content:center; gap:7px;
    transition: background .2s, color .2s, box-shadow .2s;
  }
  .ap-btn-primary:hover {
    background:transparent; color:var(--accent);
    box-shadow: 0 0 20px rgba(0,255,157,.2);
  }
  .ap-btn-ghost {
    flex:1; padding:11px 16px;
    background:transparent; color:var(--dim);
    border:1px solid var(--border); font-family:var(--mono);
    font-size:11px; letter-spacing:.1em; text-transform:uppercase;
    cursor:pointer; transition: color .2s, border-color .2s;
  }
  .ap-btn-ghost:hover { color:var(--text); border-color:var(--dim); }

  /* ── PROJECT LIST ────────────────────────────── */
  .ap-proj-list { display:flex; flex-direction:column; gap:1px; background:var(--border); border:1px solid var(--border); }
  .ap-proj-card {
    background:var(--surface);
    display:grid; grid-template-columns:120px 1fr auto;
    gap:20px; padding:20px 22px;
    align-items:start;
    transition: background .2s;
    position:relative;
  }
  .ap-proj-card::before {
    content:'';
    position:absolute; top:0; left:0; bottom:0;
    width:2px; background:var(--accent);
    transform:scaleY(0); transform-origin:top;
    transition: transform .3s ease;
  }
  .ap-proj-card:hover { background:var(--s2); }
  .ap-proj-card:hover::before { transform:scaleY(1); }
  .ap-proj-card.is-editing { background:var(--s2); }
  .ap-proj-card.is-editing::before { transform:scaleY(1); background:var(--blue); }

  .ap-proj-thumb {
    width:120px; height:80px;
    border:1px solid var(--border); overflow:hidden;
    background:var(--s2);
    position:relative; flex-shrink:0;
  }
  .ap-proj-thumb img { width:100%; height:100%; object-fit:cover; }
  .ap-proj-thumb-empty {
    width:100%; height:100%;
    display:flex; align-items:center; justify-content:center;
    color:var(--border);
  }
  .ap-proj-thumb-count {
    position:absolute; bottom:4px; right:4px;
    background:rgba(0,0,0,.75); font-size:9px; color:var(--dim);
    padding:2px 5px; letter-spacing:.05em;
  }

  .ap-proj-meta {}
  .ap-proj-num { font-size:10px; color:var(--accent); letter-spacing:.15em; margin-bottom:5px; }
  .ap-proj-name {
    font-family:var(--sans); font-size:17px; font-weight:700;
    letter-spacing:-.02em; margin-bottom:7px;
  }
  .ap-proj-desc {
    font-size:12px; color:var(--dim); line-height:1.65;
    display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;
    overflow:hidden; margin-bottom:10px;
  }
  .ap-proj-stack { display:flex; flex-wrap:wrap; gap:5px; margin-bottom:10px; }
  .ap-stack-chip {
    font-size:10px; color:var(--blue);
    border:1px solid rgba(0,191,255,.2);
    padding:2px 7px; letter-spacing:.04em;
  }
  .ap-proj-links { display:flex; gap:14px; }
  .ap-proj-link {
    font-size:11px; color:var(--dim); text-decoration:none;
    display:flex; align-items:center; gap:4px;
    transition:color .2s;
  }
  .ap-proj-link:hover { color:var(--accent); }
  .ap-proj-link-na { font-size:11px; color:var(--border); }

  .ap-proj-actions { display:flex; flex-direction:column; gap:7px; align-items:flex-end; }
  .ap-action-edit {
    display:flex; align-items:center; gap:5px;
    font-family:var(--mono); font-size:10px; text-transform:uppercase; letter-spacing:.1em;
    background:var(--s3); border:1px solid var(--border); color:var(--dim);
    padding:6px 12px; cursor:pointer; transition:all .2s; white-space:nowrap;
  }
  .ap-action-edit:hover { color:var(--text); border-color:var(--dim); }
  .ap-action-del {
    display:flex; align-items:center; gap:5px;
    font-family:var(--mono); font-size:10px; text-transform:uppercase; letter-spacing:.1em;
    background:rgba(255,77,77,.07); border:1px solid rgba(255,77,77,.25); color:var(--red);
    padding:6px 12px; cursor:pointer; transition:all .2s; white-space:nowrap;
  }
  .ap-action-del:hover { background:rgba(255,77,77,.15); }

  /* ── EMPTY STATE ─────────────────────────────── */
  .ap-empty {
    padding:60px 20px; text-align:center;
    border:1px dashed var(--border); background:rgba(255,255,255,.01);
  }
  .ap-empty-icon { color:var(--border); margin-bottom:14px; }
  .ap-empty-title { font-size:14px; color:var(--dim); margin-bottom:6px; }
  .ap-empty-sub   { font-size:12px; color:var(--border); }

  /* ── MESSAGES ────────────────────────────────── */
  .ap-msg-grid {
    display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr));
    gap:1px; background:var(--border); border:1px solid var(--border);
    animation: apFadeUp .6s ease forwards .15s; opacity:0;
  }
  .ap-msg-card {
    background:var(--surface); padding:22px;
    display:flex; flex-direction:column; gap:14px;
    transition:background .2s;
    position:relative; overflow:hidden;
  }
  .ap-msg-card::after {
    content:'';
    position:absolute; top:0; left:0; right:0; height:1px;
    background:linear-gradient(to right, var(--accent), transparent);
    opacity:0; transition:opacity .3s;
  }
  .ap-msg-card:hover { background:var(--s2); }
  .ap-msg-card:hover::after { opacity:1; }
  .ap-msg-head { display:flex; justify-content:space-between; align-items:flex-start; }
  .ap-msg-sender {}
  .ap-msg-name { font-size:14px; font-weight:600; margin-bottom:3px; }
  .ap-msg-email {
    font-size:11px; color:var(--accent); text-decoration:none;
    letter-spacing:.02em;
  }
  .ap-msg-time { font-size:10px; color:var(--dim); text-align:right; white-space:nowrap; }
  .ap-msg-body { font-size:12px; color:var(--dim); line-height:1.7; white-space:pre-wrap; }
  .ap-msg-footer {
    display:flex; justify-content:flex-end;
    padding-top:12px; border-top:1px solid var(--border);
  }

  /* ── SECTION TITLE ───────────────────────────── */
  .ap-section-head {
    display:flex; align-items:center; justify-content:space-between;
    margin-bottom:16px;
  }
  .ap-section-title {
    font-family:var(--sans); font-size:20px; font-weight:700;
    letter-spacing:-.02em; display:flex; align-items:center; gap:10px;
  }
  .ap-section-count {
    font-family:var(--mono); font-size:11px; color:var(--dim);
    border:1px solid var(--border); padding:2px 8px;
  }

  /* ── LOADER OVERLAY ──────────────────────────── */
  .ap-overlay {
    position:fixed; inset:0; z-index:999;
    background:rgba(8,12,16,.85); backdrop-filter:blur(6px);
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    gap:16px;
  }
  .ap-overlay-spinner {
    width:44px; height:44px;
    border:1px solid var(--border);
    border-top-color:var(--accent);
    border-radius:50%;
    animation:apSpin .7s linear infinite;
  }
  @keyframes apSpin { to { transform:rotate(360deg); } }
  .ap-overlay-text { font-size:12px; color:var(--dim); letter-spacing:.1em; }
  .ap-progress-wrap {
    width:200px; height:2px; background:var(--border); overflow:hidden;
  }
  .ap-progress-fill {
    height:100%; width:0;
    background:linear-gradient(to right,var(--accent),var(--blue));
    animation:apProgress 1.8s ease-in-out infinite;
  }
  @keyframes apProgress {
    0%   { width:0%;   margin-left:0%; }
    50%  { width:60%;  margin-left:20%; }
    100% { width:0%;   margin-left:100%; }
  }

  /* loader inside panel */
  .ap-inline-loader {
    min-height:200px; display:flex; flex-direction:column;
    align-items:center; justify-content:center; gap:12px;
  }
  .ap-inline-spinner {
    width:28px; height:28px;
    border:1px solid var(--border); border-top-color:var(--accent);
    border-radius:50%; animation:apSpin .7s linear infinite;
  }
  .ap-inline-text { font-size:11px; color:var(--dim); letter-spacing:.12em; }

  /* ── FOOTER ──────────────────────────────────── */
  .ap-footer {
    margin-top:64px; border-top:1px solid var(--border);
    padding-top:24px; text-align:center;
    font-size:11px; color:var(--border); letter-spacing:.05em;
  }

  /* ── SCROLLBAR ───────────────────────────────── */
  .ap-root ::-webkit-scrollbar { width:3px; }
  .ap-root ::-webkit-scrollbar-track { background:var(--bg); }
  .ap-root ::-webkit-scrollbar-thumb { background:var(--accent); }
`;

/* ─── Component ────────────────────────────────────────────────── */
function AdminPanel() {
  const apiBaseUrl = import.meta.env.MODE === 'production'
    ? 'https://portfolio-0vh9.onrender.com'
    : 'http://localhost:5000';

  const [projects, setProjects]           = useState([]);
  const [messages, setMessages]           = useState([]);
  const [activeTab, setActiveTab]         = useState('projects'); // 'projects' | 'messages'
  const [formData, setFormData]           = useState(emptyForm());
  const [editingId, setEditingId]         = useState(null);
  const [isFetching, setIsFetching]       = useState(false);
  const [isSaving, setIsSaving]           = useState(false);
  const [isDeleting, setIsDeleting]       = useState(false);
  const [isFetchingMsgs, setIsFetchingMsgs] = useState(false);

  function emptyForm() {
    return { title:'', description:'', projectNum:'', stack:'', images:[], githubLink:'', liveDemoLink:'' };
  }

  useEffect(() => { fetchProjects(); fetchMessages(); }, []);

  const fetchProjects = async (loader = true) => {
    if (loader) setIsFetching(true);
    try { const r = await axios.get(`${apiBaseUrl}/api/projects`); setProjects(r.data); }
    catch (e) { console.error(e); }
    finally { if (loader) setIsFetching(false); }
  };

  const fetchMessages = async () => {
    setIsFetchingMsgs(true);
    try { const r = await axios.get(`${apiBaseUrl}/api/messages`); setMessages(r.data); }
    catch (e) { console.error(e); }
    finally { setIsFetchingMsgs(false); }
  };

  const handleInput = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleFiles = e => {
    const files = Array.from(e.target.files);
    Promise.all(files.map(f => new Promise((res, rej) => {
      const r = new FileReader();
      r.onloadend = () => res(r.result);
      r.onerror   = rej;
      r.readAsDataURL(f);
    }))).then(imgs => setFormData(p => ({ ...p, images: [...(p.images||[]), ...imgs] })));
  };

  const removeImage = idx =>
    setFormData(p => ({ ...p, images: p.images.filter((_,i) => i !== idx) }));

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = { ...formData, stack: formData.stack ? formData.stack.split(',').map(s=>s.trim()).filter(Boolean) : [] };
      if (editingId) { await axios.put(`${apiBaseUrl}/api/projects/${editingId}`, payload); setEditingId(null); }
      else             await axios.post(`${apiBaseUrl}/api/projects`, payload);
      setFormData(emptyForm());
      await fetchProjects(false);
    } catch (e) { console.error(e); alert('Error saving project.'); }
    finally { setIsSaving(false); }
  };

  const handleEdit = p => {
    setEditingId(p._id);
    setFormData({
      title: p.title||'', description: p.description||'', projectNum: p.projectNum||'',
      stack: Array.isArray(p.stack) ? p.stack.join(', ') : '',
      images: Array.isArray(p.images) ? p.images : [],
      githubLink: p.githubLink||'', liveDemoLink: p.liveDemoLink||''
    });
    window.scrollTo({ top:0, behavior:'smooth' });
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this project? This cannot be undone.')) return;
    setIsDeleting(true);
    try { await axios.delete(`${apiBaseUrl}/api/projects/${id}`); await fetchProjects(false); }
    catch (e) { console.error(e); alert('Error deleting project.'); }
    finally { setIsDeleting(false); }
  };

  const handleDeleteMsg = async id => {
    if (!window.confirm('Purge this message?')) return;
    try { await axios.delete(`${apiBaseUrl}/api/messages/${id}`); fetchMessages(); }
    catch (e) { console.error(e); }
  };

  const cancelEdit = () => { setEditingId(null); setFormData(emptyForm()); };

  /* icons */
  const IcPlus   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
  const IcEdit   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
  const IcTrash  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
  const IcSave   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
  const IcBack   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
  const IcImg    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
  const IcGit    = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>;
  const IcDemo   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
  const IcMail   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
  const IcFolder = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>;

  return (
    <>
      <style>{STYLES}</style>
      <div className="ap-root">

        {/* TOP BAR */}
        <header className="ap-topbar">
          <div className="ap-topbar-brand">
            <div className="ap-topbar-brand-dot" />
            <span style={{fontFamily:'var(--sans)', fontWeight:700}}>Admin</span>
            <span style={{color:'var(--dim)'}}>/ Dashboard</span>
          </div>
          <div className="ap-topbar-right">
            <span className="ap-topbar-badge">Secure</span>
            <Link to="/" className="ap-back-btn">
              <IcBack /> Portfolio
            </Link>
          </div>
        </header>

        <div className="ap-body">

          {/* STAT STRIP */}
          <div className="ap-stats">
            {[
              { icon: <IcFolder />, num: projects.length, label: 'Total Projects' },
              { icon: <IcImg />,    num: projects.reduce((a,p) => a+(p.images?.length||0), 0), label: 'Media Assets' },
              { icon: <IcMail />,   num: messages.length, label: 'Inbox Messages' },
              { icon: <IcGit />,    num: projects.filter(p=>p.githubLink).length, label: 'GitHub Links' },
            ].map((s,i) => (
              <div className="ap-stat" key={i}>
                <div className="ap-stat-icon">{s.icon}</div>
                <div className="ap-stat-body">
                  <div className="ap-stat-num">{s.num}</div>
                  <div className="ap-stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* TABS */}
          <div className="ap-tabs">
            <button className={`ap-tab ${activeTab==='projects'?'active':''}`} onClick={()=>setActiveTab('projects')}>
              <IcFolder />
              Projects
              <span className="ap-tab-count">{projects.length}</span>
            </button>
            <button className={`ap-tab ${activeTab==='messages'?'active':''}`} onClick={()=>setActiveTab('messages')}>
              <IcMail />
              Messages
              <span className="ap-tab-count">{messages.length}</span>
            </button>
          </div>

          {/* PROJECTS TAB */}
          {activeTab === 'projects' && (
            <div className="ap-main-grid">

              {/* ── FORM ── */}
              <div className="ap-form-card">
                <div className="ap-form-header">
                  <div className="ap-form-header-icon">
                    {editingId ? <IcEdit /> : <IcPlus />}
                  </div>
                  <div className="ap-form-title">
                    {editingId ? 'Edit Project' : 'New Project'}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="ap-form-body">
                  <div className="ap-field-row">
                    <div className="ap-field">
                      <label className="ap-label">Project #</label>
                      <input className="ap-input" name="projectNum" value={formData.projectNum}
                        onChange={handleInput} placeholder="P.001" required />
                    </div>
                    <div className="ap-field">
                      <label className="ap-label">Title</label>
                      <input className="ap-input" name="title" value={formData.title}
                        onChange={handleInput} placeholder="Project Name" required />
                    </div>
                  </div>

                  <div className="ap-field">
                    <label className="ap-label">Description</label>
                    <textarea className="ap-input" name="description" value={formData.description}
                      onChange={handleInput} placeholder="What does this project do..." required rows="4" />
                  </div>

                  <div className="ap-field">
                    <label className="ap-label">Tech Stack <span className="ap-label-opt">(comma separated)</span></label>
                    <input className="ap-input" name="stack" value={formData.stack}
                      onChange={handleInput} placeholder="React, Node.js, MongoDB" required />
                  </div>

                  <div className="ap-field">
                    <label className="ap-label">Images</label>
                    <div className="ap-upload-zone">
                      <div className="ap-upload-icon"><IcImg /></div>
                      <div className="ap-upload-text">Drop files or <span>browse</span></div>
                      <input type="file" multiple accept="image/*" onChange={handleFiles} />
                    </div>
                    {formData.images?.length > 0 && (
                      <div className="ap-img-grid">
                        {formData.images.map((img,idx) => (
                          <div className="ap-img-thumb" key={idx}>
                            <img src={img} alt="" />
                            <button type="button" className="ap-img-remove" onClick={()=>removeImage(idx)}>×</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="ap-field-row">
                    <div className="ap-field">
                      <label className="ap-label">GitHub <span className="ap-label-opt">(optional)</span></label>
                      <input className="ap-input" type="url" name="githubLink" value={formData.githubLink}
                        onChange={handleInput} placeholder="https://github.com/..." />
                    </div>
                    <div className="ap-field">
                      <label className="ap-label">Live Demo <span className="ap-label-opt">(optional)</span></label>
                      <input className="ap-input" type="url" name="liveDemoLink" value={formData.liveDemoLink}
                        onChange={handleInput} placeholder="https://..." />
                    </div>
                  </div>

                  <div className="ap-form-actions">
                    <button type="submit" className="ap-btn-primary">
                      <IcSave />
                      {editingId ? 'Save Changes' : 'Create Project'}
                    </button>
                    {editingId && (
                      <button type="button" className="ap-btn-ghost" onClick={cancelEdit}>Cancel</button>
                    )}
                  </div>
                </form>
              </div>

              {/* ── PROJECT LIST ── */}
              <div>
                <div className="ap-section-head">
                  <h2 className="ap-section-title">
                    Manage Projects
                    <span className="ap-section-count">{projects.length}</span>
                  </h2>
                </div>

                {isFetching ? (
                  <div className="ap-inline-loader">
                    <div className="ap-inline-spinner" />
                    <div className="ap-inline-text">Synchronizing collection...</div>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="ap-empty">
                    <div className="ap-empty-icon"><IcFolder /></div>
                    <div className="ap-empty-title">No projects yet</div>
                    <div className="ap-empty-sub">Use the form to add your first project.</div>
                  </div>
                ) : (
                  <div className="ap-proj-list">
                    {projects.map(p => (
                      <div key={p._id} className={`ap-proj-card ${editingId===p._id?'is-editing':''}`}>

                        {/* thumbnail */}
                        <div className="ap-proj-thumb">
                          {p.images?.length > 0
                            ? <>
                                <img src={p.images[0]} alt={p.title} />
                                {p.images.length > 1 && <div className="ap-proj-thumb-count">+{p.images.length-1}</div>}
                              </>
                            : <div className="ap-proj-thumb-empty"><IcImg /></div>
                          }
                        </div>

                        {/* meta */}
                        <div className="ap-proj-meta">
                          <div className="ap-proj-num">{p.projectNum}</div>
                          <div className="ap-proj-name">{p.title}</div>
                          <div className="ap-proj-desc">{p.description}</div>
                          <div className="ap-proj-stack">
                            {Array.isArray(p.stack) && p.stack.map(t => (
                              <span className="ap-stack-chip" key={t}>{t}</span>
                            ))}
                          </div>
                          <div className="ap-proj-links">
                            {p.githubLink
                              ? <a href={p.githubLink} target="_blank" rel="noreferrer" className="ap-proj-link"><IcGit /> GitHub</a>
                              : <span className="ap-proj-link-na">No GitHub</span>
                            }
                            {p.liveDemoLink
                              ? <a href={p.liveDemoLink} target="_blank" rel="noreferrer" className="ap-proj-link"><IcDemo /> Live Demo</a>
                              : <span className="ap-proj-link-na">No Demo</span>
                            }
                          </div>
                        </div>

                        {/* actions */}
                        <div className="ap-proj-actions">
                          <button className="ap-action-edit" onClick={()=>handleEdit(p)}><IcEdit /> Edit</button>
                          <button className="ap-action-del"  onClick={()=>handleDelete(p._id)}><IcTrash /> Delete</button>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MESSAGES TAB */}
          {activeTab === 'messages' && (
            <div>
              <div className="ap-section-head">
                <h2 className="ap-section-title">
                  <IcMail />
                  Inbox
                  <span className="ap-section-count">{messages.length}</span>
                </h2>
              </div>

              {isFetchingMsgs ? (
                <div className="ap-inline-loader">
                  <div className="ap-inline-spinner" />
                  <div className="ap-inline-text">Decrypting incoming transmissions...</div>
                </div>
              ) : messages.length === 0 ? (
                <div className="ap-empty">
                  <div className="ap-empty-icon"><IcMail /></div>
                  <div className="ap-empty-title">No messages yet</div>
                  <div className="ap-empty-sub">Visitor messages will appear here.</div>
                </div>
              ) : (
                <div className="ap-msg-grid">
                  {messages.map(m => (
                    <div key={m._id} className="ap-msg-card">
                      <div className="ap-msg-head">
                        <div className="ap-msg-sender">
                          <div className="ap-msg-name">{m.name}</div>
                          <a href={`mailto:${m.email}`} className="ap-msg-email">{m.email}</a>
                        </div>
                        <div className="ap-msg-time">
                          {new Date(m.createdAt).toLocaleDateString(undefined,{month:'short',day:'numeric'})}<br/>
                          {new Date(m.createdAt).toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'})}
                        </div>
                      </div>
                      <div className="ap-msg-body">{m.message}</div>
                      <div className="ap-msg-footer">
                        <button className="ap-action-del" onClick={()=>handleDeleteMsg(m._id)}>
                          <IcTrash /> Purge
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="ap-footer">© 2025 Poovendran Kalimuthu — Admin Dashboard</div>
        </div>

        {/* SAVING OVERLAY */}
        {isSaving && (
          <div className="ap-overlay">
            <div className="ap-overlay-spinner" />
            <div className="ap-overlay-text">
              {editingId ? 'Updating project...' : 'Creating new entity...'}
            </div>
            <div className="ap-progress-wrap"><div className="ap-progress-fill" /></div>
          </div>
        )}

        {/* DELETING OVERLAY */}
        {isDeleting && (
          <div className="ap-overlay">
            <div className="ap-overlay-spinner" style={{borderTopColor:'var(--red)'}} />
            <div className="ap-overlay-text" style={{color:'var(--red)'}}>Purging from database...</div>
            <div className="ap-progress-wrap">
              <div className="ap-progress-fill" style={{background:'linear-gradient(to right,var(--red),var(--accent))'}} />
            </div>
          </div>
        )}

      </div>
    </>
  );
}

export default AdminPanel;