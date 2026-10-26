import timelineJson from "../../../public/whoop/data/timeline.json";
import productsJson from "../../../public/whoop/data/products.json";
import { evIn, evListIn, sceneIn, Timeline } from "../../timeline";

// WHOOP 5.0 (abonnement Peak) reel timeline (reels/whoop/build_timeline.py), shared with its mix.
// 31 s long: tightest pauses + the max 1.10x put the VO end at 27.9 s, then the 3 s end card (standing over-30 s approval).
export const WHTL = timelineJson as unknown as Timeline;
export const whscene = (id: string) => sceneIn(WHTL, id);
export const whev = (k: string) => evIn(WHTL, k);
export const whevList = (k: string) => evListIn(WHTL, k);
type P = { src: string; w: number; h: number };
const PR = productsJson as unknown as Record<string, P>;
const img = (k: string) => ({ src: PR[k].src, aspect: PR[k].h / PR[k].w });
export const OFFICIAL = { duo: img("duo"), band: img("band"), battery: img("battery") };
