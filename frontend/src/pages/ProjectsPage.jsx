import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react';
import '../index.css';

const Github = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

function ProjectsPage() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch projects
    setIsLoading(true);
    const apiBaseUrl = import.meta.env.MODE === 'production'
      ? 'https://portfolio-0vh9.onrender.com'
      : 'http://localhost:5000';
    axios.get(`${apiBaseUrl}/api/projects`)
      .then(res => {
        setProjects(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    // Add custom cursor class to body
    document.body.classList.add('custom-cursor-active');

    // Cursor logic
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    let mx = 0, my = 0, rx = 0, ry = 0;
    
    const handleMouseMove = (e) => { 
      mx = e.clientX; 
      my = e.clientY; 
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    let animId;
    const animCursor = () => {
      if (cursor && ring) {
        const isHovering = cursor.classList.contains('hovering');
        cursor.style.transform = `translate(${mx - 5}px, ${my - 5}px)${isHovering ? ' scale(1.5)' : ''}`;
        rx += (mx - rx - 18) * 0.12;
        ry += (my - ry - 18) * 0.12;
        ring.style.transform = `translate(${rx}px, ${ry}px)`;
      }
      animId = requestAnimationFrame(animCursor);
    };
    animCursor();

    return () => {
      document.body.classList.remove('custom-cursor-active');
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    const hoverElements = document.querySelectorAll('a, button, .project-card');
    
    const handleMouseEnter = () => {
      if (ring && cursor) {
        ring.style.width = '52px'; 
        ring.style.height = '52px';
        ring.style.borderColor = 'rgba(0,255,157,0.7)';
        cursor.classList.add('hovering');
      }
    };
    
    const handleMouseLeave = () => {
      if (ring && cursor) {
        ring.style.width = '36px'; 
        ring.style.height = '36px';
        ring.style.borderColor = 'rgba(0,255,157,0.4)';
        cursor.classList.remove('hovering');
      }
    };

    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => observer.observe(el));

    return () => {
      hoverElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      observer.disconnect();
    };
  }, [projects]);

  return (
    <>
      <div className="cursor" id="cursor" ref={cursorRef}></div>
      <div className="cursor-ring" id="cursorRing" ref={ringRef}></div>

      <nav id="nav" className="scrolled">
        <div className="nav-logo">
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            <span>~/</span>poovendran<span>.dev</span>
          </Link>
        </div>
        <ul className="nav-links">
          <li><Link to="/">Back to Home</Link></li>
        </ul>
      </nav>

      <section style={{ paddingTop: '150px', minHeight: '100vh' }}>
        <div className="section-header reveal">
          <span className="section-num">03</span>
          <h1 className="section-title">Complete Archive</h1>
          <div className="section-line"></div>
        </div>
        {isLoading ? (
          <div className="cyber-loader-container" style={{ marginBottom: '80px' }}>
            <div className="cyber-spinner">
              <div className="cyber-pulse-core"></div>
            </div>
            <div className="cyber-loader-text">Initializing Feed...</div>
          </div>
        ) : (
          <div className="projects-grid" style={{ marginBottom: '80px' }}>
            {projects.map((project, index) => (
              <div className="project-card reveal" key={project._id || index} onClick={() => { setSelectedProject(project); setActiveImageIndex(0); }} style={{ cursor: 'pointer' }}>
                <div className="project-num">{project.projectNum}</div>
                <div className="project-name">{project.title}</div>
                <p className="project-desc">{project.description}</p>
                <div className="project-stack">
                  {project.stack && project.stack.map(tag => (
                    <span className="stack-tag" key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="project-links">
                  {project.githubLink && (
                    <a href={project.githubLink} className="project-link" onClick={e => e.stopPropagation()}>
                      <Github size={12} />
                      GitHub
                    </a>
                  )}
                  {project.liveDemoLink && (
                    <a href={project.liveDemoLink} className="project-link" onClick={e => e.stopPropagation()}>
                      <ExternalLink size={12} />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
            {projects.length === 0 && (
               <div className="project-card reveal">
                 <p className="project-desc">No projects found in the archive.</p>
               </div>
            )}
          </div>
        )}
      </section>

      <footer>
        <span>© 2025 Poovendran Kalimuthu. Built with intention.</span>
        <span>
          Designed &amp; coded from scratch. | <Link to="/admin" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Admin</Link>
        </span>
      </footer>

      {/* PROJECT DETAIL MODAL */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            
            {/* Close Button */}
            <button onClick={() => setSelectedProject(null)} style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text)',
              zIndex: 10,
              transition: 'all 0.2s'
            }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255, 77, 77, 0.2)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}>
              <X size={18} />
            </button>

            <div className="modal-content-grid">
              
              {/* Left Side: Image Carousel */}
              <div className="modal-carousel-wrap">
                {selectedProject.images && selectedProject.images.length > 0 ? (
                  <>
                    <div className="modal-carousel-display">
                      <img src={selectedProject.images[activeImageIndex]} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      
                      {selectedProject.images.length > 1 && (
                        <>
                          <button onClick={() => setActiveImageIndex(prev => (prev - 1 + selectedProject.images.length) % selectedProject.images.length)} style={{
                            position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)',
                            background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%',
                            width: '32px', height: '32px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            <ChevronLeft size={16} />
                          </button>
                          <button onClick={() => setActiveImageIndex(prev => (prev + 1) % selectedProject.images.length)} style={{
                            position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)',
                            background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%',
                            width: '32px', height: '32px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            <ChevronRight size={16} />
                          </button>
                        </>
                      )}
                    </div>
                    {/* Thumbnails indicator */}
                    <div className="modal-carousel-thumbs">
                      {selectedProject.images.map((img, idx) => (
                        <div key={idx} onClick={() => setActiveImageIndex(idx)} className={`modal-carousel-thumb ${activeImageIndex === idx ? 'active' : ''}`}>
                          <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)', color: 'var(--text-dim)' }}>
                    No images available for this project
                  </div>
                )}
              </div>

              {/* Right Side: Project Metadata */}
              <div className="modal-right-info">
                <div>
                  <div className="project-num" style={{ marginBottom: '5px' }}>{selectedProject.projectNum}</div>
                  <h3 style={{ fontSize: '1.8rem', color: 'var(--text)', fontWeight: '600', marginBottom: '15px', marginTop: 0 }}>{selectedProject.title}</h3>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px', whiteSpace: 'pre-wrap' }}>{selectedProject.description}</p>
                  
                  <div style={{ marginBottom: '25px' }}>
                    <h4 style={{ fontSize: '0.85rem', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Technologies</h4>
                    <div className="project-stack" style={{ margin: 0 }}>
                      {selectedProject.stack && selectedProject.stack.map(tag => (
                        <span className="stack-tag" key={tag} style={{ padding: '5px 12px', fontSize: '0.8rem' }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '15px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
                  {selectedProject.githubLink && (
                    <a href={selectedProject.githubLink} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ flex: 1, textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '12px' }}>
                      <Github size={16} />
                      Source Code
                    </a>
                  )}
                  {selectedProject.liveDemoLink && (
                    <a href={selectedProject.liveDemoLink} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ flex: 1, textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '12px' }}>
                      <ExternalLink size={16} />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProjectsPage;
