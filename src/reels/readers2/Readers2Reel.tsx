import React from "react";
import { Layout } from "../../layout";
import { ReelFrame } from "../../compositions/ReelFrame";
import { ChatCta } from "../../components/ChatCta";
import { ChecklistTrust } from "../../components/ChecklistTrust";
import { EndCard } from "../../scenes/EndCard";
import { readers2Direction } from "./direction";
import { R2TL } from "./timeline";
import { R2Eink, R2Hook, R2Intro, R2Kindle, R2Kobo } from "./R2Scenes";

// VO says "Produits originaux" (plural): the trust scene matches it
const R2Trust: React.FC = () => <ChecklistTrust title="PRODUITS ORIGINAUX" items={["Boîte fermée", "Jamais ouverts", "Jamais activés"]} />;
const R2Cta: React.FC = () => <ChatCta message="Salam ! Je veux commander la liseuse : …" />;
const R2End: React.FC = () => <EndCard tagline="الأصلي ديما!" />;

const SCENES = [
  ["hook", R2Hook],
  ["intro", R2Intro],
  ["kindle", R2Kindle],
  ["kobo", R2Kobo],
  ["eink", R2Eink],
  ["trust", R2Trust],
  ["cta", R2Cta],
  ["end", R2End],
] as const;

/** E-readers: Amazon Kindle 11th gen 16GB (Vert, Noir) + Kobo Libra Colour (Noir) (30 s; pause trimming, natural speed;
 * Darija VO; 9:16 only). Final frame held from 29.0 s. */
export const Readers2Reel: React.FC<{ layout: Layout }> = ({ layout }) => (
  <ReelFrame layout={layout} tl={R2TL} scenes={SCENES} direction={readers2Direction} audio="readers2/audio/mix.wav" />
);
