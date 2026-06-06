import { useState, useEffect, useRef, useCallback } from "react";

// ── Design tokens ─────────────────────────────────────────────
const COLORS = {
  dark: {
    bg:       "#0a0a0f",
    surface:  "#111118",
    card:     "#16161f",
    border:   "#2a2a3a",
    accent:   "#6c63ff",
    accent2:  "#ff6584",
    text:     "#f0f0f5",
    muted:    "#8888a0",
    code:     "#1a1a28",
  },
  light: {
    bg:       "#f8f8fc",
    surface:  "#ffffff",
    card:     "#f2f2f8",
    border:   "#e0e0ee",
    accent:   "#5b52f0",
    accent2:  "#e8436f",
    text:     "#1a1a2e",
    muted:    "#666688",
    code:     "#eeeef8",
  }
};


// ── Mock data (replace with API calls in production) ──────────
const SKILLS = [
  { name: "HTML/CSS",    level: 95, category: "frontend", icon: "🌐" },
  { name: "JavaScript", level: 90, category: "frontend", icon: "⚡" },
  { name: "React.js",   level: 88, category: "frontend", icon: "⚛️" },
  { name: "Node.js",    level: 82, category: "backend",  icon: "🟢" },
  { name: "Express.js", level: 80, category: "backend",  icon: "🚂" },
  { name: "MongoDB",    level: 75, category: "backend",  icon: "🍃" },
  { name: "Python",     level: 78, category: "other",    icon: "🐍" },
  { name: "Java",       level: 70, category: "other",    icon: "☕" },
  { name: "Git/GitHub", level: 88, category: "tools",    icon: "🔧" },
  { name: "TypeScript", level: 65, category: "frontend", icon: "📘" },
];

const SAMPLE_PROJECTS = [
  {
    _id: "1", title: "E-Commerce Platform", featured: true,
    description: "Full-stack e-commerce app with React, Node.js & MongoDB. Features cart, Stripe payments, and a complete admin dashboard for inventory management.",
    technologies: ["React","Node.js","MongoDB","Express","Stripe"],
    githubLink: "https://github.com", liveLink: "https://vercel.app",
    category: "web", imageUrl: null,
  },
  {
    _id: "2", title: "AI Chat Application", featured: true,
    description: "Real-time chat app with OpenAI GPT-4 integration, Socket.io for live messaging, JWT auth, and persistent conversation history.",
    technologies: ["React","Node.js","Socket.io","OpenAI","Redis"],
    githubLink: "https://github.com", liveLink: "",
    category: "web", imageUrl: null,
  },
  {
    _id: "3", title: "ML Dashboard",  featured: false,
    description: "Interactive analytics dashboard built with Python Flask, Chart.js and pandas for real-time data visualization and model monitoring.",
    technologies: ["Python","Flask","Chart.js","pandas","scikit-learn"],
    githubLink: "https://github.com", liveLink: "",
    category: "ml", imageUrl: null,
  },
  {
    _id: "4", title: "Task Manager App", featured: false,
    description: "Productivity app with drag-and-drop boards, priority labels, due dates, and team collaboration features. Mobile responsive.",
    technologies: ["React","TypeScript","Node.js","PostgreSQL"],
    githubLink: "https://github.com", liveLink: "https://vercel.app",
    category: "web", imageUrl: null,
  },
  {
    _id: "5",title: "JARVIS AI Assistant",featured: false,
    description:"Voice-enabled AI assistant with smart automation features like speech recognition, task execution, and conversational AI responses. Built with Python and web integration concepts.",
    technologies: ["Python", "AI", "Speech Recognition", "Automation"],
    githubLink: "https://github.com",liveLink: "",
    category: "ai",imageUrl: null,
  },
  {
    _id: "6",title: "Coin Buzz",featured:false,
    description:"Crypto tracking and information app that displays real-time coin prices, trends, and market updates using API integration.",
    technologies: ["React", "API", "JavaScript", "Crypto"],
    githubLink: "https://github.com",liveLink: "",
    category: "web",imageUrl: null,
  },
{
  _id: "7",title: "Smart Expense Tracker App",featured: true,
  description:"A mobile-friendly expense tracking application that helps users manage daily expenses, set budgets, and visualize spending patterns using charts and analytics.",
  technologies: ["React Native", "JavaScript", "Charts API", "Async Storage"],
  githubLink: "https://github.com",liveLink: "",
  category: "mobile",imageUrl: null,
},
{
  _id: "8",title: "Smart Light Intensity Monitoring System",featured: false,
  description:"IoT-based system that measures ambient light intensity using LDR sensor and automatically controls smart lights based on environmental brightness. Helps in energy saving and smart automation.",
  technologies: ["IoT", "Arduino", "LDR Sensor", "Node.js", "Automation"],
  githubLink: "https://github.com",liveLink: "",
  category: "other",imageUrl: null,
},
{
  _id: "9",title: "CIVIX Scheme Information System",featured: true,
  description:"A civic information platform that provides details about government schemes, eligibility criteria, and application procedures. Helps citizens easily access and understand public welfare programs.",
  technologies: ["React", "Node.js", "MongoDB", "API Integration"],
  githubLink: "https://github.com",liveLink: "",
  category: "web",imageUrl: null,
}

];

const SAMPLE_CERTS = [
  { _id:"1", title:"AWS Cloud Practitioner", organization:"Amazon Web Services", date:"2024-01-15", credentialUrl:"#" },
  { _id:"2", title:"Meta Front-End Developer", organization:"Meta / Coursera", date:"2023-09-01", credentialUrl:"#" },
  { _id:"3", title:"MongoDB Developer", organization:"MongoDB University", date:"2023-06-10", credentialUrl:"#" },
  { _id:"4", title:"React Professional", organization:"Scrimba / Meta", date:"2024-03-20", credentialUrl:"#" },
];

const SOCIALS = [
  { name:"GitHub",   url:"https://github.com",   icon:"◉" },
  { name:"LinkedIn", url:"https://linkedin.com",  icon:"in" },
  { name:"Twitter",  url:"https://twitter.com",   icon:"𝕏" },
  { name:"Email",    url:"mailto:you@example.com",icon:"@" },
];

// ── Hooks ─────────────────────────────────────────────────────
function useDark() {
  const [dark, setDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  return [dark, () => setDark(d => !d)];
}

function useTypewriter(words, speed = 90) {
  const [text, setText] = useState("");
  const [wi, setWi]     = useState(0);
  const [ci, setCi]     = useState(0);
  const [del, setDel]   = useState(false);
  useEffect(() => {
    const word = words[wi % words.length];
    const timeout = setTimeout(() => {
      if (!del) {
        setText(word.slice(0, ci + 1));
        if (ci + 1 === word.length) { setTimeout(() => setDel(true), 1400); }
        else setCi(c => c + 1);
      } else {
        setText(word.slice(0, ci - 1));
        if (ci - 1 === 0) { setDel(false); setWi(w => w + 1); setCi(0); }
        else setCi(c => c - 1);
      }
    }, del ? speed / 2.5 : speed);
    return () => clearTimeout(timeout);
  }, [text, ci, del, wi, words, speed]);
  return text;
}

function useInView(ref) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
}

// ── API helper ────────────────────────────────────────────────
const API_BASE = "http://localhost:5000/api";
async function api(path, opts = {}) {
  const token = localStorage.getItem("portfolio_token");
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...opts.headers },
    ...opts,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// ── Color util ────────────────────────────────────────────────
