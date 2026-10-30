import timelineJson from "../../../public/iphoneduo2/data/timeline.json";
import productsJson from "../../../public/iphoneduo2/data/products.json";
import { evIn, evListIn, sceneIn, Timeline } from "../../timeline";

// iPhone Duo 256GB (Night Sky + Star White) reel timeline (reels/iphoneduo2/build_timeline.py), shared with its mix.
// 30 s: on request, tightest pauses + a slight 1.06x pitch-kept speed-up put the VO end at 27.5 s, then the end card.
export const D2TL = timelineJson as unknown as Timeline;
export const d2scene = (id: string) => sceneIn(D2TL, id);
export const d2ev = (k: string) => evIn(D2TL, k);
export const d2evList = (k: string) => evListIn(D2TL, k);
type P = { src: string; w: number; h: number };
const PR = productsJson as unknown as Record<string, P>;
const img = (k: string) => ({ src: PR[k].src, aspect: PR[k].h / PR[k].w });
export const OFFICIAL = {
  open: img("open"), flat: img("flat"), back: img("back"), front: img("front"), side: img("side"),
  night: img("night"), flat_white: img("flat_white"), flat_night: img("flat_night"),
};
