import timelineJson from "../../../public/a16/data/timeline.json";
import productsJson from "../../../public/a16/data/products.json";
import { evIn, evListIn, sceneIn, Timeline } from "../../timeline";

// Samsung Galaxy A16 reel timeline (reels/a16/build_timeline.py), shared with its mix. 30 s.
export const A6TL = timelineJson as unknown as Timeline;
export const a6scene = (id: string) => sceneIn(A6TL, id);
export const a6ev = (k: string) => evIn(A6TL, k);
export const a6evList = (k: string) => evListIn(A6TL, k);
type P = { src: string; w: number; h: number };
const PR = productsJson as unknown as Record<string, P>;
const img = (k: string) => ({ src: PR[k].src, aspect: PR[k].h / PR[k].w });
export const OFFICIAL = { pair: img("pair"), back: img("back") };
/** rear camera module centre inside the pair image (fractions), for the lens ring / flash */
export const LENS = { x: 0.111, y: 0.11 };
