import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ExternalLink, X, ChevronLeft, ChevronRight, Mail, BookOpen, Share2, Send, Check } from 'lucide-react';
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

const Linkedin = ({ size = 24, ...props }) => (
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
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Twitter = ({ size = 24, ...props }) => (
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
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Whatsapp = ({ size = 24, ...props }) => (
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
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

function Portfolio() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const typingRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showConnections, setShowConnections] = useState(false);
  const [msgFormData, setMsgFormData] = useState({ name: '', email: '', message: '' });
  const [msgSending, setMsgSending] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState(false);
  const [msgError, setMsgError] = useState('');

  const handleMsgSubmit = async (e) => {
    e.preventDefault();
    setMsgSending(true);
    setMsgError('');
    setMsgSuccess(false);
    const apiBaseUrl = import.meta.env.MODE === 'production'
      ? 'https://portfolio-0vh9.onrender.com'
      : 'http://localhost:5000';
    try {
      await axios.post(`${apiBaseUrl}/api/messages`, msgFormData);
      setMsgSuccess(true);
      setMsgFormData({ name: '', email: '', message: '' });
      setTimeout(() => setMsgSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      setMsgError('Failed to transmit message. Please retry.');
    } finally {
      setMsgSending(false);
    }
  };

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
 
    // Nav scroll
    const nav = document.getElementById('nav');
    const handleScroll = () => {
      if (nav) {
        nav.classList.toggle('scrolled', window.scrollY > 40);
      }
    };
    window.addEventListener('scroll', handleScroll);
 
    // Typing effect
    const roles = ['MERN Stack Developer', 'Full-Stack Engineer', 'React Developer', 'Node.js Builder'];
    const typingEl = typingRef.current;
    let roleIdx = 0, charIdx = 0, deleting = false;
    let typeTimeout;
    
    const typeLoop = () => {
      if (!typingEl) return;
      const current = roles[roleIdx];
      if (!deleting) {
        typingEl.textContent = current.slice(0, ++charIdx);
        if (charIdx === current.length) { 
          deleting = true; 
          typeTimeout = setTimeout(typeLoop, 2400); 
          return;
        }
      } else {
        typingEl.textContent = current.slice(0, --charIdx);
        if (charIdx === 0) { 
          deleting = false; 
          roleIdx = (roleIdx + 1) % roles.length; 
        }
      }
      typeTimeout = setTimeout(typeLoop, deleting ? 40 : 80);
    };
    typeTimeout = setTimeout(typeLoop, 1200);
 
    return () => {
      document.body.classList.remove('custom-cursor-active');
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animId);
      clearTimeout(typeTimeout);
    };
  }, []);

  useEffect(() => {
    // Re-run hover and reveal logic when projects load
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    
    const hoverElements = document.querySelectorAll('a, button, .project-card, .stat, .skill-tag');
    let mx = 0, my = 0; // fallback if needed, but the actual cursor position comes from the other effect's closure.
    // Wait, the hover effect relies on the cursor scaling up, but doesn't strictly need mx/my here
    // because it just adds scale(1.5). Actually, the transform gets overridden if we just use scale.
    // But since the animCursor runs 60fps, it handles the translate.
    // The previous code appended `scale(1.5)` to the transform string! 
    // We can just add/remove a class for scaling the cursor instead, which is cleaner, 
    // OR we just use a state/ref to track if hovering, but the original logic just modified ring style.
    
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

    // Reveal on scroll
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
      {/* Custom Cursor */}
      <div className="cursor" id="cursor" ref={cursorRef}></div>
      <div className="cursor-ring" id="cursorRing" ref={ringRef}></div>

      {/* NAV */}
      <nav id="nav">
        <div className="nav-logo">
          <span>~/</span>poovendran<span>.dev</span>
        </div>
        <ul className="nav-links">
          <li><a href="#about">about</a></li>
          <li><a href="#skills">skills</a></li>
          <li><a href="#projects">projects</a></li>
          <li><a href="#experience">experience</a></li>
          <li><a href="#contact">contact</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <section id="hero">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="hero-inner">
          <div className="hero-text">
            <div className="hero-eyebrow">Open to internships &amp; opportunities</div>
            <h1 className="hero-name">
              <div>Poovendran</div>
              <div className="line-2">Kalimuthu.</div>
            </h1>
            <div className="hero-title">
              <span className="typing" ref={typingRef}>MERN Stack Developer</span>
            </div>
            <p className="hero-desc">
              Electronics and Communication Engineering student passionate about building full-stack web applications
              with the MERN stack. I turn ideas into real, working products — from REST APIs
              and MongoDB schemas to responsive React frontends. Always learning, always shipping.
            </p>
            <div className="hero-cta">
              <a href="#projects" className="btn btn-primary">View Work</a>
              <a href="#contact" className="btn btn-ghost">Get in Touch</a>
            </div>
          </div>
          <div className="hero-photo-wrap">
            <div className="hero-photo-frame">
              <img
                className="hero-photo"
                src="data:image/webp;base64,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"
                alt="Poovendran Kalimuthu"
                width="240"
                height="260"
                decoding="async"
              />
              <div className="hero-photo-overlay"></div>
            </div>
            <div className="hero-photo-badge">Open to work</div>
          </div>
        </div>
        <div className="hero-scroll">
          <span className="scroll-text">scroll</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="section-header reveal">
          <span className="section-num">01</span>
          <h2 className="section-title">About</h2>
          <div className="section-line"></div>
        </div>
        <div className="about-grid">
          <div className="about-text reveal">
            <p>
              I'm <strong>Poovendran Kalimuthu</strong>, a Electronics student who has
              mastered full-stack web development with the <strong>MERN stack</strong> — MongoDB,
              Express.js, React, and Node.js. I enjoy solving real-world problems through clean,
              maintainable code and thoughtful UI design.
            </p>
            <p>
              I've built projects ranging from <strong>location-aware attendance systems</strong>
              using GPS geo-tagging to full-featured <strong>ERP and event management platforms</strong>.
              Each project has sharpened my skills in REST API design, database modelling, and
              building intuitive user interfaces.
            </p>
            <p>
              I'm actively looking for opportunities where I can contribute, grow, and work on
              products that make a real difference. I care about <strong>clean code, good UX,
              and building things that actually work</strong>.
            </p>
          </div>
          <div className="about-stats reveal">
            <div className="stat">
              <div className="stat-num">MERN</div>
              <div className="stat-label">Core Stack</div>
            </div>
            <div className="stat">
              <div className="stat-num">{projects.length || '3+'}</div>
              <div className="stat-label">Projects Built</div>
            </div>
            <div className="stat">
              <div className="stat-num">ECE</div>
              <div className="stat-label">Student</div>
            </div>
            <div className="stat">
              <div className="stat-num">∞</div>
              <div className="stat-label">Curiosity</div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills">
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div className="section-header reveal">
            <span className="section-num">02</span>
            <h2 className="section-title">Skills</h2>
            <div className="section-line"></div>
          </div>
          <div className="skills-grid reveal">
            <div className="skill-cat">
              <div className="skill-cat-title">Languages</div>
              <div className="skill-tags">
                <span className="skill-tag">JavaScript</span>
                <span className="skill-tag">TypeScript</span>
                <span className="skill-tag">HTML5</span>
                <span className="skill-tag">CSS3</span>
                <span className="skill-tag">Python</span>
              </div>
            </div>
            <div className="skill-cat">
              <div className="skill-cat-title">Frontend</div>
              <div className="skill-tags">
                <span className="skill-tag">React.js</span>
                <span className="skill-tag">Redux</span>
                <span className="skill-tag">Tailwind CSS</span>
                <span className="skill-tag">Bootstrap</span>
                <span className="skill-tag">REST APIs</span>
              </div>
            </div>
            <div className="skill-cat">
              <div className="skill-cat-title">Backend</div>
              <div className="skill-tags">
                <span className="skill-tag">Node.js</span>
                <span className="skill-tag">Express.js</span>
                <span className="skill-tag">JWT Auth</span>
                <span className="skill-tag">Bcrypt</span>
                <span className="skill-tag">Mongoose</span>
              </div>
            </div>
            <div className="skill-cat">
              <div className="skill-cat-title">Database &amp; Tools</div>
              <div className="skill-tags">
                <span className="skill-tag">MongoDB</span>
                <span className="skill-tag">MySQL</span>
                <span className="skill-tag">Git &amp; GitHub</span>
                <span className="skill-tag">Postman</span>
                <span className="skill-tag">VS Code</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects">
        <div className="section-header reveal">
          <span className="section-num">03</span>
          <h2 className="section-title">Projects</h2>
          <div className="section-line"></div>
        </div>
        <div className="projects-grid">
          {isLoading ? (
            <div className="cyber-loader-container" style={{ gridColumn: '1 / -1', minHeight: '220px' }}>
              <div className="cyber-spinner">
                <div className="cyber-pulse-core"></div>
              </div>
              <div className="cyber-loader-text">Loading secure database...</div>
            </div>
          ) : (
            projects.slice(0, 3).map((project, index) => (
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
            ))
          )}
          {!isLoading && projects.length === 0 && (
             <div className="project-card reveal">
               <p className="project-desc">No projects found. Add some from the admin panel.</p>
             </div>
          )}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '60px' }}>
          <Link to="/projects" className="btn btn-ghost" style={{ textDecoration: 'none' }}>
            Explore Full Archive
          </Link>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience">
        <div className="section-header reveal">
          <span className="section-num">04</span>
          <h2 className="section-title">Education &amp; Journey</h2>
          <div className="section-line"></div>
        </div>
        <div className="exp-list">
          <div className="exp-item reveal">
            <div className="exp-meta">
              <div className="exp-period">2024 — 2028</div>
              <div className="exp-company">Dr. MCET, Pollachi</div>
            </div>
            <div className="exp-content">
              <div className="exp-role">B.E. / B.Tech — Electronics and Communication Engineering</div>
              <p className="exp-desc">
                Pursuing a degree in Electronics and Communication Engineering with a strong focus on software engineering,
                data structures, algorithms, and web technologies. Consistently applied classroom
                knowledge to real-world projects, building a solid foundation in both theory and practice.
              </p>
              <div className="exp-tags">
                <span className="exp-tag">Data Structures</span>
                <span className="exp-tag">Algorithms</span>
                <span className="exp-tag">DBMS</span>
                <span className="exp-tag">OS</span>
                <span className="exp-tag">Networking</span>
              </div>
            </div>
          </div>

          <div className="exp-item reveal">
            <div className="exp-meta">
              <div className="exp-period">2024 — Present</div>
              <div className="exp-company">Self-directed Learning</div>
            </div>
            <div className="exp-content">
              <div className="exp-role">Full-Stack MERN Developer</div>
              <p className="exp-desc">
                Mastered the full MERN stack through intensive self-study and hands-on project
                building. Designed and shipped three complete full-stack applications — covering
                REST API design, authentication, database modelling, and responsive React UIs —
                independently from concept to deployment.
              </p>
              <div className="exp-tags">
                <span className="exp-tag">MongoDB</span>
                <span className="exp-tag">Express.js</span>
                <span className="exp-tag">React.js</span>
                <span className="exp-tag">Node.js</span>
                <span className="exp-tag">JWT</span>
                <span className="exp-tag">REST APIs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="reveal">
          <div className="contact-big">
            Let's build<br />something <span className="accent">great.</span>
          </div>
          <p className="contact-sub">
            Open to full-time roles, contract work, and interesting open-source collaborations.<br />
            The best ideas usually start with a simple hello.
          </p>
          
          {!showConnections ? (
            <button onClick={() => setShowConnections(true)} className="btn-connect">
              <Share2 size={16} className="share-icon-pulse" />
              Connect
            </button>
          ) : (
            <div className="connections-fade-in">
              <a href="mailto:poovendranhari@gmail.com" className="contact-email">
                <Mail size={16} style={{ color: 'var(--accent)' }} />
                poovendranhari@gmail.com
              </a>
              <div className="social-links" style={{ marginBottom: '40px' }}>
                <a href="https://github.com/poovendran-kalimuthu" target="_blank" rel="noreferrer" className="social-link">
                  <Github size={14} />
                  GitHub
                </a>
                <a href="#" className="social-link">
                  <Linkedin size={14} />
                  LinkedIn
                </a>
                <a href="https://wa.me/919943444007" target="_blank" rel="noreferrer" className="social-link">
                  <Whatsapp size={14} />
                  WhatsApp
                </a>
                <a href="#" className="social-link">
                  <BookOpen size={14} />
                  Blog
                </a>
              </div>

              {/* ── IN-APP DIRECT COMMUNICATION FORM ── */}
              <div className="cyber-chat-box">
                <div className="chat-header">
                  <div className="chat-status-dot"></div>
                  <span className="chat-title">Direct In-App Communication Channel</span>
                </div>
                <form onSubmit={handleMsgSubmit} className="chat-form">
                  <div className="chat-input-row">
                    <input 
                      type="text" 
                      placeholder="Your Name" 
                      value={msgFormData.name}
                      onChange={(e) => setMsgFormData({...msgFormData, name: e.target.value})}
                      required
                      className="chat-input"
                    />
                    <input 
                      type="email" 
                      placeholder="Your Email" 
                      value={msgFormData.email}
                      onChange={(e) => setMsgFormData({...msgFormData, email: e.target.value})}
                      required
                      className="chat-input"
                    />
                  </div>
                  <textarea 
                    placeholder="Type your secure transmission here..." 
                    value={msgFormData.message}
                    onChange={(e) => setMsgFormData({...msgFormData, message: e.target.value})}
                    required
                    rows="3"
                    className="chat-textarea"
                  ></textarea>

                  <div className="chat-action-bar">
                    {msgError && <span className="chat-error">{msgError}</span>}
                    {msgSuccess && <span className="chat-success">✓ Secure Transmission Success!</span>}
                    
                    <button type="submit" disabled={msgSending} className="chat-send-btn">
                      {msgSending ? (
                        <>
                          <div className="btn-loader"></div>
                          Transmitting...
                        </>
                      ) : (
                        <>
                          <Send size={12} />
                          Transmit Message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <span>© 2025 Poovendran Kalimuthu. Built with intention.</span>
        <span>
          Designed &amp; coded from scratch.
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

export default Portfolio;
