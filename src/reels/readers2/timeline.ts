import timelineJson from "../../../public/readers2/data/timeline.json";
import productsJson from "../../../public/readers2/data/products.json";
import { evIn, evListIn, sceneIn, Timeline } from "../../timeline";

// E-readers reel (Kindle 11 Vert + Noir, Kobo Libra Colour Noir) timeline (reels/readers2/build_timeline.py), shared with its mix.
// 30 s: pause trimming only, natural speed, VO ends at 27.5 s.
export const R2TL = timelineJson as unknown as Timeline;
export const r2scene = (id: string) => sceneIn(R2TL, id);
export const r2ev = (k: string) => evIn(R2TL, k);
export const r2evList = (k: string) => evListIn(R2TL, k);
type P = { src: string; w: number; h: number };
const PR = productsJson as unknown as Record<string, P>;
const img = (k: string) => ({ src: PR[k].src, aspect: PR[k].h / PR[k].w });
export const OFFICIAL = { black: img("black"), green_pair: img("green_pair"), black_pair: img("black_pair"), kobo: img("kobo") };
