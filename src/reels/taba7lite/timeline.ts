import timelineJson from "../../../public/taba7lite/data/timeline.json";
import productsJson from "../../../public/taba7lite/data/products.json";
import { evIn, evListIn, sceneIn, Timeline } from "../../timeline";

// Galaxy Tab A7 Lite timeline (reels/taba7lite/build_timeline.py), shared with its mix.
// 26.5 s: pause trimming at natural speed, VO ends at 23.8 s.
export const TBTL = timelineJson as unknown as Timeline;
export const tbscene = (id: string) => sceneIn(TBTL, id);
export const tbev = (k: string) => evIn(TBTL, k);
export const tbevList = (k: string) => evListIn(TBTL, k);
type P = { src: string; w: number; h: number };
const PR = productsJson as unknown as Record<string, P>;
const img = (k: string) => ({ src: PR[k].src, aspect: PR[k].h / PR[k].w });
export const OFFICIAL = { full: img("full"), front: img("front") };
