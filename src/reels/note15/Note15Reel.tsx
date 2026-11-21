import React from "react";
import { Layout } from "../../layout";
import { ReelFrame } from "../../compositions/ReelFrame";
import { ChatCta } from "../../components/ChatCta";
import { ChecklistTrust } from "../../components/ChecklistTrust";
import { EndCard } from "../../scenes/EndCard";
import { note15Direction } from "./direction";
import { N15TL } from "./timeline";
import { NCam, NHook, NIntro, NNet, NRam } from "./NScenes";

// VO says "Produit original, boîte fermée, jamais ouvert, jamais activé" (singular): the trust scene matches it
const NTrust: React.FC = () => <ChecklistTrust title="PRODUIT ORIGINAL" items={["Boîte fermée", "Jamais ouvert", "Jamais activé"]} />;
const NCta: React.FC = () => <ChatCta message="Salam ! Je veux commander le Redmi Note 15 5G." />;
const NEnd: React.FC = () => <EndCard tagline="الأصلي ديما!" />;

const SCENES = [
  ["hook", NHook],
  ["intro", NIntro],
  ["ram", NRam],
  ["net", NNet],
  ["cam", NCam],
  ["trust", NTrust],
  ["cta", NCta],
  ["end", NEnd],
] as const;

/** Redmi Note 15 5G (30 s; pause trimming, natural speed; Darija VO; 9:16 only). Final frame held from 29.0 s. */
export const Note15Reel: React.FC<{ layout: Layout }> = ({ layout }) => (
  <ReelFrame layout={layout} tl={N15TL} scenes={SCENES} direction={note15Direction} audio="note15/audio/mix.wav" />
);
