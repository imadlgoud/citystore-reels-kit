import timelineJson from "../../../public/ip15pm/data/timeline.json";
import productsJson from "../../../public/ip15pm/data/products.json";
import { evIn, evListIn, sceneIn, Timeline } from "../../timeline";

// iPhone 15 Pro Max 1TB Blue Titanium reel timeline (reels/ip15pm/build_timeline.py), shared with its mix.
// 30 s: pause trimming + light 1.03x pitch-kept, VO ends at 27.6 s.
export const P5TL = timelineJson as unknown as Timeline;
export const p5scene = (id: string) => sceneIn(P5TL, id);
export const p5ev = (k: string) => evIn(P5TL, k);
export const p5evList = (k: string) => evListIn(P5TL, k);
type P = { src: string; w: number; h: number };
const PR = productsJson as unknown as Record<string, P>;
const img = (k: string) => ({ src: PR[k].src, aspect: PR[k].h / PR[k].w });
export const OFFICIAL = { pair: img("pair"), front: img("front"), cam: img("cam") };
