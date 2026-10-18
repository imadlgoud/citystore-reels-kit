import timelineJson from "../../../public/redmi/data/timeline.json";
import productsJson from "../../../public/redmi/data/products.json";
import { evIn, evListIn, sceneIn, Timeline } from "../../timeline";

// Redmi 5G comparison reel timeline (reels/redmi/build_timeline.py), shared with its mix.
// 39.5 s long: the VO does not fit 30 s even at 1.1x, so the standing over-30 s approval applies.
export const RSTL = timelineJson as unknown as Timeline;
export const rsscene = (id: string) => sceneIn(RSTL, id);
export const rsev = (k: string) => evIn(RSTL, k);
export const rsevList = (k: string) => evListIn(RSTL, k);
type P = { src: string; w: number; h: number };
const PR = productsJson as unknown as Record<string, P>;
const img = (k: string) => ({ src: PR[k].src, aspect: PR[k].h / PR[k].w });
export const OFFICIAL = { note15: img("note15"), proplus: img("proplus"), note14: img("note14") };
