import timelineJson from "../../../public/om7/data/timeline.json";
import productsJson from "../../../public/om7/data/products.json";
import { evIn, evListIn, sceneIn, Timeline } from "../../timeline";

// DJI Osmo Mobile 7 reel timeline (reels/om7/build_timeline.py), shared with its mix.
// 30 s: pause trimming + max 1.10x pitch-kept, VO ends at 28.05 s.
export const O7TL = timelineJson as unknown as Timeline;
export const o7scene = (id: string) => sceneIn(O7TL, id);
export const o7ev = (k: string) => evIn(O7TL, k);
export const o7evList = (k: string) => evListIn(O7TL, k);
type P = { src: string; w: number; h: number };
const PR = productsJson as unknown as Record<string, P>;
const img = (k: string) => ({ src: PR[k].src, aspect: PR[k].h / PR[k].w });
export const OFFICIAL = { unfolded: img("unfolded"), folded: img("folded"), phone: img("phone"), clamp: img("clamp"), pouch: img("pouch") };
