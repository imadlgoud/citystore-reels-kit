import timelineJson from "../../../public/whooplife/data/timeline.json";
import productsJson from "../../../public/whooplife/data/products.json";
import { evIn, evListIn, sceneIn, Timeline } from "../../timeline";

// WHOOP Life (12-month membership) reel timeline (reels/whooplife/build_timeline.py), shared with its mix.
// 36.5 s: natural speed (even 1.10x would not fit 30 s), over 30 s under the standing approval.
export const WLTL = timelineJson as unknown as Timeline;
export const wlscene = (id: string) => sceneIn(WLTL, id);
export const wlev = (k: string) => evIn(WLTL, k);
export const wlevList = (k: string) => evListIn(WLTL, k);
type P = { src: string; w: number; h: number };
const PR = productsJson as unknown as Record<string, P>;
const img = (k: string) => ({ src: PR[k].src, aspect: PR[k].h / PR[k].w });
export const OFFICIAL = { life: img("life"), box: img("box"), battery: img("battery") };
