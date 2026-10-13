import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { portfolio } from "@/content/portfolio";
import { Arrow, ProjectArt, ProjectLinks } from "@/components/PortfolioExperience";

export function generateStaticParams() {
  return portfolio.projects.map(project => ({ slug: project.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = portfolio.projects.find(p => p.id === slug);
  return { title: project ? `${project.title} — Kimiko Labs` : "Project not found — Kimiko Labs", description: project?.description };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = portfolio.projects.findIndex(p => p.id === slug);
  const project = portfolio.projects[index];
  if (!project) notFound();
  const next = portfolio.projects[(index + 1) % portfolio.projects.length];
  return <main className="case-page"><header className="case-header"><Link href="/?studio=1" className="brand"><span className="brand-symbol">✳</span> Kimiko Labs.</Link><Link href="/?studio=1#work" className="case-back"><Arrow/> Back to the studio</Link></header><div className="case-intro"><span className="eyebrow">{project.number} / {project.category}</span><h1>{project.title}</h1><p>{project.description}</p><ProjectLinks project={project}/><a className="github-projects-link" href={portfolio.github} target="_blank" rel="noreferrer">All projects on GitHub ↗</a><div className="project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div><div className="sample-notice">{project.status} · Explore the live project using the links above. Artwork is illustrative.</div><ProjectArt project={project}/><div className="case-sections"><aside className="case-sidebar"><h2>THE TOOLKIT</h2>{project.tags.map(tag => <div key={tag}>{tag}</div>)}</aside><div className="case-body"><section><span className="eyebrow">01 / THE CHALLENGE</span><h2>A question worth exploring.</h2><p>{project.challenge}</p></section><section><span className="eyebrow">02 / THE APPROACH</span><h2>From an idea to an experience.</h2><p>{project.approach}</p></section><section><span className="eyebrow">03 / THE OUTCOME</span><h2>What came out of Kimiko Labs.</h2><p>{project.outcome}</p></section></div></div><Link className="case-next" href={`/work/${next.id}`}><div><span className="eyebrow">NEXT EXPERIMENT</span><h2>{next.title}</h2></div><Arrow diagonal/></Link></main>;
}
