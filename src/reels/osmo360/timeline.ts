import timelineJson from "../../../public/osmo360/data/timeline.json";
import productsJson from "../../../public/osmo360/data/products.json";
import { evIn, evListIn, sceneIn, Timeline } from "../../timeline";

// DJI Osmo 360 Standard Combo reel timeline (reels/osmo360/build_timeline.py), shared with its mix.
// 38.5 s long: the VO does not fit 30 s even at 1.1x, so the standing over-30 s approval applies.
export const O3TL = timelineJson as unknown as Timeline;
export const o3scene = (id: string) => sceneIn(O3TL, id);
export const o3ev = (k: string) => evIn(O3TL, k);
export const o3evList = (k: string) => evListIn(O3TL, k);
type P = { src: string; w: number; h: number };
const PR = productsJson as unknown as Record<string, P>;
const img = (k: string) => ({ src: PR[k].src, aspect: PR[k].h / PR[k].w });
export const OFFICIAL = { screen: img("screen"), logo: img("logo") };
