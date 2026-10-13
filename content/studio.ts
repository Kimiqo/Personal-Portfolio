export type Station = "overview" | "work" | "about" | "cv" | "contact";
export const stations: { id: Station; label: string; object: string; number: string }[] = [
  { id: "overview", label: "Studio", object: "Room overview", number: "00" },
  { id: "work", label: "Projects", object: "The workstation", number: "01" },
  { id: "about", label: "About me", object: "The sketchbook", number: "02" },
  { id: "cv", label: "CV", object: "The clipboard", number: "03" },
  { id: "contact", label: "Contact", object: "The message board", number: "04" },
];

export type HotspotPosition = { id: Station; x: number; y: number; visible: boolean };
export const hotspots: { id: Station; label: string; number: string; position: [number, number, number] }[] = [
  { id: "work", label: "Projects", number: "01", position: [-.28, 2.28, -.2] },
  { id: "about", label: "About me", number: "02", position: [1.25, 1.45, .56] },
  { id: "cv", label: "CV", number: "03", position: [-1.32, 1.3, .95] },
  { id: "contact", label: "Contact", number: "04", position: [1.9, 2.1, -1.45] },
];
