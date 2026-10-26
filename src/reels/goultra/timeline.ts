import timelineJson from "../../../public/goultra/data/timeline.json";
import productsJson from "../../../public/goultra/data/products.json";
import { evIn, evListIn, sceneIn, Timeline } from "../../timeline";

// Insta360 GO Ultra Creator Bundle reel timeline (reels/goultra/build_timeline.py), shared with its mix.
// 34 s long: the VO ends at 30.6 s even at the max 1.10x, so the standing over-30 s approval applies.
export const GUTL = timelineJson as unknown as Timeline;
export const guscene = (id: string) => sceneIn(GUTL, id);
export const guev = (k: string) => evIn(GUTL, k);
export const guevList = (k: string) => evListIn(GUTL, k);
type P = { src: string; w: number; h: number };
const PR = productsJson as unknown as Record<string, P>;
const img = (k: string) => ({ src: PR[k].src, aspect: PR[k].h / PR[k].w });
export const OFFICIAL = { kit: img("kit"), pod: img("pod"), camera: img("camera"), tripod: img("tripod") };
