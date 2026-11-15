import React from "react";
import { AbsoluteFill, Audio, Freeze, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BrandBackground } from "../../components/BrandBackground";
import { Subtitles } from "../../components/Subtitles";
import { Layout, LayoutProvider } from "../../layout";
import { sceneIn, TimelineProvider } from "../../timeline";
import { H2End, H2S1, H2S2, H2S3, H2S4, H2S5, H2S6, H2S7 } from "./H2Scenes";
import { RoomBack } from "./Room";
import { H2TL, h2ev } from "./timeline";

const SCENES = [["s1", H2S1], ["s2", H2S2], ["s3", H2S3], ["s4", H2S4], ["s5", H2S5], ["s6", H2S6], ["s7", H2S7], ["end", H2End]] as const;

/** subtitles always centred at the bottom (two characters on screen, no presenter corner) */
const sketchLayout = (L: Layout): Layout => {
  const s = L.portrait ? { x: 60, bottom: 1505, w: 890, align: "center" as const, size: 50 } : { x: 60, bottom: 1035, w: 960, align: "center" as const, size: 40 };
  return { ...L, subs: { hook: s, corner: s, end: s } };
};

/** warm living room until Citybot bursts out, then the brand gradient + grid sweeps in from the phone */
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const bAt = h2ev("s2.burst");
  const r = Math.max(0, frame - bAt) * 9; // % of the frame diagonal
  return (
    <AbsoluteFill>
      {frame < bAt + 12 && <div style={{ position: "absolute", inset: 0, filter: "blur(14px) brightness(0.8)" }}><RoomBack sofaTop={1170} /></div>}
      {frame >= bAt && (
        <div style={{ position: "absolute", inset: 0, clipPath: `circle(${Math.min(160, r)}% at 50% 40%)` }}>
          <BrandBackground />
        </div>
      )}
    </AbsoluteFill>
  );
};

/** Hamza & Citybot, episode 2 "الكورة قد النملة" (iPhone Duo): 26.5 s, final frame held from 25.5 s. */
export const Hamza2Reel: React.FC<{ layout: Layout; clean?: boolean }> = ({ layout, clean }) => (
  <LayoutProvider layout={sketchLayout(layout)}>
    <TimelineProvider tl={H2TL}>
      <AbsoluteFill style={{ background: "#2E3EFE" }}>
        <Freeze frame={H2TL.holdFrom} active={(f) => f >= H2TL.holdFrom}>
          <AbsoluteFill>
            <Background />
            {SCENES.map(([id, Comp]) => {
              const s = sceneIn(H2TL, id);
              return (
                <Sequence key={id} from={s.from} durationInFrames={s.to - s.from} name={id}>
                  <Comp />
                </Sequence>
              );
            })}
            <Subtitles />
          </AbsoluteFill>
        </Freeze>
        <Audio src={staticFile(clean ? "hamza2/audio/mix_clean.wav" : "hamza2/audio/mix.wav")} />
      </AbsoluteFill>
    </TimelineProvider>
  </LayoutProvider>
);
