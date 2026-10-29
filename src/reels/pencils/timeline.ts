import timelineJson from "../../../public/pencils/data/timeline.json";
import productsJson from "../../../public/pencils/data/products.json";
import { evIn, evListIn, sceneIn, Timeline } from "../../timeline";

// Apple Pencil range reel timeline (reels/pencils/build_timeline.py), shared with its mix.
// 36.5 s: over 30 s at natural speed under the standing approval (even 1.10x would end the VO at 30.1 s).
export const PNTL = timelineJson as unknown as Timeline;
export const pnscene = (id: string) => sceneIn(PNTL, id);
export const pnev = (k: string) => evIn(PNTL, k);
export const pnevList = (k: string) => evListIn(PNTL, k);
type P = { src: string; w: number; h: number };
const PR = productsJson as unknown as Record<string, P>;
const img = (k: string) => ({ src: PR[k].src, aspect: PR[k].h / PR[k].w });
export const OFFICIAL = { pro: img("pro"), gen2: img("gen2"), gen1: img("gen1"), usbc: img("usbc") };
