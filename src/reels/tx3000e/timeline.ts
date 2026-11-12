import timelineJson from "../../../public/tx3000e/data/timeline.json";
import productsJson from "../../../public/tx3000e/data/products.json";
import { evIn, evListIn, sceneIn, Timeline } from "../../timeline";

// TP-Link Archer TX3000E timeline (reels/tx3000e/build_timeline.py), shared with its mix.
// 30 s: pause trimming + 1.074x pitch-kept, VO ends at 27.6 s.
export const TXTL = timelineJson as unknown as Timeline;
export const txscene = (id: string) => sceneIn(TXTL, id);
export const txev = (k: string) => evIn(TXTL, k);
export const txevList = (k: string) => evListIn(TXTL, k);
type P = { src: string; w: number; h: number };
const PR = productsJson as unknown as Record<string, P>;
const img = (k: string) => ({ src: PR[k].src, aspect: PR[k].h / PR[k].w });
export const OFFICIAL = { full: img("full"), card: img("card"), base: img("base") };
