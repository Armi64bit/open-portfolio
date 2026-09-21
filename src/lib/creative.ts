export type CreativePiece = {
  id: string;
  title: string;
  tech: string;
  year: string;
  blurb: string;
  video: string;
  poster: string;
  ratio: string;
};

export const creativePieces: CreativePiece[] = [
  {
    id: "algo-01",
    title: "Algo Bloom 01",
    tech: "TouchDesigner · JS",
    year: "2026",
    blurb: "Fractal particles driven by a JS algorithm, beat-locked to the track.",
    video: "/videos/creative/visual-algo-01.mp4",
    poster: "/videos/creative/visual-algo-01.mp4",
    ratio: "16 / 9",
  },
  {
    id: "movieout-a",
    title: "Movieout A",
    tech: "TouchDesigner",
    year: "2026",
    blurb: "Linear-pulse stream with a film-out grade, on-grid with the music.",
    video: "/videos/creative/visual-movieout-a.mp4",
    poster: "/videos/creative/visual-movieout-a.mp4",
    ratio: "16 / 9",
  },
  
  {
    id: "ctrack-td",
    title: "TouchDesigner · Ctrack",
    tech: "TouchDesigner · JS",
    year: "2026",
    blurb: "Live param sweeps exported straight from the TouchDesigner session.",
    video: "/videos/creative/visual-touchdesigner-ctrack.mp4",
    poster: "/videos/creative/visual-touchdesigner-ctrack.mp4",
    ratio: "16 / 9",
  },
];
