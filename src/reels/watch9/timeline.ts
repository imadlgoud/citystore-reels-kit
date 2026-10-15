import timelineJson from "../../../public/watch9/data/timeline.json";
import productsJson from "../../../public/watch9/data/products.json";
import { evIn, evListIn, sceneIn, Timeline } from "../../timeline";

// Galaxy Watch9 40mm LTE Black reel timeline (reels/watch9/build_timeline.py), shared with its mix. 30 s.
export const W9TL = timelineJson as unknown as Timeline;
export const w9scene = (id: string) => sceneIn(W9TL, id);
export const w9ev = (k: string) => evIn(W9TL, k);
export const w9evList = (k: string) => evListIn(W9TL, k);
type P = { src: string; w: number; h: number };
const PR = productsJson as unknown as Record<string, P>;
const img = (k: string) => ({ src: PR[k].src, aspect: PR[k].h / PR[k].w });
export const OFFICIAL = { angle: img("angle"), front: img("front"), back: img("back"), charger: img("charger") };
