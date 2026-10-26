import timelineJson from "../../../public/iphoneduo/data/timeline.json";
import productsJson from "../../../public/iphoneduo/data/products.json";
import { evIn, evListIn, sceneIn, Timeline } from "../../timeline";

// iPhone Duo 256GB Star White reel timeline (reels/iphoneduo/build_timeline.py), shared with its mix.
// 30 s: pause trimming + 1.09x pitch-kept speed-up put the VO end at 26.6 s, then the end card.
export const DUTL = timelineJson as unknown as Timeline;
export const duscene = (id: string) => sceneIn(DUTL, id);
export const duev = (k: string) => evIn(DUTL, k);
export const duevList = (k: string) => evListIn(DUTL, k);
type P = { src: string; w: number; h: number };
const PR = productsJson as unknown as Record<string, P>;
const img = (k: string) => ({ src: PR[k].src, aspect: PR[k].h / PR[k].w });
export const OFFICIAL = { open: img("open"), flat: img("flat"), back: img("back"), front: img("front"), side: img("side") };
