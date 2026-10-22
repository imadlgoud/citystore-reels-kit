import React from "react";
import { Layout } from "../../layout";
import { ReelFrame } from "../../compositions/ReelFrame";
import { ChatCta } from "../../components/ChatCta";
import { ChecklistTrust } from "../../components/ChecklistTrust";
import { EndCard } from "../../scenes/EndCard";
import { a07Direction } from "./direction";
import { A7TL } from "./timeline";
import { A7CamBat, A7Colors, A7Hook, A7Intro, A7Screen, A7Updates } from "./A7Scenes";

const A7Trust: React.FC = () => <ChecklistTrust title="PRODUITS ORIGINAUX" items={["Boîte fermée", "Jamais ouverts", "Jamais activés"]} />;
const A7Cta: React.FC = () => <ChatCta message="Salam ! Je veux commander le Galaxy A07." />;
const A7End: React.FC = () => <EndCard tagline="الأصلي ديما!" />;

const SCENES = [
  ["hook", A7Hook],
  ["intro", A7Intro],
  ["screen", A7Screen],
  ["cambat", A7CamBat],
  ["updates", A7Updates],
  ["colors", A7Colors],
  ["trust", A7Trust],
  ["cta", A7Cta],
  ["end", A7End],
] as const;

/** Samsung Galaxy A07 4GB/64GB (30 s, Darija VO, 9:16 only). Final frame held from 29.0 s. */
export const A07Reel: React.FC<{ layout: Layout }> = ({ layout }) => (
  <ReelFrame layout={layout} tl={A7TL} scenes={SCENES} direction={a07Direction} audio="a07/audio/mix.wav" />
);