const techColor = (t) => {
  const map = { React:"#61dafb", "Node.js":"#68a063", MongoDB:"#47a248", Python:"#3572A5",
    JavaScript:"#f7df1e", TypeScript:"#3178c6", Express:"#888", Java:"#b07219",
    "Socket.io":"#010101", Flask:"#e0d5c5", Redis:"#dc382d", Stripe:"#6772e5", pandas:"#150458" };
  return map[t] || "#6c63ff";
};

const catGrad = (cat) => {
  const map = { web:"135deg,#6c63ff,#5b52f0", ml:"135deg,#ff6584,#e84393",
    mobile:"135deg,#43e97b,#38f9d7", other:"135deg,#f7971e,#ffd200" };
  return map[cat] || map.web;
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

function Navbar({ page, setPage, dark, toggleDark }) {
  const C = COLORS[dark ? "dark" : "light"];
  const [menuOpen, setMenuOpen] = useState(false);
  const links = ["home","about","skills","projects","certifications","contact"];

  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:1000,
      background:`${C.surface}ee`, backdropFilter:"blur(16px)",
      borderBottom:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px",
        display:"flex", alignItems:"center", justifyContent:"space-between", height:64 }}>
        <div onClick={() => setPage("home")}
          style={{ fontFamily:"'Courier New',monospace", fontWeight:700, fontSize:22,
            cursor:"pointer", background:`linear-gradient(90deg,${C.accent},${C.accent2})`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          &lt;Dev/&gt;
        </div>

        {/* Desktop links */}
        <div style={{ display:"flex", gap:4, alignItems:"center" }} className="desktop-nav">
          {links.map(l => (
            <button key={l} onClick={() => setPage(l)}
              style={{ background:"none", border:"none", cursor:"pointer",
                padding:"6px 14px", borderRadius:8, fontSize:14, fontWeight:500,
                color: page === l ? C.accent : C.muted,
                borderBottom: page === l ? `2px solid ${C.accent}` : "2px solid transparent",
                transition:"all 0.2s" }}>
              {l.charAt(0).toUpperCase() + l.slice(1)}
            </button>
          ))}
          <button onClick={toggleDark}
            style={{ background:C.card, border:`1px solid ${C.border}`, cursor:"pointer",
              padding:"6px 12px", borderRadius:8, fontSize:18, marginLeft:8, lineHeight:1 }}>
            {dark ? "☀️" : "🌙"}
          </button>
          <button onClick={() => setPage("admin")}
            style={{ background:`linear-gradient(135deg,${C.accent},${C.accent2})`,
              border:"none", cursor:"pointer", padding:"7px 18px", borderRadius:8,
              color:"#fff", fontSize:13, fontWeight:600, marginLeft:4 }}>
            Admin
          </button>
        </div>

        {/* Hamburger */}
        <button onClick={() => setMenuOpen(m => !m)}
          style={{ display:"none", background:"none", border:"none", cursor:"pointer",
            fontSize:24, color:C.text }} className="hamburger">
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background:C.surface, padding:"12px 24px 20px",
          borderTop:`1px solid ${C.border}` }}>
          {links.map(l => (
            <button key={l} onClick={() => { setPage(l); setMenuOpen(false); }}
              style={{ display:"block", width:"100%", textAlign:"left", background:"none",
                border:"none", cursor:"pointer", padding:"10px 0", fontSize:15,
                color: page === l ? C.accent : C.text, fontWeight: page === l ? 600 : 400 }}>
              {l.charAt(0).toUpperCase() + l.slice(1)}
            </button>
          ))}
          <div style={{ display:"flex", gap:8, marginTop:8 }}>
            <button onClick={toggleDark}
              style={{ background:C.card, border:`1px solid ${C.border}`, cursor:"pointer",
                padding:"7px 14px", borderRadius:8, fontSize:16 }}>
              {dark ? "☀️" : "🌙"}
            </button>
            <button onClick={() => { setPage("admin"); setMenuOpen(false); }}
              style={{ background:`linear-gradient(135deg,${C.accent},${C.accent2})`,
                border:"none", cursor:"pointer", padding:"7px 18px", borderRadius:8,
                color:"#fff", fontSize:13, fontWeight:600 }}>
              Admin Panel
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) { .desktop-nav { display: none !important; } .hamburger { display: block !important; } }
        @media (min-width: 769px) { .hamburger { display: none !important; } }
      `}</style>
    </nav>
  );
}

// ── Animated section wrapper ──────────────────────────────────
function Section({ children, style = {} }) {
  const ref = useRef();
  const inView = useInView(ref);
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(32px)",
      transition: "opacity 0.7s ease, transform 0.7s ease", ...style }}>
      {children}
    </div>
  );
}

// ── Skill progress bar ────────────────────────────────────────
function SkillBar({ skill, dark, delay = 0 }) {
  const C   = COLORS[dark ? "dark" : "light"];
  const ref = useRef();
  const inV = useInView(ref);
  return (
    <div ref={ref} style={{ marginBottom:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
        <span style={{ fontSize:14, color:C.text, fontWeight:500 }}>
          {skill.icon} {skill.name}
        </span>
        <span style={{ fontSize:13, color:C.muted }}>{skill.level}%</span>
      </div>
      <div style={{ background:C.border, borderRadius:99, height:8, overflow:"hidden" }}>
        <div style={{
          width: inV ? `${skill.level}%` : "0%", height:"100%", borderRadius:99,
          background:`linear-gradient(90deg,${C.accent},${C.accent2})`,
          transition: `width 1.2s ease ${delay}ms`
        }} />
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// PAGE: HOME
// ════════════════════════════════════════════════════════════════
function HomePage({ dark, setPage }) {
  const C    = COLORS[dark ? "dark" : "light"];
  const role = useTypewriter(["Web Developer","Full-Stack Engineer","React Specialist","CS Student","Problem Solver"]);

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center",
      justifyContent:"center", padding:"100px 24px 60px" }}>
      <div style={{ maxWidth:900, width:"100%", textAlign:"center" }}>

        {/* Avatar */}
        <Section>
          <div style={{ position:"relative", display:"inline-block", marginBottom:32 }}>
            <div style={{
              width:160, height:160, borderRadius:"50%", margin:"0 auto",
              background:`linear-gradient(135deg,${C.accent},${C.accent2})`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:72, boxShadow:`0 0 60px ${C.accent}44`, border:`4px solid ${C.surface}` }}>
              👨‍💻
            </div>
            <div style={{
              position:"absolute", bottom:8, right:8,
              width:20, height:20, borderRadius:"50%",
              background:"#44ff88", border:`3px solid ${C.surface}` }} />
          </div>
        </Section>

        {/* Name */}
        <Section style={{ transitionDelay:"100ms" }}>
          <div style={{ fontSize:14, letterSpacing:4, color:C.accent, fontWeight:600,
            textTransform:"uppercase", marginBottom:12 }}>Hello, World! 👋</div>
          <h1 style={{ fontSize:"clamp(36px,6vw,72px)", fontWeight:800, lineHeight:1.1,
            color:C.text, margin:"0 0 16px",
            fontFamily:"'Georgia',serif" }}>
            Alfiya Fathima
          </h1>
          <div style={{ fontSize:"clamp(20px,3vw,32px)", color:C.muted, marginBottom:24,
            fontFamily:"'Courier New',monospace", minHeight:44 }}>
            <span style={{ color:C.accent2 }}>I&nbsp;</span>
            <span style={{ color:C.accent }}>{role}</span>
            <span style={{ animation:"blink 1s step-end infinite", color:C.accent }}>|</span>
          </div>
          <p style={{ fontSize:17, color:C.muted, maxWidth:560, margin:"0 auto 40px",
            lineHeight:1.8 }}>
            Passionate CSE student & aspiring web developer building modern,
            scalable web applications. I turn ideas into digital experiences.
          </p>
        </Section>

        {/* CTAs */}
        <Section style={{ transitionDelay:"200ms" }}>
          <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap", marginBottom:40 }}>
            <button onClick={() => setPage("projects")}
              style={{ background:`linear-gradient(135deg,${C.accent},${C.accent2})`,
                border:"none", cursor:"pointer", padding:"14px 36px", borderRadius:12,
                color:"#fff", fontSize:16, fontWeight:700,
                boxShadow:`0 8px 32px ${C.accent}44`, transition:"transform 0.2s" }}
              onMouseOver={e => e.target.style.transform = "scale(1.04)"}
              onMouseOut={e => e.target.style.transform = "scale(1)"}>
              View My Work ✨
            </button>
            <a href="#" download
              style={{ background:"none", border:`2px solid ${C.border}`,
                cursor:"pointer", padding:"13px 36px", borderRadius:12,
                color:C.text, fontSize:16, fontWeight:600, textDecoration:"none",
                display:"inline-flex", alignItems:"center", gap:8, transition:"all 0.2s",
                backdropFilter:"blur(8px)" }}
              onMouseOver={e => { e.target.style.borderColor = C.accent; e.target.style.color = C.accent; }}
              onMouseOut={e => { e.target.style.borderColor = C.border; e.target.style.color = C.text; }}>
              📄 Download Resume
            </a>
          </div>

          {/* Socials */}
          <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
            {SOCIALS.map(s => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                style={{ width:44, height:44, borderRadius:10, display:"flex",
                  alignItems:"center", justifyContent:"center",
                  background:C.card, border:`1px solid ${C.border}`,
                  color:C.muted, fontSize:16, fontWeight:700, textDecoration:"none",
                  transition:"all 0.2s" }}
                onMouseOver={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent; e.currentTarget.style.background = `${C.accent}18`; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; e.currentTarget.style.background = C.card; }}>
                {s.icon}
              </a>
            ))}
          </div>
        </Section>

        {/* Stats */}
        <Section style={{ transitionDelay:"300ms", marginTop:60 }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",
            gap:16, maxWidth:600, margin:"0 auto" }}>
            {[
              { label:"Projects Built",  value:"15+" },
              { label:"Technologies",    value:"10+" },
              { label:"GitHub Commits",  value:"500+" },
              { label:"Certifications",  value:"6" },
            ].map(s => (
              <div key={s.label} style={{ background:C.card, border:`1px solid ${C.border}`,
                borderRadius:16, padding:"20px 16px", textAlign:"center" }}>
                <div style={{ fontSize:28, fontWeight:800, color:C.accent }}>{s.value}</div>
                <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </Section>
      </div>
      <style>{`@keyframes blink { 0%,100% { opacity:1 } 50% { opacity:0 } }`}</style>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// PAGE: ABOUT
// ════════════════════════════════════════════════════════════════
function AboutPage({ dark }) {
  const C = COLORS[dark ? "dark" : "light"];
  const hobbies = ["💻 Coding","📖 Reading","🎮 Gaming","🎵 Music","✈️ Travelling","📷 Photography"];

  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:"100px 24px 80px" }}>
      <Section>
        <h1 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:800, color:C.text,
          marginBottom:8, textAlign:"center" }}>About <span style={{ color:C.accent }}>Me</span></h1>
        <p style={{ textAlign:"center", color:C.muted, marginBottom:56, fontSize:16 }}>
          Get to know me better
        </p>
      </Section>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:32 }}>
        {/* Personal info card */}
        <Section>
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:20, padding:32 }}>
            <div style={{ textAlign:"center", marginBottom:24 }}>
              <div style={{ width:100, height:100, borderRadius:"50%", margin:"0 auto 16px",
                background:`linear-gradient(135deg,${C.accent},${C.accent2})`,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:48 }}>
                👨‍💻
              </div>
              <h2 style={{ color:C.text, margin:"0 0 4px", fontSize:20 }}>Alfiya Fathima</h2>
              <p style={{ color:C.accent, margin:0, fontSize:13 }}>CSE Student & Web Developer</p>
            </div>
            <div style={{ display:"grid", gap:12 }}>
              {[
                ["🎂", "Date of Birth", "November 2, 2005"],
                ["📍", "Location", "Chennai, Tamil Nadu"],
                ["🎓", "Degree", "B.E Computer Science"],
                ["🏫", "University", "Anand Institute Of Higher Technology"],
                ["💼", "Available", "Internship / Freelance"],
                ["📧", "Email", "alfiyafathima2115@email.com"],
              ].map(([ic, k, v]) => (
                <div key={k} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <span style={{ fontSize:16 }}>{ic}</span>
                  <div>
                    <div style={{ fontSize:12, color:C.muted }}>{k}</div>
                    <div style={{ fontSize:14, color:C.text, fontWeight:500 }}>{v}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Bio + education */}
        <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
          <Section>
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:20, padding:28 }}>
              <h3 style={{ color:C.accent, marginBottom:16, fontSize:18, fontWeight:700 }}>👋 Who I Am</h3>
              <p style={{ color:C.muted, lineHeight:1.8, margin:0, fontSize:15 }}>
                I'm a passionate Computer Science Engineering student with a deep love for
                web development and problem-solving. I enjoy building things that live on the internet
                — from interactive UIs to scalable backend systems.
              </p>
              <p style={{ color:C.muted, lineHeight:1.8, margin:"12px 0 0", fontSize:15 }}>
                My goal is to create elegant, efficient, and user-friendly applications
                that make a real-world impact. I'm always learning and staying up-to-date
                with the latest technologies.
              </p>
            </div>
          </Section>

          <Section>
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:20, padding:28 }}>
              <h3 style={{ color:C.accent, marginBottom:16, fontSize:18, fontWeight:700 }}>🎓 Education</h3>
              {[
                { degree:"B.E — Computer Science & Engineering", school:"Anand Institute Of Higher Technology", period:"2023 – 2027", grade:"CGPA: 8.5/10", icon:"🏛️" },
                { degree:"Class XII — State Board", school:"Buvana Krishnan Matriculation Higher Secondary School", period:"2022 – 2023", grade:"80.8%", icon:"🏫" },
              ].map(e => (
                <div key={e.degree} style={{ display:"flex", gap:16, marginBottom:16,
                  padding:16, background:C.bg, borderRadius:12,
                  border:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:28 }}>{e.icon}</div>
                  <div>
                    <div style={{ color:C.text, fontWeight:600, fontSize:14 }}>{e.degree}</div>
                    <div style={{ color:C.muted, fontSize:13 }}>{e.school}</div>
                    <div style={{ display:"flex", gap:12, marginTop:4 }}>
                      <span style={{ fontSize:12, color:C.accent }}>{e.period}</span>
                      <span style={{ fontSize:12, color:C.accent2, fontWeight:600 }}>{e.grade}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section>
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:20, padding:28 }}>
              <h3 style={{ color:C.accent, marginBottom:16, fontSize:18, fontWeight:700 }}>🎯 Interests</h3>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {hobbies.map(h => (
                  <span key={h} style={{ background:`${C.accent}18`, color:C.accent,
                    padding:"6px 14px", borderRadius:99, fontSize:13, fontWeight:500 }}>
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// PAGE: SKILLS
// ════════════════════════════════════════════════════════════════
function SkillsPage({ dark }) {
  const C   = COLORS[dark ? "dark" : "light"];
  const [tab, setTab] = useState("all");
  const tabs = ["all","frontend","backend","tools","other"];
  const filtered = tab === "all" ? SKILLS : SKILLS.filter(s => s.category === tab);

  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:"100px 24px 80px" }}>
      <Section>
        <h1 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:800, color:C.text,
          marginBottom:8, textAlign:"center" }}>My <span style={{ color:C.accent }}>Skills</span></h1>
        <p style={{ textAlign:"center", color:C.muted, marginBottom:40, fontSize:16 }}>
          Technologies I work with
        </p>
        <div style={{ display:"flex", justifyContent:"center", gap:8, flexWrap:"wrap", marginBottom:48 }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding:"8px 20px", borderRadius:99, border:"none",
                cursor:"pointer", fontSize:13, fontWeight:600, transition:"all 0.2s",
                background: tab === t ? `linear-gradient(135deg,${C.accent},${C.accent2})` : C.card,
                color: tab === t ? "#fff" : C.muted,
                boxShadow: tab === t ? `0 4px 16px ${C.accent}44` : "none" }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </Section>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:32 }}>
        {/* Progress bars */}
        <Section>
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:20, padding:28 }}>
            <h3 style={{ color:C.text, marginBottom:24, fontSize:16, fontWeight:700 }}>Proficiency Levels</h3>
            {filtered.map((s, i) => <SkillBar key={s.name} skill={s} dark={dark} delay={i * 80} />)}
          </div>
        </Section>

        {/* Cards grid */}
        <div>
          <Section>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))", gap:12, marginBottom:24 }}>
              {filtered.map((s, i) => (
                <div key={s.name}
                  style={{ background:C.card, border:`1px solid ${C.border}`,
                    borderRadius:16, padding:"20px 12px", textAlign:"center",
                    transition:"all 0.25s", cursor:"default",
                    animation:`fadeUp 0.4s ease ${i * 60}ms both` }}
                  onMouseOver={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.boxShadow = `0 8px 32px ${C.accent}22`; }}
                  onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = ""; }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>{s.icon}</div>
                  <div style={{ fontSize:12, color:C.text, fontWeight:600, marginBottom:4 }}>{s.name}</div>
                  <div style={{ fontSize:11, color:C.accent, fontWeight:700 }}>{s.level}%</div>
                  <div style={{ height:3, borderRadius:99, background:C.border, marginTop:8 }}>
                    <div style={{ height:"100%", borderRadius:99, width:`${s.level}%`,
                      background:`linear-gradient(90deg,${C.accent},${C.accent2})` }} />
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section>
            <div style={{ background:`linear-gradient(135deg,${C.accent}18,${C.accent2}18)`,
              border:`1px solid ${C.accent}33`, borderRadius:20, padding:24 }}>
              <h3 style={{ color:C.text, marginBottom:12, fontSize:15, fontWeight:700 }}>🚀 Currently Learning</h3>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {["Next.js","Docker","AWS","GraphQL","Rust","Three.js"].map(t => (
                  <span key={t} style={{ background:`${C.accent2}22`, color:C.accent2,
                    padding:"4px 12px", borderRadius:99, fontSize:12, fontWeight:600 }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Section>
        </div>
      </div>
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:none } }`}</style>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// PAGE: PROJECTS
// ════════════════════════════════════════════════════════════════
function ProjectsPage({ dark }) {
  const C = COLORS[dark ? "dark" : "light"];
  const [projects, setProjects] = useState(SAMPLE_PROJECTS);
  const [search, setSearch]   = useState("");
  const [cat, setCat]         = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api(`/projects?search=${search}&category=${cat === "all" ? "" : cat}`)
      .then(d => setProjects(d.projects))
      .catch(() => setProjects(SAMPLE_PROJECTS.filter(p =>
        (cat === "all" || p.category === cat) &&
        (p.title.toLowerCase().includes(search.toLowerCase()) ||
         p.description.toLowerCase().includes(search.toLowerCase()))
      )))
      .finally(() => setLoading(false));
  }, [search, cat]);

  const cats = ["all","web","ml","mobile","other"];

  return (
    <div style={{ maxWidth:1000, margin:"0 auto", padding:"100px 24px 80px" }}>
      <Section>
        <h1 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:800, color:C.text,
          marginBottom:8, textAlign:"center" }}>My <span style={{ color:C.accent }}>Projects</span></h1>
        <p style={{ textAlign:"center", color:C.muted, marginBottom:40, fontSize:16 }}>
          Things I've built
        </p>

        {/* Search + filter */}
        <div style={{ display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center", marginBottom:40 }}>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)",
              color:C.muted, fontSize:16 }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search projects..." 
              style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12,
                padding:"10px 16px 10px 36px", color:C.text, fontSize:14, width:260,
                outline:"none", transition:"border 0.2s" }}
              onFocus={e => e.target.style.borderColor = C.accent}
              onBlur={e => e.target.style.borderColor = C.border} />
          </div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {cats.map(c => (
              <button key={c} onClick={() => setCat(c)}
                style={{ padding:"9px 16px", borderRadius:99, border:"none", cursor:"pointer",
                  fontSize:12, fontWeight:600, transition:"all 0.2s",
                  background: cat === c ? `linear-gradient(135deg,${C.accent},${C.accent2})` : C.card,
                  color: cat === c ? "#fff" : C.muted }}>
                {c.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {loading ? (
        <div style={{ textAlign:"center", padding:80, color:C.muted }}>Loading...</div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:24 }}>
          {projects.map((p, i) => (
            <Section key={p._id}>
              <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:20,
                overflow:"hidden", transition:"all 0.3s", height:"100%",
                animation:`fadeUp 0.5s ease ${i * 80}ms both` }}
                onMouseOver={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 20px 60px ${C.accent}22`; e.currentTarget.style.borderColor = C.accent; }}
                onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; e.currentTarget.style.borderColor = C.border; }}>

                {/* Image / gradient header */}
                <div style={{ height:180, background:`linear-gradient(${catGrad(p.category)})`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  position:"relative", overflow:"hidden" }}>
                  {p.imageUrl
                    ? <img src={p.imageUrl} alt={p.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    : <div style={{ textAlign:"center" }}>
                        <div style={{ fontSize:48, marginBottom:8 }}>
                          {p.category === "web" ? "💻" : p.category === "ml" ? "🤖" : "📱"}
                        </div>
                        <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)", fontWeight:600 }}>
                          {p.category.toUpperCase()}
                        </div>
                      </div>
                  }
                  {p.featured && (
                    <div style={{ position:"absolute", top:12, right:12,
                      background:"rgba(255,255,255,0.2)", backdropFilter:"blur(8px)",
                      color:"#fff", fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:99 }}>
                      ⭐ Featured
                    </div>
                  )}
                </div>

                <div style={{ padding:24 }}>
                  <h3 style={{ color:C.text, margin:"0 0 10px", fontSize:17, fontWeight:700 }}>{p.title}</h3>
                  <p style={{ color:C.muted, fontSize:13, lineHeight:1.7, margin:"0 0 16px",
                    display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                    {p.description}
                  </p>

                  {/* Tech tags */}
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:20 }}>
                    {p.technologies.slice(0,5).map(t => (
                      <span key={t} style={{ fontSize:11, fontWeight:600, padding:"3px 10px",
                        borderRadius:99, background:`${techColor(t)}22`, color:techColor(t) }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div style={{ display:"flex", gap:10 }}>
                    {p.githubLink && (
                      <a href={p.githubLink} target="_blank" rel="noopener noreferrer"
                        style={{ flex:1, padding:"8px", borderRadius:10, textAlign:"center",
                          background:C.bg, border:`1px solid ${C.border}`,
                          color:C.text, textDecoration:"none", fontSize:12, fontWeight:600,
                          transition:"all 0.2s" }}
                        onMouseOver={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent; }}
                        onMouseOut={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text; }}>
                        ⌥ GitHub
                      </a>
                    )}
                    {p.liveLink && (
                      <a href={p.liveLink} target="_blank" rel="noopener noreferrer"
                        style={{ flex:1, padding:"8px", borderRadius:10, textAlign:"center",
                          background:`linear-gradient(135deg,${C.accent},${C.accent2})`,
                          color:"#fff", textDecoration:"none", fontSize:12, fontWeight:600 }}>
                        🚀 Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Section>
          ))}
        </div>
      )}
      {projects.length === 0 && !loading && (
        <div style={{ textAlign:"center", padding:80, color:C.muted }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
          <p>No projects found. Try a different search.</p>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// PAGE: CERTIFICATIONS
// ════════════════════════════════════════════════════════════════
function CertificationsPage({ dark }) {
  const C     = COLORS[dark ? "dark" : "light"];
  const [certs, setCerts] = useState([]);

  useEffect(() => {
  api("/certifications")
    .then(d => {
      console.log("API RESPONSE:", d);

      const data = d.certifications || d || [];
      setCerts(data);
    })
    .catch(err => {
      console.log("API ERROR:", err);
      setCerts([]); // fallback safe
    });
}, []);

  const orgColors = ["#6c63ff","#ff6584","#43e97b","#f7971e","#4facfe","#a18cd1"];

  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:"100px 24px 80px" }}>
      <Section>
        <h1 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:800, color:C.text,
          marginBottom:8, textAlign:"center" }}>
          <span style={{ color:C.accent }}>Certifications</span>
        </h1>
        <p style={{ textAlign:"center", color:C.muted, marginBottom:56, fontSize:16 }}>
          Verified credentials & achievements
        </p>
      </Section>

      <h3>Total Certificates: {certs.length}</h3>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:24 }}>
        {certs.map((c, i) => (
          <Section key={c._id}>
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:20,
              overflow:"hidden", transition:"all 0.3s", cursor:"default",
              animation:`fadeUp 0.4s ease ${i * 80}ms both` }}
              onMouseOver={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 16px 48px ${orgColors[i % orgColors.length]}22`; }}
              onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>

              {/* Color header */}
              <div style={{ height:6, background:orgColors[i % orgColors.length] }} />

              <div style={{ padding:24 }}>
                <div style={{ width:52, height:52, borderRadius:12, marginBottom:16,
                  background:`${orgColors[i % orgColors.length]}22`,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>
                  🏆
                </div>
                <h3 style={{ color:C.text, margin:"0 0 6px", fontSize:16, fontWeight:700,
                  lineHeight:1.3 }}>{c.title}</h3>
                <p style={{ color:orgColors[i % orgColors.length], margin:"0 0 12px",
                  fontSize:13, fontWeight:600 }}>{c.issuer}</p>
                <p style={{ color:C.muted, margin:"0 0 16px", fontSize:12 }}>
                  📅 {new Date(c.date).toLocaleDateString("en-US", { year:"numeric", month:"long" })}
                </p>

                {c.link && (
  <a
    href={c.link}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: 12,
      fontWeight: 600,
      color: orgColors[i % orgColors.length],
      textDecoration: "none",
      padding: "6px 14px",
      borderRadius: 8,
      background: `${orgColors[i % orgColors.length]}15`,
      border: `1px solid ${orgColors[i % orgColors.length]}33`
    }}
  >
    🔗 View Certificate
  </a>

                )}
              </div>
            </div>
          </Section>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// PAGE: CONTACT
// ════════════════════════════════════════════════════════════════
function ContactPage({ dark }) {
  const C = COLORS[dark ? "dark" : "light"];
  const [form, setForm]     = useState({ name:"", email:"", subject:"", message:"" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // "sending" | "success" | "error"

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Name is required";
    if (!form.email.trim())   e.email   = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.message.trim()) e.message = "Message is required";
    else if (form.message.length < 20) e.message = "Message must be at least 20 characters";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStatus("sending");
    try {
      await api("/contact", { method:"POST", body: JSON.stringify(form) });
      setStatus("success");
      setForm({ name:"", email:"", subject:"", message:"" });
    } catch {
      setStatus("error");
    }
  };

  const inp = (field, type = "text", rows = null) => {
    const Tag = rows ? "textarea" : "input";
    return (
      <div style={{ marginBottom:20 }}>
        <label style={{ display:"block", marginBottom:6, fontSize:13, fontWeight:600,
          color: errors[field] ? C.accent2 : C.muted }}>
          {field.charAt(0).toUpperCase() + field.slice(1)}
          {errors[field] && <span style={{ marginLeft:8, fontSize:11, fontWeight:400 }}>— {errors[field]}</span>}
        </label>
        <Tag type={type} value={form[field]} rows={rows}
          onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
          placeholder={`Your ${field}...`}
          style={{ width:"100%", padding:"12px 16px", borderRadius:10, boxSizing:"border-box",
            background:C.bg, border:`1.5px solid ${errors[field] ? C.accent2 : C.border}`,
            color:C.text, fontSize:14, outline:"none", resize: rows ? "vertical" : undefined,
            minHeight: rows ? 120 : undefined, fontFamily:"inherit",
            transition:"border 0.2s" }}
          onFocus={e => { if (!errors[field]) e.target.style.borderColor = C.accent; }}
          onBlur={e => { if (!errors[field]) e.target.style.borderColor = C.border; }} />
      </div>
    );
  };

  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:"100px 24px 80px" }}>
      <Section>
        <h1 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:800, color:C.text,
          marginBottom:8, textAlign:"center" }}>Get In <span style={{ color:C.accent }}>Touch</span></h1>
        <p style={{ textAlign:"center", color:C.muted, marginBottom:56, fontSize:16 }}>
          Let's work together on something great
        </p>
      </Section>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:32 }}>
        {/* Contact info */}
        <Section>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {[
              { icon:"📧", title:"Email", value:"alfiyafathima2115@gmail.com", link:"mailto:alfiyafathima2115@gmail.com" },
              { icon:"📍", title:"Location", value:"chennai, Tamilnadu" },
              { icon:"💼", title:"LinkedIn", value:"linkedin.com/in/yourname", link:"https://www.linkedin.com/in/alfiya-fathima-20a775347" },
              { icon:"⌥", title:"GitHub", value:"github.com/yourusername", link:"https://github.com/Alfiyafathima-22" },
            ].map(c => (
              <div key={c.title} style={{ background:C.card, border:`1px solid ${C.border}`,
                borderRadius:16, padding:20, display:"flex", gap:16, alignItems:"center" }}>
                <div style={{ width:48, height:48, borderRadius:12, fontSize:22,
                  background:`${C.accent}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {c.icon}
                </div>
                <div>
                  <div style={{ fontSize:12, color:C.muted, marginBottom:2 }}>{c.title}</div>
                  {c.link
                    ? <a href={c.link} style={{ color:C.accent, fontSize:14, fontWeight:600, textDecoration:"none" }}>{c.value}</a>
                    : <div style={{ color:C.text, fontSize:14, fontWeight:600 }}>{c.value}</div>
                  }
                </div>
              </div>
            ))}

            <div style={{ background:`linear-gradient(135deg,${C.accent}18,${C.accent2}18)`,
              border:`1px solid ${C.accent}22`, borderRadius:16, padding:20, textAlign:"center" }}>
              <div style={{ fontSize:32, marginBottom:8 }}>⚡</div>
              <p style={{ color:C.muted, margin:0, fontSize:13, lineHeight:1.6 }}>
                I usually respond within <strong style={{ color:C.accent }}>24 hours</strong>.
                Feel free to reach out for project inquiries, collaboration, or just to say hi!
              </p>
            </div>
          </div>
        </Section>

        {/* Form */}
        <Section>
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:20, padding:32 }}>
            {status === "success" ? (
              <div style={{ textAlign:"center", padding:40 }}>
                <div style={{ fontSize:64, marginBottom:16 }}>🎉</div>
                <h3 style={{ color:C.text, marginBottom:8 }}>Message Sent!</h3>
                <p style={{ color:C.muted, marginBottom:24 }}>I'll get back to you soon.</p>
                <button onClick={() => setStatus(null)}
                  style={{ background:`linear-gradient(135deg,${C.accent},${C.accent2})`,
                    border:"none", cursor:"pointer", padding:"10px 24px", borderRadius:10,
                    color:"#fff", fontSize:14, fontWeight:600 }}>
                  Send Another
                </button>
              </div>
            ) : (
              <>
                <h3 style={{ color:C.text, marginBottom:24, fontSize:18, fontWeight:700 }}>Send Message ✉️</h3>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  <div>{inp("name")}</div>
                  <div>{inp("email","email")}</div>
                </div>
                {inp("subject")}
                {inp("message","text",5)}

                {status === "error" && (
                  <div style={{ padding:"10px 16px", borderRadius:8, marginBottom:16,
                    background:`${C.accent2}18`, color:C.accent2, fontSize:13 }}>
                    ❌ Failed to send. Please try again or email directly.
                  </div>
                )}

                <button onClick={submit} disabled={status === "sending"}
                  style={{ width:"100%", padding:"14px", borderRadius:12, border:"none",
                    background: status === "sending"
                      ? C.border
                      : `linear-gradient(135deg,${C.accent},${C.accent2})`,
                    color:"#fff", fontSize:16, fontWeight:700, cursor: status === "sending" ? "not-allowed" : "pointer",
                    transition:"opacity 0.2s" }}>
                  {status === "sending" ? "Sending... ⏳" : "Send Message 🚀"}
                </button>
              </>
            )}
          </div>
        </Section>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// PAGE: ADMIN DASHBOARD
// ════════════════════════════════════════════════════════════════
function AdminPage({ dark }) {
  const C = COLORS[dark ? "dark" : "light"];
  const [token, setToken]   = useState(() => localStorage.getItem("portfolio_token"));
  const [tab, setTab]       = useState("projects");
  const [projects, setProjs] = useState(SAMPLE_PROJECTS);
  const [messages, setMsgs]  = useState([]);
  const [certs, setCerts]    = useState(SAMPLE_CERTS);
  const [loginForm, setLF]   = useState({ email:"", password:"" });
  const [loginErr, setLE]    = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEdit]  = useState(null);
  const [projForm, setPF]    = useState({ title:"", description:"", technologies:"", githubLink:"", liveLink:"", category:"web", featured:false });

  const loadData = useCallback(() => {
    if (!token) return;
    api("/projects").then(d => setProjs(d.projects)).catch(() => {});
    api("/contact").then(d => setMsgs(d.messages)).catch(() => {});
    api("/certifications").then(d => setCerts(d.certifications)).catch(() => {});
  }, [token]);

  useEffect(() => { loadData(); }, [loadData]);

  const doLogin = async () => {
    setLE("");
    try {
      const d = await api("/auth/login", { method:"POST", body: JSON.stringify(loginForm) });
      localStorage.setItem("portfolio_token", d.token);
      setToken(d.token);
    } catch (e) { setLE(e.message); }
  };

  const logout = () => {
    localStorage.removeItem("portfolio_token");
    setToken(null);
  };

  const deleteProject = async (id) => {
    if (!confirm("Delete this project?")) return;
    try {
      await api(`/projects/${id}`, { method:"DELETE" });
      loadData();
    } catch { alert("Delete failed"); }
  };

  const saveProject = async () => {
    try {
      const body = { ...projForm,
        technologies: projForm.technologies.split(",").map(t => t.trim()).filter(Boolean) };
      if (editItem) await api(`/projects/${editItem._id}`, { method:"PUT", body: JSON.stringify(body) });
      else          await api("/projects", { method:"POST", body: JSON.stringify(body) });
      setShowForm(false); setEdit(null);
      setPF({ title:"", description:"", technologies:"", githubLink:"", liveLink:"", category:"web", featured:false });
      loadData();
    } catch (e) { alert(e.message); }
  };

  const markRead = async (id) => {
    await api(`/contact/${id}/read`, { method:"PATCH" }).catch(() => {});
    loadData();
  };

  // ── Login screen ────────────────────────────────────────────
  if (!token) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center",
      justifyContent:"center", padding:"80px 24px" }}>
      <div style={{ width:"100%", maxWidth:400 }}>
        <Section>
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:24, padding:40 }}>
            <div style={{ textAlign:"center", marginBottom:32 }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🔐</div>
              <h2 style={{ color:C.text, margin:0, fontSize:24 }}>Admin Login</h2>
              <p style={{ color:C.muted, margin:"8px 0 0", fontSize:13 }}>Portfolio Management Dashboard</p>
            </div>
            {["email","password"].map(f => (
              <div key={f} style={{ marginBottom:16 }}>
                <label style={{ display:"block", marginBottom:6, fontSize:13, fontWeight:600, color:C.muted }}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </label>
                <input type={f === "password" ? "password" : "text"}
                  value={loginForm[f]}
                  onChange={e => setLF(l => ({ ...l, [f]: e.target.value }))}
                  onKeyDown={e => e.key === "Enter" && doLogin()}
                  placeholder={f === "email" ? "admin@portfolio.com" : "••••••••"}
                  style={{ width:"100%", padding:"11px 14px", borderRadius:10, boxSizing:"border-box",
                    background:C.bg, border:`1.5px solid ${C.border}`, color:C.text, fontSize:14,
                    outline:"none", transition:"border 0.2s" }}
                  onFocus={e => e.target.style.borderColor = C.accent}
                  onBlur={e => e.target.style.borderColor = C.border} />
              </div>
            ))}
            {loginErr && <p style={{ color:C.accent2, fontSize:13, margin:"0 0 12px" }}>❌ {loginErr}</p>}
            <button onClick={doLogin}
              style={{ width:"100%", padding:14, borderRadius:12, border:"none",
                background:`linear-gradient(135deg,${C.accent},${C.accent2})`,
                color:"#fff", fontSize:16, fontWeight:700, cursor:"pointer", marginTop:4 }}>
              Login →
            </button>
            <p style={{ textAlign:"center", color:C.muted, fontSize:12, marginTop:16 }}>
              Seed credentials: admin@portfolio.com / Admin@1234
            </p>
          </div>
        </Section>
      </div>
    </div>
  );

  // ── Dashboard ────────────────────────────────────────────────
  const tabs = [
    { id:"projects",      label:"Projects",      count:projects.length },
    { id:"messages",      label:"Messages",      count:messages.filter(m => !m.read).length || undefined },
    { id:"certifications",label:"Certifications",count:certs.length },
  ];

  return (
    <div style={{ maxWidth:1000, margin:"0 auto", padding:"100px 24px 80px" }}>
      <Section>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:40, flexWrap:"wrap", gap:12 }}>
          <div>
            <h1 style={{ color:C.text, margin:0, fontSize:"clamp(22px,3vw,36px)", fontWeight:800 }}>
              Admin <span style={{ color:C.accent }}>Dashboard</span>
            </h1>
            <p style={{ color:C.muted, margin:"4px 0 0", fontSize:14 }}>Portfolio Management System</p>
          </div>
          <button onClick={logout}
            style={{ background:C.card, border:`1px solid ${C.border}`, cursor:"pointer",
              padding:"8px 20px", borderRadius:10, color:C.muted, fontSize:13, fontWeight:600 }}>
            Logout ↗
          </button>
        </div>

        {/* Stat cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:16, marginBottom:36 }}>
          {[
            { label:"Projects",     value:projects.length, icon:"💻", color:C.accent },
            { label:"Messages",     value:messages.length, icon:"📩", color:"#ff6584" },
            { label:"Unread",       value:messages.filter(m => !m.read).length, icon:"🔴", color:"#f7971e" },
            { label:"Certificates", value:certs.length,    icon:"🏆", color:"#43e97b" },
          ].map(s => (
            <div key={s.label} style={{ background:C.card, border:`1px solid ${C.border}`,
              borderRadius:16, padding:20 }}>
              <div style={{ fontSize:28, marginBottom:8 }}>{s.icon}</div>
              <div style={{ fontSize:26, fontWeight:800, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:12, color:C.muted }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:8, marginBottom:28, borderBottom:`1px solid ${C.border}`, paddingBottom:0 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ background:"none", border:"none", cursor:"pointer", padding:"10px 20px",
                borderBottom: tab === t.id ? `3px solid ${C.accent}` : "3px solid transparent",
                color: tab === t.id ? C.accent : C.muted, fontSize:14, fontWeight:600,
                display:"flex", alignItems:"center", gap:6 }}>
              {t.label}
              {t.count !== undefined && (
                <span style={{ background: tab === t.id ? C.accent : C.border,
                  color: tab === t.id ? "#fff" : C.muted,
                  fontSize:10, padding:"2px 7px", borderRadius:99 }}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </Section>

      {/* Projects tab */}
      {tab === "projects" && (
        <Section>
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
            <button onClick={() => { setShowForm(true); setEdit(null); setPF({ title:"", description:"", technologies:"", githubLink:"", liveLink:"", category:"web", featured:false }); }}
              style={{ background:`linear-gradient(135deg,${C.accent},${C.accent2})`,
                border:"none", cursor:"pointer", padding:"9px 20px", borderRadius:10,
                color:"#fff", fontSize:13, fontWeight:700 }}>
              + Add Project
            </button>
          </div>

          {showForm && (
            <div style={{ background:C.card, border:`1px solid ${C.accent}44`, borderRadius:16,
              padding:28, marginBottom:24 }}>
              <h3 style={{ color:C.text, margin:"0 0 20px", fontSize:16 }}>
                {editItem ? "Edit Project" : "New Project"}
              </h3>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                {["title","githubLink","liveLink"].map(f => (
                  <div key={f}>
                    <label style={{ display:"block", fontSize:12, color:C.muted, marginBottom:4 }}>{f}</label>
                    <input value={projForm[f]} onChange={e => setPF(p => ({ ...p, [f]: e.target.value }))}
                      style={{ width:"100%", padding:"9px 12px", borderRadius:8, boxSizing:"border-box",
                        background:C.bg, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none" }} />
                  </div>
                ))}
                <div>
                  <label style={{ display:"block", fontSize:12, color:C.muted, marginBottom:4 }}>category</label>
                  <select value={projForm.category} onChange={e => setPF(p => ({ ...p, category: e.target.value }))}
                    style={{ width:"100%", padding:"9px 12px", borderRadius:8, boxSizing:"border-box",
                      background:C.bg, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none" }}>
                    {["web","ml","mobile","other"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginTop:14 }}>
                <label style={{ display:"block", fontSize:12, color:C.muted, marginBottom:4 }}>technologies (comma-separated)</label>
                <input value={projForm.technologies} onChange={e => setPF(p => ({ ...p, technologies: e.target.value }))}
                  placeholder="React, Node.js, MongoDB"
                  style={{ width:"100%", padding:"9px 12px", borderRadius:8, boxSizing:"border-box",
                    background:C.bg, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none" }} />
              </div>
              <div style={{ marginTop:14 }}>
                <label style={{ display:"block", fontSize:12, color:C.muted, marginBottom:4 }}>description</label>
                <textarea value={projForm.description} onChange={e => setPF(p => ({ ...p, description: e.target.value }))}
                  rows={3}
                  style={{ width:"100%", padding:"9px 12px", borderRadius:8, boxSizing:"border-box",
                    background:C.bg, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none", resize:"vertical" }} />
              </div>
              <label style={{ display:"flex", alignItems:"center", gap:8, marginTop:12, cursor:"pointer" }}>
                <input type="checkbox" checked={projForm.featured}
                  onChange={e => setPF(p => ({ ...p, featured: e.target.checked }))} />
                <span style={{ color:C.muted, fontSize:13 }}>Featured project</span>
              </label>
              <div style={{ display:"flex", gap:10, marginTop:20 }}>
                <button onClick={saveProject}
                  style={{ background:`linear-gradient(135deg,${C.accent},${C.accent2})`,
                    border:"none", cursor:"pointer", padding:"9px 24px", borderRadius:8,
                    color:"#fff", fontSize:13, fontWeight:700 }}>
                  {editItem ? "Update" : "Create"}
                </button>
                <button onClick={() => { setShowForm(false); setEdit(null); }}
                  style={{ background:C.bg, border:`1px solid ${C.border}`, cursor:"pointer",
                    padding:"9px 20px", borderRadius:8, color:C.muted, fontSize:13 }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {projects.map(p => (
              <div key={p._id} style={{ background:C.card, border:`1px solid ${C.border}`,
                borderRadius:14, padding:"16px 20px", display:"flex",
                alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                    <span style={{ color:C.text, fontWeight:700, fontSize:15 }}>{p.title}</span>
                    {p.featured && <span style={{ background:`${C.accent}22`, color:C.accent, fontSize:10, padding:"2px 8px", borderRadius:99 }}>⭐ Featured</span>}
                    <span style={{ background:`${C.accent2}22`, color:C.accent2, fontSize:10, padding:"2px 8px", borderRadius:99 }}>{p.category}</span>
                  </div>
                  <div style={{ fontSize:12, color:C.muted, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                    {Array.isArray(p.technologies) ? p.technologies.join(", ") : p.technologies}
                  </div>
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={() => { setEdit(p); setShowForm(true); setPF({ ...p, technologies: Array.isArray(p.technologies) ? p.technologies.join(", ") : p.technologies }); }}
                    style={{ background:C.bg, border:`1px solid ${C.border}`, cursor:"pointer",
                      padding:"6px 14px", borderRadius:8, color:C.muted, fontSize:12 }}>
                    ✏️ Edit
                  </button>
                  <button onClick={() => deleteProject(p._id)}
                    style={{ background:`${C.accent2}15`, border:`1px solid ${C.accent2}44`,
                      cursor:"pointer", padding:"6px 14px", borderRadius:8, color:C.accent2, fontSize:12 }}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Messages tab */}
      {tab === "messages" && (
        <Section>
          {messages.length === 0 ? (
            <div style={{ textAlign:"center", padding:60, color:C.muted }}>
              <div style={{ fontSize:48, marginBottom:12 }}>📭</div>
              <p>No messages yet. (API connection needed)</p>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {messages.map(m => (
                <div key={m._id} style={{ background: m.read ? C.card : `${C.accent}0d`,
                  border:`1px solid ${m.read ? C.border : C.accent + "44"}`,
                  borderRadius:14, padding:"18px 22px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8, flexWrap:"wrap", gap:8 }}>
                    <div>
                      <span style={{ color:C.text, fontWeight:700 }}>{m.name}</span>
                      <span style={{ color:C.muted, fontSize:13, marginLeft:8 }}>&lt;{m.email}&gt;</span>
                      {!m.read && <span style={{ background:C.accent, color:"#fff", fontSize:10, padding:"2px 8px", borderRadius:99, marginLeft:8 }}>NEW</span>}
                    </div>
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      <span style={{ color:C.muted, fontSize:12 }}>{new Date(m.createdAt).toLocaleDateString()}</span>
                      {!m.read && (
                        <button onClick={() => markRead(m._id)}
                          style={{ background:C.bg, border:`1px solid ${C.border}`, cursor:"pointer",
                            padding:"4px 10px", borderRadius:6, color:C.muted, fontSize:11 }}>
                          Mark Read
                        </button>
                      )}
                    </div>
                  </div>
                  <div style={{ color:C.accent, fontWeight:600, fontSize:13, marginBottom:6 }}>{m.subject}</div>
                  <div style={{ color:C.muted, fontSize:13, lineHeight:1.6 }}>{m.message}</div>
                </div>
              ))}
            </div>
          )}
        </Section>
      )}

      {/* Certifications tab */}
      {tab === "certifications" && (
        <Section>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:16 }}>
            {certs.map(c => (
              <div key={c._id} style={{ background:C.card, border:`1px solid ${C.border}`,
                borderRadius:14, padding:20 }}>
                <div style={{ fontSize:28, marginBottom:8 }}>🏆</div>
                <div style={{ color:C.text, fontWeight:700, fontSize:14, marginBottom:4 }}>{c.title}</div>
                <div style={{ color:C.accent, fontSize:12, marginBottom:4 }}>{c.organization}</div>
                <div style={{ color:C.muted, fontSize:11 }}>{new Date(c.date).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
          <p style={{ color:C.muted, fontSize:12, marginTop:16, textAlign:"center" }}>
            💡 Use the API to add/edit certifications via POST /api/certifications (admin token required)
          </p>
        </Section>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// SCROLL TO TOP
// ════════════════════════════════════════════════════════════════
function ScrollTop({ dark }) {
  const C = COLORS[dark ? "dark" : "light"];
  const [show, setShow] = useState(false);
  useEffect(() => {
    const h = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  if (!show) return null;
  return (
    <button onClick={() => window.scrollTo({ top:0, behavior:"smooth" })}
      style={{ position:"fixed", bottom:28, right:28, width:46, height:46, borderRadius:"50%",
        background:`linear-gradient(135deg,${C.accent},${C.accent2})`,
        border:"none", cursor:"pointer", color:"#fff", fontSize:22, zIndex:999,
        boxShadow:`0 8px 24px ${C.accent}44`, display:"flex", alignItems:"center", justifyContent:"center" }}>
      ↑
    </button>
  );
}

// ════════════════════════════════════════════════════════════════
// FOOTER
// ════════════════════════════════════════════════════════════════
function Footer({ dark }) {
  const C = COLORS[dark ? "dark" : "light"];
  return (
    <footer style={{ background:C.surface, borderTop:`1px solid ${C.border}`,
      padding:"28px 24px", textAlign:"center" }}>
      <div style={{ maxWidth:900, margin:"0 auto" }}>
        <div style={{ fontFamily:"'Courier New',monospace", fontWeight:700, fontSize:18,
          background:`linear-gradient(90deg,${C.accent},${C.accent2})`,
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:8 }}>
          &lt;Dev/&gt;
        </div>
        <p style={{ color:C.muted, fontSize:13, margin:"0 0 16px" }}>
          Designed & Built by <span style={{ color:C.accent, fontWeight:600 }}>Alfiya Fathima</span>
        </p>
        <div style={{ display:"flex", justifyContent:"center", gap:16 }}>
          {SOCIALS.map(s => (
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
              style={{ color:C.muted, fontSize:13, textDecoration:"none",
                transition:"color 0.2s" }}
              onMouseOver={e => e.target.style.color = C.accent}
              onMouseOut={e => e.target.style.color = C.muted}>
              {s.name}
            </a>
          ))}
        </div>
        <p style={{ color:C.muted, fontSize:11, marginTop:16 }}>
          © {new Date().getFullYear()} · Built with React + Node.js + MongoDB
        </p>
      </div>
    </footer>
  );
}

// ════════════════════════════════════════════════════════════════
// LOADING SPINNER
// ════════════════════════════════════════════════════════════════
function Loader({ dark }) {
  const C = COLORS[dark ? "dark" : "light"];
  return (
    <div style={{ position:"fixed", inset:0, background:C.bg,
      display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999 }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:56, height:56, border:`4px solid ${C.border}`,
          borderTop:`4px solid ${C.accent}`, borderRadius:"50%",
          animation:"spin 0.8s linear infinite", margin:"0 auto 16px" }} />
        <div style={{ fontFamily:"'Courier New',monospace", color:C.accent, fontSize:16, fontWeight:700 }}>
          Loading...
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// ROOT APP
// ════════════════════════════════════════════════════════════════
export default function App() {
  const [dark, toggleDark] = useDark();
  const [page, setPage]    = useState("home");
  const [loading, setLoading] = useState(true);
  const C = COLORS[dark ? "dark" : "light"];

  useEffect(() => {
    setTimeout(() => setLoading(false), 1200);
    // Increment visitor counter
    api("/stats/visit", { method:"POST" }).catch(() => {});
  }, []);

  useEffect(() => {
    window.scrollTo({ top:0, behavior:"smooth" });
  }, [page]);

  if (loading) return <Loader dark={dark} />;

  const pages = { home: HomePage, about: AboutPage, skills: SkillsPage,
    projects: ProjectsPage, certifications: CertificationsPage,
    contact: ContactPage, admin: AdminPage };
  const PageComp = pages[page] || HomePage;

  return (
    <div style={{ background:C.bg, color:C.text, minHeight:"100vh",
      transition:"background 0.3s, color 0.3s", fontFamily:"system-ui, -apple-system, sans-serif" }}>
      <Navbar page={page} setPage={setPage} dark={dark} toggleDark={toggleDark} />
      <main>
        <PageComp dark={dark} setPage={setPage} />
      </main>
      <Footer dark={dark} />
      <ScrollTop dark={dark} />
    </div>
  );
}
