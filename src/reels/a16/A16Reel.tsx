import React from "react";
import { Layout } from "../../layout";
import { ReelFrame } from "../../compositions/ReelFrame";
import { ChatCta } from "../../components/ChatCta";
import { ChecklistTrust } from "../../components/ChecklistTrust";
import { EndCard } from "../../scenes/EndCard";
import { a16Direction } from "./direction";
import { A6TL } from "./timeline";
import { A6CamBat, A6Hook, A6Intro, A6Screen, A6Updates } from "./A6Scenes";

// VO says "Produit original" (singular): the trust scene matches it
const A6Trust: React.FC = () => <ChecklistTrust title="PRODUIT ORIGINAL" items={["Boîte fermée", "Jamais ouvert", "Jamais activé"]} />;
const A6Cta: React.FC = () => <ChatCta message="Salam ! Je veux commander le Galaxy A16 4GB/128GB Noir." />;
const A6End: React.FC = () => <EndCard tagline="الأصلي ديما!" />;

const SCENES = [
  ["hook", A6Hook],
  ["intro", A6Intro],
  ["screen", A6Screen],
  ["cambat", A6CamBat],
  ["updates", A6Updates],
  ["trust", A6Trust],
  ["cta", A6Cta],
  ["end", A6End],
] as const;

/** Samsung Galaxy A16 4GB/128GB Noir (30 s; pause trimming + 1.10x pitch-kept; Darija VO; 9:16 only).
 * Final frame held from 29.0 s. */
export const A16Reel: React.FC<{ layout: Layout }> = ({ layout }) => (
  <ReelFrame layout={layout} tl={A6TL} scenes={SCENES} direction={a16Direction} audio="a16/audio/mix.wav" />
);
