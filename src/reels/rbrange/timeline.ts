import timelineJson from "../../../public/rbrange/data/timeline.json";
import productsJson from "../../../public/rbrange/data/products.json";
import { evIn, evListIn, sceneIn, Timeline } from "../../timeline";

// Ray-Ban Meta range reel timeline (reels/rbrange/build_timeline.py), shared with its mix.
// 39.5 s: natural speed (even 1.10x would not fit 30 s), over 30 s under the standing approval.
export const RRTL = timelineJson as unknown as Timeline;
export const rrscene = (id: string) => sceneIn(RRTL, id);
export const rrev = (k: string) => evIn(RRTL, k);
export const rrevList = (k: string) => evListIn(RRTL, k);
type P = { src: string; w: number; h: number };
const PR = productsJson as unknown as Record<string, P>;
const img = (k: string) => ({ src: PR[k].src, aspect: PR[k].h / PR[k].w });
export const OFFICIAL = { w3: img("w3"), w3_lens: img("w3_lens"), w3_angle: img("w3_angle"), aviator: img("aviator"), w2: img("w2"), headliner: img("headliner") };
