import React from "react";
import { Layout } from "../../layout";
import { ReelFrame } from "../../compositions/ReelFrame";
import { ChatCta } from "../../components/ChatCta";
import { ChecklistTrust } from "../../components/ChecklistTrust";
import { EndCard } from "../../scenes/EndCard";
import { om7Direction } from "./direction";
import { O7TL } from "./timeline";
import { O7Battery, O7Fold, O7Hook, O7Intro, O7Stab, O7Track } from "./O7Scenes";

// VO says "Produit original" (singular): the trust scene matches it
const O7Trust: React.FC = () => <ChecklistTrust title="PRODUIT ORIGINAL" items={["Boîte fermée", "Jamais ouvert", "Jamais activé"]} />;
const O7Cta: React.FC = () => <ChatCta message="Salam ! Je veux commander le DJI Osmo Mobile 7." />;
const O7End: React.FC = () => <EndCard tagline="الأصلي ديما!" />;

const SCENES = [
  ["hook", O7Hook],
  ["intro", O7Intro],
  ["stab", O7Stab],
  ["track", O7Track],
  ["fold", O7Fold],
  ["battery", O7Battery],
  ["trust", O7Trust],
  ["cta", O7Cta],
  ["end", O7End],
] as const;

/** DJI Osmo Mobile 7 (30 s; pause trimming + max 1.10x pitch-kept; Darija VO; 9:16 only). Final frame held from 29.0 s. */
export const Om7Reel: React.FC<{ layout: Layout }> = ({ layout }) => (
  <ReelFrame layout={layout} tl={O7TL} scenes={SCENES} direction={om7Direction} audio="om7/audio/mix.wav" />
);
