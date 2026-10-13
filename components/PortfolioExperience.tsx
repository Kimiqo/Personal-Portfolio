"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { portfolio, type Project } from "@/content/portfolio";
import { useTheme } from "./ThemeProvider";
import { hotspots, stations, type HotspotPosition, type Station } from "@/content/studio";

const StudioScene = dynamic(() => import("./StudioScene"), { ssr: false, loading: () => <div className="scene-loading">Preparing your space…</div> });
type Panel = "work" | "about" | "cv" | "contact" | null;

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-6-6 6 6-6 6"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function SceneFallback() {
  return <div className="scene-fallback" aria-hidden="true"><div className="fallback-window"/><div className="fallback-desk"><div className="fallback-monitor"><span>&lt;hello, world /&gt;</span></div><div className="fallback-pot"/><div className="fallback-books"/></div></div>;
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <SceneFallback /> : this.props.children; }
}

const bootLines = [
  "Locating a very curious corner of the internet...",
  "Establishing a connection to Kimiko Labs...",
  "Bypassing the ordinary. Unpacking the unexpected...",
  "Access granted. Make yourself at home.",
];

function Entrance({ onEnter }: { onEnter: () => void }) {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const reduceMotion = useReducedMotion();
  const { dark, toggleTheme } = useTheme();

  useEffect(() => {
    if (!running) return;
    const start = performance.now();
    const interval = window.setInterval(() => setProgress(Math.min(100, ((performance.now() - start) / 3000) * 100)), 40);
    const finish = window.setTimeout(onEnter, 3000);
    return () => { window.clearInterval(interval); window.clearTimeout(finish); };
  }, [running, onEnter]);

  return <motion.div className="entrance" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : .4 }}>
    <div className="terminal-grid" aria-hidden="true" />
    <header className="entrance-header"><a href="#" className="terminal-brand">[ KIMIKO LABS ]</a><span><i className="status-dot"/> PRIVATE NETWORK · PUBLIC CURIOSITY</span><button className="entrance-theme" onClick={toggleTheme} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>{dark ? "☾ Dark" : "☼ Light"}</button></header>
    <main className="entrance-main">
      <div className="terminal-eyebrow"><span className="terminal-cross">+</span> UNAUTHORIZED CREATIVITY DETECTED</div>
      <h1>A little outside<br/>the <em>ordinary.</em><span className={reduceMotion ? "cursor static" : "cursor"}>_</span></h1>
      <p className="entrance-description">There’s a whole world behind this screen.<br/>You just have to find your way in.</p>
      <div className="terminal">
        <div className="terminal-title"><span className="terminal-dots"><i/><i/><i/></span><span>lab_access.sh</span><span>↗</span></div>
        <div className="terminal-body">
          <p className="terminal-command"><span>visitor@kimiko-labs</span> ~ % ./find-a-way-in</p>
          <p className="terminal-muted">Creative environment found.</p>
          <p className="terminal-muted">Status: locked. Curiosity: encouraged.</p>
          <div className="boot-log" aria-hidden="true">
            {running ? bootLines.map((line, i) => progress >= i * 25 && <p key={line}><span>{i === 3 ? "✓" : ">"}</span> {line}</p>) : <p><span>&gt;</span> Awaiting a little initiative<span className="terminal-ellipsis">...</span></p>}
          </div>
          {running && <div className="boot-progress" role="progressbar" aria-label="Entering the studio" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}><div style={{ width: `${progress}%` }}/></div>}
          <button className="hack-button" onClick={() => setRunning(true)} disabled={running}><span>{running ? progress >= 75 ? "ACCESS GRANTED" : "HACKING IN PROGRESS" : "HACK INTO KIMIKO LABS"}</span><span>{running ? `${Math.round(progress).toString().padStart(2, "0")}%` : <Arrow/>}</span></button>
          <span className="sr-only" role="status">{running ? "Hacking simulation started. Entering the studio in three seconds." : "Ready to enter the studio."}</span>
        </div>
      </div>
      <div className="entrance-note"><span>01 / BREAK IN</span><span>A playful simulation. No credentials needed.</span></div>
    </main>
    <footer className="entrance-footer"><span>BUILT WITH CODE. POWERED BY CURIOSITY.</span><button onClick={onEnter}>Just take me inside <Arrow diagonal/></button></footer>
  </motion.div>;
}

