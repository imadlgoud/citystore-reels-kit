import React from "react";
import { Layout } from "../../layout";
import { ReelFrame } from "../../compositions/ReelFrame";
import { ChatCta } from "../../components/ChatCta";
import { ChecklistTrust } from "../../components/ChecklistTrust";
import { EndCard } from "../../scenes/EndCard";
import { osmo360Direction } from "./direction";
import { O3TL } from "./timeline";
import { O3Hook, O3Intro, O3Sensor, O3Sphere, O3Stick, O3Storage } from "./O3Scenes";

// VO says "Produit original" (singular): the trust scene matches it
const O3Trust: React.FC = () => <ChecklistTrust title="PRODUIT ORIGINAL" items={["Boîte fermée", "Jamais ouvert", "Jamais activé"]} />;
const O3Cta: React.FC = () => <ChatCta message="Salam ! Je veux commander le DJI Osmo 360 Standard Combo." />;
const O3End: React.FC = () => <EndCard tagline="الأصلي ديما!" />;

const SCENES = [
  ["hook", O3Hook],
  ["intro", O3Intro],
  ["sphere", O3Sphere],
  ["sensor", O3Sensor],
  ["storage", O3Storage],
  ["stick", O3Stick],
  ["trust", O3Trust],
  ["cta", O3Cta],
  ["end", O3End],
] as const;

/** DJI Osmo 360 Standard Combo (38.5 s, over 30 s at natural speed under the standing approval; Darija VO; 9:16 only).
 * Final frame held from 37.5 s. */
export const Osmo360Reel: React.FC<{ layout: Layout }> = ({ layout }) => (
  <ReelFrame layout={layout} tl={O3TL} scenes={SCENES} direction={osmo360Direction} audio="osmo360/audio/mix.wav" />
);
