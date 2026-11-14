import timelineJson from "../../../public/oa5pro/data/timeline.json";
import productsJson from "../../../public/oa5pro/data/products.json";
import { evIn, evListIn, sceneIn, Timeline } from "../../timeline";

// DJI Osmo Action 5 Pro timeline (reels/oa5pro/build_timeline.py), shared with its mix.
// 30 s: pause trimming + 1.019x pitch-kept, VO ends at 27.6 s.
export const OATL = timelineJson as unknown as Timeline;
export const oascene = (id: string) => sceneIn(OATL, id);
export const oaev = (k: string) => evIn(OATL, k);
export const oaevList = (k: string) => evListIn(OATL, k);
type P = { src: string; w: number; h: number };
const PR = productsJson as unknown as Record<string, P>;
const img = (k: string) => ({ src: PR[k].src, aspect: PR[k].h / PR[k].w });
export const OFFICIAL = { full: img("full") };
