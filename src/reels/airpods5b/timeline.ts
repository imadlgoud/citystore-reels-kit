import timelineJson from "../../../public/airpods5b/data/timeline.json";
import productsJson from "../../../public/airpods5b/data/products.json";
import { evIn, evListIn, sceneIn, Timeline } from "../../timeline";

// AirPods 5 (second reel) timeline (reels/airpods5b/build_timeline.py), shared with its mix.
// 30 s: pause trimming + light 1.04x pitch-kept, VO ends at 27.6 s.
export const APTL = timelineJson as unknown as Timeline;
export const apscene = (id: string) => sceneIn(APTL, id);
export const apev = (k: string) => evIn(APTL, k);
export const apevList = (k: string) => evListIn(APTL, k);
type P = { src: string; w: number; h: number };
const PR = productsJson as unknown as Record<string, P>;
const img = (k: string) => ({ src: PR[k].src, aspect: PR[k].h / PR[k].w });
export const OFFICIAL = { open: img("open"), case: img("case") };
