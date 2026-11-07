import React from "react";
import { Layout } from "../../layout";
import { ReelFrame } from "../../compositions/ReelFrame";
import { ChatCta } from "../../components/ChatCta";
import { ChecklistTrust } from "../../components/ChecklistTrust";
import { EndCard } from "../../scenes/EndCard";
import { rbrangeDirection } from "./direction";
import { RRTL } from "./timeline";
import { RRAll, RRAviator, RRGen2, RRHook, RRLineup, RRW3 } from "./RRScenes";

// VO says "Produits originaux" (plural, four models): the trust scene matches it
const RRTrust: React.FC = () => <ChecklistTrust title="PRODUITS ORIGINAUX" items={["Boîte fermée", "Jamais ouverts", "Jamais activés"]} />;
const RRCta: React.FC = () => <ChatCta message="Salam ! Je veux commander les Ray-Ban Meta, modèle : …" />;
const RREnd: React.FC = () => <EndCard tagline="الأصلي ديما!" />;

const SCENES = [
  ["hook", RRHook],
  ["lineup", RRLineup],
  ["w3", RRW3],
  ["aviator", RRAviator],
  ["gen2", RRGen2],
  ["all", RRAll],
  ["trust", RRTrust],
  ["cta", RRCta],
  ["end", RREnd],
] as const;

/** Ray-Ban Meta range: Wayfarer Gen 3 Transitions, Aviator Gen 3, Wayfarer + Headliner Gen 2 (39.5 s, over 30 s at natural
 * speed under the standing approval; Darija VO; 9:16 only). Final frame held from 38.5 s. */
export const RbRangeReel: React.FC<{ layout: Layout }> = ({ layout }) => (
  <ReelFrame layout={layout} tl={RRTL} scenes={SCENES} direction={rbrangeDirection} audio="rbrange/audio/mix.wav" />
);
