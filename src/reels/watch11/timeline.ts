import timelineJson from "../../../public/watch11/data/timeline.json";
import productsJson from "../../../public/watch11/data/products.json";
import { evIn, evListIn, sceneIn, Timeline } from "../../timeline";

// Apple Watch Series 11 46mm reel timeline (reels/watch11/build_timeline.py), shared with its mix.
// 30 s: pause trimming only (natural speed), VO ends at 26.4 s, then the end card.
export const WBTL = timelineJson as unknown as Timeline;
export const wbscene = (id: string) => sceneIn(WBTL, id);
export const wbev = (k: string) => evIn(WBTL, k);
export const wbevList = (k: string) => evListIn(WBTL, k);
type P = { src: string; w: number; h: number; screens: number[][] };
const PR = productsJson as unknown as Record<string, P>;
const img = (k: string) => ({ src: PR[k].src, aspect: PR[k].h / PR[k].w, screens: PR[k].screens });
/** City Store's own shop photos (not official renders); screens = blanked screen boxes as image fractions [x0, y0, x1, y1] */
export const PHOTOS = { trio: img("trio"), setup: img("setup"), wrist: img("wrist") };
