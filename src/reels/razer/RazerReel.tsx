import React from "react";
import { Layout } from "../../layout";
import { ReelFrame } from "../../compositions/ReelFrame";
import { ChatCta } from "../../components/ChatCta";
import { ChecklistTrust } from "../../components/ChecklistTrust";
import { EndCard } from "../../scenes/EndCard";
import { razerDirection } from "./direction";
import { RZTL } from "./timeline";
import { RZAnc, RZCable, RZHook, RZIntro, RZRemote, RZTips } from "./RZScenes";

// VO says "Produit original" (singular): the trust scene matches it
const RZTrust: React.FC = () => <ChecklistTrust title="PRODUIT ORIGINAL" items={["Boîte fermée", "Jamais ouvert", "Jamais activé"]} />;
const RZCta: React.FC = () => <ChatCta message="Salam ! Je veux commander les Razer Hammerhead USB-C ANC." />;
const RZEnd: React.FC = () => <EndCard tagline="الأصلي ديما!" />;

const SCENES = [
  ["hook", RZHook],
  ["intro", RZIntro],
  ["cable", RZCable],
  ["anc", RZAnc],
  ["tips", RZTips],
  ["remote", RZRemote],
  ["trust", RZTrust],
  ["cta", RZCta],
  ["end", RZEnd],
] as const;

/** Razer Hammerhead USB-C ANC (30 s, Darija VO, 9:16 only). Final frame held from 29.0 s. */
export const RazerReel: React.FC<{ layout: Layout }> = ({ layout }) => (
  <ReelFrame layout={layout} tl={RZTL} scenes={SCENES} direction={razerDirection} audio="razer/audio/mix.wav" />
);