export function ProjectLinks({ project }: { project: Project }) {
  return <div className="project-external-links">{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`Visit ${project.title} live site`}>Live site <Arrow diagonal/></a>}{project.sourceUrl && <a href={project.sourceUrl} target="_blank" rel="noreferrer" aria-label={`View ${project.title} on GitHub`}>GitHub <Arrow diagonal/></a>}</div>;
}

export function ProjectArt({ project }: { project: Project }) {
  return <div className={`project-art ${project.color}`} aria-hidden="true">
    <span className="art-coordinate">LAB EXPERIMENT / {project.number}</span>
    {project.color === "mint" ? <div className="orbit-art"><div className="orbit-ring ring-one"/><div className="orbit-ring ring-two"/><div className="orbit-ring ring-three"/><div className="orbit-core"/><span className="orbit-moon"/></div>
    : project.color === "peach" ? <div className="ground-art"><span className="ground-sun"/><span className="ground-arch arch-one"/><span className="ground-arch arch-two"/><span className="ground-pill"/></div>
    : <div className="experiment-art"><span className="experiment-star">✳</span><span className="experiment-ball"/><span className="experiment-ring"/></div>}
    <span className="art-bottom">{project.color === "mint" ? "GOOD IDEAS HAVE GRAVITY." : project.color === "peach" ? "A LITTLE MORE HUMAN." : "WHAT IF…?"}</span>
    <span className="art-arrow"><Arrow diagonal/></span>
  </div>;
}

function InfoPanel({ panel, onClose }: { panel: Panel; onClose: () => void }) {
  const panelRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (panel && panelRef.current) {
      panelRef.current.scrollTop = 0;
      panelRef.current.focus({ preventScroll: true });
    }
  }, [panel]);
  if (!panel) return null;
  return <aside ref={panelRef} className={`room-panel surface-panel surface-${panel} ${panel === "work" ? "projects-panel" : ""}`} aria-labelledby="panel-heading" tabIndex={-1}>
    <div className="panel-content"><button className="close-panel" aria-label="Return to room overview" onClick={onClose}>×</button>
      <span className="eyebrow">{panel === "work" ? "01 / THE WORKSTATION" : panel === "about" ? "THE PERSON BEHIND THE PIXELS" : panel === "cv" ? "A LITTLE MORE CONTEXT" : "GOOD THINGS START WITH HELLO"}</span>
      <h2 id="panel-heading">{panel === "work" ? "Things from Kimiko Labs." : panel === "about" ? "Curious by nature." : panel === "cv" ? "The résumé." : "Let’s build something."}</h2>
      {panel === "work" ? <><p>Student tools, community platforms, and business websites. Pick a project to explore.</p><a className="github-projects-link" href={portfolio.github} target="_blank" rel="noreferrer">More projects on GitHub <Arrow diagonal/></a><div className="room-project-list">{portfolio.projects.map(project => <article className="room-project-entry" key={project.id}><Link className="room-project" href={`/work/${project.id}`}><ProjectArt project={project}/><div><span className="eyebrow">{project.category}</span><h3>{project.title}</h3><p>{project.description}</p><span className="sample-tag">{project.status}</span></div><Arrow diagonal/></Link><ProjectLinks project={project}/></article>)}</div></>
        : panel === "about" ? <><p>{portfolio.about}</p><h3>Things I work with</h3><div className="skill-list">{portfolio.skills.map(skill => <span key={skill}>{skill}</span>)}</div><h3>Outside the screen</h3><p>{portfolio.interests.join(" · ")}</p><p className="panel-note">{portfolio.education.qualification} · First Class Honours · GIMPA 2026 Valedictorian</p></>
        : panel === "cv" ? <><p>A concise look at the experience, projects, and skills behind the work.</p>{portfolio.cvUrl ? <a className="primary-button" href={portfolio.cvUrl} download>Download CV <Arrow diagonal/></a> : <p className="panel-note">The full CV will be available here soon.</p>}<h3>{portfolio.name}</h3><p>{portfolio.role}</p><div className="resume-timeline">{portfolio.experience.map(item => <section key={item.company}><span className="eyebrow">{item.dates}</span><h3>{item.role}</h3><strong>{item.company}</strong><p>{item.detail}</p></section>)}</div><h3>Education</h3><p>{portfolio.education.qualification}<br/>{portfolio.education.institution}</p><p className="resume-awards">{portfolio.education.awards}</p><div className="skill-list">{portfolio.skills.map(skill => <span key={skill}>{skill}</span>)}</div></>
        : <><p>Have an idea, an interesting challenge, or a project you’d like to bring to life? There’s always room for a good conversation.</p>{portfolio.email ? <a className="contact-email" href={`mailto:${portfolio.email}`}>{portfolio.email}<Arrow diagonal/></a> : <p className="panel-note">Contact details are coming soon. In the meantime, make yourself at home.</p>}<div className="social-links">{portfolio.github && <a href={portfolio.github} target="_blank" rel="noreferrer">GitHub <Arrow diagonal/></a>}{portfolio.linkedin && <a href={portfolio.linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow diagonal/></a>}</div></>}
    </div>
  </aside>;
}

