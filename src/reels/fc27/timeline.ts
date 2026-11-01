import timelineJson from "../../../public/fc27/data/timeline.json";
import productsJson from "../../../public/fc27/data/products.json";
import { evIn, evListIn, sceneIn, Timeline } from "../../timeline";

// EA SPORTS FC 27 (PS5) reel timeline (reels/fc27/build_timeline.py), shared with its mix.
// 30 s: pause trimming, natural speed, VO ends at 27.4 s.
export const FCTL = timelineJson as unknown as Timeline;
export const fcscene = (id: string) => sceneIn(FCTL, id);
export const fcev = (k: string) => evIn(FCTL, k);
export const fcevList = (k: string) => evListIn(FCTL, k);
type P = { src: string; w: number; h: number };
const PR = productsJson as unknown as Record<string, P>;
const img = (k: string) => ({ src: PR[k].src, aspect: PR[k].h / PR[k].w });
export const OFFICIAL = { box: img("box") };
