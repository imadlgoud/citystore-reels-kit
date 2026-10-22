import timelineJson from "../../../public/a07/data/timeline.json";
import productsJson from "../../../public/a07/data/products.json";
import { evIn, evListIn, sceneIn, Timeline } from "../../timeline";

// Samsung Galaxy A07 reel timeline (reels/a07/build_timeline.py), shared with its mix. 30 s.
export const A7TL = timelineJson as unknown as Timeline;
export const a7scene = (id: string) => sceneIn(A7TL, id);
export const a7ev = (k: string) => evIn(A7TL, k);
export const a7evList = (k: string) => evListIn(A7TL, k);
type P = { src: string; w: number; h: number };
const PR = productsJson as unknown as Record<string, P>;
const img = (k: string) => ({ src: PR[k].src, aspect: PR[k].h / PR[k].w });
export const OFFICIAL = { black: img("black"), green: img("green") };
/** rear camera module centre inside the black pair image (fractions), for the lens ring / flash */
export const LENS = { x: 0.103, y: 0.131 };
