import React from "react";
import { Layout } from "../../layout";
import { ReelFrame } from "../../compositions/ReelFrame";
import { ChatCta } from "../../components/ChatCta";
import { ChecklistTrust } from "../../components/ChecklistTrust";
import { EndCard } from "../../scenes/EndCard";
import { macminiDirection } from "./direction";
import { MMTL } from "./timeline";
import { MMAi, MMChip, MMHook, MMIntro, MMPorts } from "./MMScenes";

// VO says "Produit original" (singular): the trust scene matches it
const MMTrust: React.FC = () => <ChecklistTrust title="PRODUIT ORIGINAL" items={["Boîte fermée", "Jamais ouvert", "Jamais activé"]} />;
const MMCta: React.FC = () => <ChatCta message="Salam ! Je veux commander le Mac mini M6 16GB / 256GB." />;
const MMEnd: React.FC = () => <EndCard tagline="الأصلي ديما!" />;

const SCENES = [
  ["hook", MMHook],
  ["intro", MMIntro],
  ["chip", MMChip],
  ["ai", MMAi],
  ["ports", MMPorts],
  ["trust", MMTrust],
  ["cta", MMCta],
  ["end", MMEnd],
] as const;

/** Mac mini M6 16GB / 256GB (30 s, Darija VO, 9:16 only). Final frame held from 29.0 s. */
export const MacminiReel: React.FC<{ layout: Layout }> = ({ layout }) => (
  <ReelFrame layout={layout} tl={MMTL} scenes={SCENES} direction={macminiDirection} audio="macmini/audio/mix.wav" />
);
