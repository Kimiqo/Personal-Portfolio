import Link from "next/link";

export default function NotFound() {
  return <main className="case-page"><div className="case-intro"><span className="eyebrow">404 / A LITTLE OFF THE MAP</span><h1>This experiment<br/>isn’t here.</h1><p>Let’s get you back to the studio.</p><Link href="/?studio=1" className="primary-button">Return to Kimiko Labs →</Link></div></main>;
}
