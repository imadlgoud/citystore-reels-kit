import timelineJson from "../../../public/razer/data/timeline.json";
import productsJson from "../../../public/razer/data/products.json";
import { evIn, evListIn, sceneIn, Timeline } from "../../timeline";

// Razer Hammerhead USB-C ANC reel timeline (reels/razer/build_timeline.py), shared with its mix. 30 s.
export const RZTL = timelineJson as unknown as Timeline;
export const rzscene = (id: string) => sceneIn(RZTL, id);
export const rzev = (k: string) => evIn(RZTL, k);
export const rzevList = (k: string) => evListIn(RZTL, k);
type P = { src: string; w: number; h: number };
const PR = productsJson as unknown as Record<string, P>;
const img = (k: string) => ({ src: PR[k].src, aspect: PR[k].h / PR[k].w });
export const OFFICIAL = { front: img("front"), kit: img("kit") };
/** points inside the front image (fractions): in-line remote / mic, right earbud, USB-C plug */
export const SPOT = { remote: { x: 0.67, y: 0.5 }, bud: { x: 0.46, y: 0.13 }, plug: { x: 0.94, y: 0.36 } };
