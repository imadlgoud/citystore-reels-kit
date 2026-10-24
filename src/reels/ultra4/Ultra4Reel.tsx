import React from "react";
import { Layout } from "../../layout";
import { ReelFrame } from "../../compositions/ReelFrame";
import { ChatCta } from "../../components/ChatCta";
import { ChecklistTrust } from "../../components/ChecklistTrust";
import { EndCard } from "../../scenes/EndCard";
import { ultra4Direction } from "./direction";
import { U4TL } from "./timeline";
import { U4Battery, U4Gps, U4Health, U4Hook, U4Intro, U4Titan } from "./U4Scenes";

const U4Trust: React.FC = () => <ChecklistTrust title="PRODUITS ORIGINAUX" items={["Boîte fermée", "Jamais ouverts", "Jamais activés"]} />;
const U4Cta: React.FC = () => <ChatCta message="Salam ! Je veux commander l'Apple Watch Ultra 4 49mm Titanium." />;
const U4End: React.FC = () => <EndCard tagline="الأصلي ديما!" />;

const SCENES = [
  ["hook", U4Hook],
  ["intro", U4Intro],
  ["titan", U4Titan],
  ["battery", U4Battery],
  ["gps", U4Gps],
  ["health", U4Health],
  ["trust", U4Trust],
  ["cta", U4Cta],
  ["end", U4End],
] as const;

/** Apple Watch Ultra 4, 49 mm, Natural Titanium (37 s, over 30 s at natural speed under the standing approval;
 * Darija VO; 9:16 only). Final frame held from 36.0 s. */
export const Ultra4Reel: React.FC<{ layout: Layout }> = ({ layout }) => (
  <ReelFrame layout={layout} tl={U4TL} scenes={SCENES} direction={ultra4Direction} audio="ultra4/audio/mix.wav" />
);
