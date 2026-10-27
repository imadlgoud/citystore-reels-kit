import React from "react";
import { Layout } from "../../layout";
import { ReelFrame } from "../../compositions/ReelFrame";
import { ChatCta } from "../../components/ChatCta";
import { ChecklistTrust } from "../../components/ChecklistTrust";
import { EndCard } from "../../scenes/EndCard";
import { watch11Direction } from "./direction";
import { WBTL } from "./timeline";
import { WBBattery, WBDisplay, WBHook, WBIntro, WBSleep } from "./WBScenes";

// VO says "Produit original، neuf، jamais utilisé": only those two checks (no "boîte fermée" claim)
const WBTrust: React.FC = () => <ChecklistTrust title="PRODUIT ORIGINAL" items={["Neuf", "Jamais utilisé"]} icons={["spark", "seal"]} />;
const WBCta: React.FC = () => <ChatCta message="Salam ! Je veux commander l'Apple Watch Series 11 46 mm." />;
const WBEnd: React.FC = () => <EndCard tagline="الأصلي ديما!" />;

const SCENES = [
  ["hook", WBHook],
  ["intro", WBIntro],
  ["battery", WBBattery],
  ["sleep", WBSleep],
  ["display", WBDisplay],
  ["trust", WBTrust],
  ["cta", WBCta],
  ["end", WBEnd],
] as const;

/** Apple Watch Series 11 46mm, new / never used (30 s; pause trimming, natural speed; Darija VO; 9:16 only).
 * Final frame held from 29.0 s. */
export const Watch11Reel: React.FC<{ layout: Layout }> = ({ layout }) => (
  <ReelFrame layout={layout} tl={WBTL} scenes={SCENES} direction={watch11Direction} audio="watch11/audio/mix.wav" />
);
