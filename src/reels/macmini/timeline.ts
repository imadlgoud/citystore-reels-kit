import timelineJson from "../../../public/macmini/data/timeline.json";
import productsJson from "../../../public/macmini/data/products.json";
import { evIn, evListIn, sceneIn, Timeline } from "../../timeline";

// Mac mini M6 reel timeline (reels/macmini/build_timeline.py), shared with its mix. 30 s.
export const MMTL = timelineJson as unknown as Timeline;
export const mmscene = (id: string) => sceneIn(MMTL, id);
export const mmev = (k: string) => evIn(MMTL, k);
export const mmevList = (k: string) => evListIn(MMTL, k);
type P = { src: string; w: number; h: number };
const PR = productsJson as unknown as Record<string, P>;
const img = (k: string) => ({ src: PR[k].src, aspect: PR[k].h / PR[k].w });
export const OFFICIAL = { back: img("back"), front: img("front"), top: img("top") };
/** port centres (fractions of each image) */
export const PORTS = {
  tb: [{ x: 0.71, y: 0.61 }, { x: 0.775, y: 0.61 }, { x: 0.845, y: 0.61 }],
  hdmi: { x: 0.596, y: 0.61 },
  usbc: [{ x: 0.208, y: 0.55 }, { x: 0.325, y: 0.55 }],
};
