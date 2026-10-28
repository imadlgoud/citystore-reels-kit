import React from "react";
import { Layout } from "../../layout";
import { ReelFrame } from "../../compositions/ReelFrame";
import { ChatCta } from "../../components/ChatCta";
import { ChecklistTrust } from "../../components/ChecklistTrust";
import { EndCard } from "../../scenes/EndCard";
import { ultra3Direction } from "./direction";
import { U3TL } from "./timeline";
import { U3Band, U3Battery, U3Gps, U3Hook, U3Intro, U3Titan } from "./U3Scenes";

// VO says "Produit original" (singular): the trust scene matches it
const U3Trust: React.FC = () => <ChecklistTrust title="PRODUIT ORIGINAL" items={["Boîte fermée", "Jamais ouvert", "Jamais activé"]} />;
const U3Cta: React.FC = () => <ChatCta message="Salam ! Je veux commander l'Apple Watch Ultra 3 49mm Noir." />;
const U3End: React.FC = () => <EndCard tagline="الأصلي ديما!" />;

const SCENES = [
  ["hook", U3Hook],
  ["intro", U3Intro],
  ["titan", U3Titan],
  ["band", U3Band],
  ["battery", U3Battery],
  ["gps", U3Gps],
  ["trust", U3Trust],
  ["cta", U3Cta],
  ["end", U3End],
] as const;

/** Apple Watch Ultra 3, 49 mm, Noir (black titanium, Black Ocean Band) (30 s; pause trimming, natural speed;
 * Darija VO; 9:16 only). Final frame held from 29.0 s. */
export const Ultra3Reel: React.FC<{ layout: Layout }> = ({ layout }) => (
  <ReelFrame layout={layout} tl={U3TL} scenes={SCENES} direction={ultra3Direction} audio="ultra3/audio/mix.wav" />
);
