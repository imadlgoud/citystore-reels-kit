import { random } from "remotion";
import timelineJson from "../../../public/hamza2/data/timeline.json";
import { Viseme } from "../../citybot/Mouths";
import { evIn, sceneIn, Timeline } from "../../timeline";

// Hamza & Citybot episode 2 timeline (reels/hamza2/build_timeline.py), shared with its mix.
export type Speaker = "hamza" | "citybot";
type VoLine = Timeline["vo"][number] & { speaker: "hamza" | "citybot" | "both" };
export const H2TL = timelineJson as unknown as Timeline;
export const h2scene = (id: string) => sceneIn(H2TL, id);
export const h2ev = (k: string) => evIn(H2TL, k);

/** only the speaker of a line lip-syncs (both on L8); null = that character is silent at this frame */
export const visemeFor = (who: Speaker, frame: number): Viseme | null => {
  for (const line of H2TL.vo as VoLine[]) {
    if (line.speaker !== who && line.speaker !== "both") continue;
    const t = (frame - line.from) / H2TL.fps;
    if (t < 0 || t > line.duration) continue;
    const cue = line.mouthCues.find((c) => t >= c.start && t < c.end);
    return (cue?.value as Viseme) ?? "X";
  }
  return null;
};

/** natural blinks every 2-5 s (different rhythm per character) -> 0 open .. 1 closed */
export const blinkAt = (who: string, frame: number) => {
  for (let f = who === "hamza" ? 25 : 48, i = 0; f < H2TL.totalFrames + 60; i++) {
    const k = frame - f;
    if (k >= 0 && k < 6) return [0.5, 1, 1, 0.6, 0.25, 0][k];
    f += Math.round(60 + random(`${who}-blink-${i}`) * 90);
  }
  return 0;
};
