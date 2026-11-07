import timelineJson from "../../../public/rbmeta/data/timeline.json";
import productsJson from "../../../public/rbmeta/data/products.json";
import { evIn, evListIn, sceneIn, Timeline } from "../../timeline";

// Ray-Ban Meta (3rd gen) Wayfarer Matte Black Transitions reel timeline (reels/rbmeta/build_timeline.py), shared with its mix.
// 30 s: pause trimming + max 1.10x pitch-kept, VO ends at 28.0 s.
export const RBTL = timelineJson as unknown as Timeline;
export const rbscene = (id: string) => sceneIn(RBTL, id);
export const rbev = (k: string) => evIn(RBTL, k);
export const rbevList = (k: string) => evListIn(RBTL, k);
type P = { src: string; w: number; h: number };
const PR = productsJson as unknown as Record<string, P>;
const img = (k: string) => ({ src: PR[k].src, aspect: PR[k].h / PR[k].w });
export const OFFICIAL = { front: img("front"), front_lens: img("front_lens"), angle: img("angle"), side: img("side"), case: img("case") };
/** camera lens position in the front image (fractions), for the camera ring */
export const CAM = { x: 0.132, y: 0.156 };
