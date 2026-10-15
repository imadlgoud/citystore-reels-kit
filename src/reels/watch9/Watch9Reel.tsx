import React from "react";
import { Layout } from "../../layout";
import { ReelFrame } from "../../compositions/ReelFrame";
import { ChatCta } from "../../components/ChatCta";
import { ChecklistTrust } from "../../components/ChecklistTrust";
import { EndCard } from "../../scenes/EndCard";
import { watch9Direction } from "./direction";
import { W9TL } from "./timeline";
import { W9Battery, W9Chip, W9Gemini, W9Hook, W9Intro, W9Lte } from "./W9Scenes";

const W9Trust: React.FC = () => <ChecklistTrust title="PRODUITS ORIGINAUX" items={["Boîte fermée", "Jamais ouverts", "Jamais activés"]} />;
const W9Cta: React.FC = () => <ChatCta message="Salam ! Je veux commander la Galaxy Watch9 40mm LTE Black." />;
const W9End: React.FC = () => <EndCard tagline="الأصلي ديما!" />;

const SCENES = [
  ["hook", W9Hook],
  ["intro", W9Intro],
  ["lte", W9Lte],
  ["chip", W9Chip],
  ["battery", W9Battery],
  ["gemini", W9Gemini],
  ["trust", W9Trust],
  ["cta", W9Cta],
  ["end", W9End],
] as const;

/** Galaxy Watch9 40mm LTE Black reel (30 s, Darija VO, 9:16 only). Final frame held from 29.0 s. */
export const Watch9Reel: React.FC<{ layout: Layout }> = ({ layout }) => (
  <ReelFrame layout={layout} tl={W9TL} scenes={SCENES} direction={watch9Direction} audio="watch9/audio/mix.wav" />
);
