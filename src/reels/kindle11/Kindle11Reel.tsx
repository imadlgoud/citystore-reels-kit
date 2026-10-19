import React from "react";
import { Layout } from "../../layout";
import { ReelFrame } from "../../compositions/ReelFrame";
import { ChatCta } from "../../components/ChatCta";
import { ChecklistTrust } from "../../components/ChecklistTrust";
import { EndCard } from "../../scenes/EndCard";
import { kindle11Direction } from "./direction";
import { K11TL } from "./timeline";
import { K11Battery, K11Hook, K11Intro, K11Light, K11Screen, K11Storage } from "./K11Scenes";

const K11Trust: React.FC = () => <ChecklistTrust title="PRODUITS ORIGINAUX" items={["Boîte fermée", "Jamais ouverts", "Jamais activés"]} />;
const K11Cta: React.FC = () => <ChatCta message="Salam ! Je veux commander le Kindle 11e génération noir." />;
const K11End: React.FC = () => <EndCard tagline="الأصلي ديما!" />;

const SCENES = [
  ["hook", K11Hook],
  ["intro", K11Intro],
  ["screen", K11Screen],
  ["storage", K11Storage],
  ["light", K11Light],
  ["battery", K11Battery],
  ["trust", K11Trust],
  ["cta", K11Cta],
  ["end", K11End],
] as const;

/** Amazon Kindle 11th gen, 16GB, Black (30 s, Darija VO, 9:16 only). Final frame held from 29.0 s. */
export const Kindle11Reel: React.FC<{ layout: Layout }> = ({ layout }) => (
  <ReelFrame layout={layout} tl={K11TL} scenes={SCENES} direction={kindle11Direction} audio="kindle11/audio/mix.wav" />
);
