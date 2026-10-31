import React from "react";
import { Layout } from "../../layout";
import { ReelFrame } from "../../compositions/ReelFrame";
import { ChatCta } from "../../components/ChatCta";
import { ChecklistTrust } from "../../components/ChecklistTrust";
import { EndCard } from "../../scenes/EndCard";
import { ip15pmDirection } from "./direction";
import { P5TL } from "./timeline";
import { P5Camera, P5Chip, P5Hook, P5Intro, P5Sim, P5Titan } from "./P5Scenes";

// VO says "Produit original" (singular): the trust scene matches it
const P5Trust: React.FC = () => <ChecklistTrust title="PRODUIT ORIGINAL" items={["Boîte fermée", "Jamais ouvert", "Jamais activé"]} />;
const P5Cta: React.FC = () => <ChatCta message="Salam ! Je veux commander l'iPhone 15 Pro Max 1TB Blue Titanium." />;
const P5End: React.FC = () => <EndCard tagline="الأصلي ديما!" />;

const SCENES = [
  ["hook", P5Hook],
  ["intro", P5Intro],
  ["titan", P5Titan],
  ["chip", P5Chip],
  ["camera", P5Camera],
  ["sim", P5Sim],
  ["trust", P5Trust],
  ["cta", P5Cta],
  ["end", P5End],
] as const;

/** iPhone 15 Pro Max 1TB Blue Titanium, new and sealed (30 s; pause trimming + light 1.03x pitch-kept; Darija VO;
 * 9:16 only). Final frame held from 29.0 s. */
export const Ip15pmReel: React.FC<{ layout: Layout }> = ({ layout }) => (
  <ReelFrame layout={layout} tl={P5TL} scenes={SCENES} direction={ip15pmDirection} audio="ip15pm/audio/mix.wav" />
);