function Studio({ animateEntry }: { animateEntry: boolean }) {
  const [station, setStation] = useState<Station>("overview");
  const { dark, toggleTheme } = useTheme();
  const [entryFinished, setEntryFinished] = useState(!animateEntry);
  const finishEntry = useRef(() => setEntryFinished(true)).current;
  const [focusArrived, setFocusArrived] = useState(false);
  const [viewRevision, setViewRevision] = useState(0);
  const [walkStep, setWalkStep] = useState({ id: 0, direction: 1 });
  const [webgl, setWebgl] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const reduceMotion = useReducedMotion();
  const title = useRef<HTMLHeadingElement>(null);
  const markerRefs = useRef<Partial<Record<Station, HTMLDivElement | null>>>({});
  const projectMarkers = useRef((points: HotspotPosition[]) => {
    for (const point of points) {
      const marker = markerRefs.current[point.id];
      if (!marker) continue;
      marker.style.transform = `translate3d(${point.x}px, ${point.y}px, 0)`;
      marker.style.visibility = point.visible ? "visible" : "hidden";
    }
  }).current;
  const selected = stations.find(s => s.id === station)!;
  const ready = useRef(() => setSceneReady(true)).current;

  const arrive = useRef(() => setFocusArrived(true)).current;
  function navigate(next: Station) { setFocusArrived(false); setStation(next); setViewRevision(v => v + 1); }
  function reset() { navigate("overview"); }
  function step(direction: number) {
    setFocusArrived(false);
    setStation(current => stations[(stations.findIndex(s => s.id === current) + direction + stations.length) % stations.length].id);
  }

  useEffect(() => {
    title.current?.focus({ preventScroll: true });
    if (window.location.hash === "#work") setStation("work");
    window.scrollTo(0, 0);
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      setWebgl(Boolean(gl));
      if (!gl) setEntryFinished(true);
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch { setWebgl(false); setEntryFinished(true); }
  }, []);

  useEffect(() => {
    function keydown(event: KeyboardEvent) {
      if (event.key === "Escape") { reset(); document.getElementById("station-overview")?.focus(); }
      if (event.target instanceof HTMLElement && event.target.closest("button, a, input, textarea")) return;
      if (event.key === "ArrowRight") { event.preventDefault(); step(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
    }
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, []);

  return <motion.main className={`immersive-room ${!entryFinished ? "room-entering" : ""} ${station === "overview" ? "room-overview" : "room-focused"}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduceMotion ? 0 : .6 }} aria-label="Interactive portfolio studio" data-entry-state={entryFinished ? "inside" : "opening"}>
    <div className={`immersive-scene ${station !== "overview" ? "is-focused" : ""}`}>
      <SceneBoundary>{webgl ? <StudioScene entryAnimation={animateEntry && !entryFinished} onEntered={finishEntry} dark={dark} viewRevision={viewRevision} onArrival={arrive} walkStep={walkStep} onProjection={projectMarkers} station={station} onNavigate={navigate} reducedMotion={Boolean(reduceMotion)} onThemeToggle={toggleTheme} onWork={() => navigate("work")} onAbout={() => navigate("about")} onReady={ready}/> : <SceneFallback/>}</SceneBoundary>
      <div className="room-hotspots" hidden={!entryFinished || station !== "overview" || !sceneReady || !webgl}>{hotspots.map(item => <div className="projected-marker" key={item.id} ref={el => { markerRefs.current[item.id] = el; }} style={{ visibility: "hidden" }}><button className="object-hotspot" onClick={() => navigate(item.id)}><span>{item.number}</span>{item.label}<b>↗</b></button></div>)}</div>
    </div>
    <header className="room-header"><button className="brand" onClick={reset} aria-label="Return to the studio"><span className="brand-symbol">✳</span> Kimiko Labs.</button><span className="room-session">{process.env.NODE_ENV === "development" && <a className="designs-link" href="/concepts">Design options ↗</a>}<i className="status-dot"/> {webgl && sceneReady ? "YOU’RE IN. MAKE YOURSELF AT HOME." : "ENTERING THE STUDIO…"}</span><button className="room-light" onClick={toggleTheme} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} aria-pressed={dark}>{dark ? "☾" : "☼"} <span>{dark ? "Dark mode" : "Light mode"}</span></button></header>
    {entryFinished && station === "overview" && <div className="room-welcome"><span className="eyebrow">A SPACE FOR CODE & CURIOSITY</span><h1 ref={title} tabIndex={-1}>MICHAEL DARKO.<br/><em>Welcome to my world.</em></h1><p>Software engineer. Curious by nature.<br/> Walk toward the workbench. Explore the objects.</p></div>}
    {station !== "overview" && <button className="room-back" onClick={reset}>← Back to the room</button>}
    <InfoPanel panel={station === "overview" || (webgl && !focusArrived) ? null : station} onClose={reset}/>
    {!entryFinished && <div className="door-entry-status"><span className="eyebrow">ACCESS GRANTED</span><p>Opening the door to Kimiko Labs…</p><span className="sr-only" role="status">The studio door is opening. Walking inside.</span></div>}
    <footer className="room-footer"><div className="room-location"><span className="location-number">{selected.number}</span><div><span className="eyebrow">YOU ARE HERE</span><strong>{selected.object}</strong></div></div><nav className="room-nav" aria-label="Studio destinations">{stations.map(s => <button key={s.id} id={`station-${s.id}`} onClick={() => navigate(s.id)} aria-current={station === s.id ? "location" : undefined}><span aria-hidden="true">{s.number}</span>{s.label}</button>)}</nav><div className="room-tour-controls"><button disabled={station !== "overview"} onClick={() => setWalkStep(v => ({ id: v.id + 1, direction: 1 }))} aria-label="Walk forward">↑</button><button disabled={station !== "overview"} onClick={() => setWalkStep(v => ({ id: v.id + 1, direction: -1 }))} aria-label="Step back">↓</button></div></footer>
    <div className="room-instructions">{webgl && sceneReady ? "Drag to look · WASD or scroll to walk · Click an object" : "Choose a destination to explore"}<span>ESC TO RESET</span></div>
    <span className="sr-only" role="status">{station === "overview" ? focusArrived || !webgl ? "Inside the studio" : "Entering the studio" : focusArrived ? `Viewing ${selected.label}` : `Approaching ${selected.label}`}</span>
  </motion.main>;
}

export default function PortfolioExperience() {
  const [entered, setEntered] = useState(false);
  const [animateEntry, setAnimateEntry] = useState(true);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("studio") === "1") { setAnimateEntry(false); setEntered(true); }
  }, []);
  // A stable callback keeps the three-second simulation timer from restarting.
  const enter = useRef(() => setEntered(true)).current;
  return <><AnimatePresence mode="wait">{entered ? <Studio key="studio" animateEntry={animateEntry}/> : <Entrance key="entrance" onEnter={enter}/>}</AnimatePresence><noscript><div className="no-script"><h1>Kimiko Labs</h1><p>A creative developer’s portfolio. JavaScript brings the interactive studio to life.</p><h2>Projects</h2>{portfolio.projects.map(project => <p key={project.id}><a href={`/work/${project.id}`}>{project.title}</a> — {project.description}</p>)}</div></noscript></>;
}
