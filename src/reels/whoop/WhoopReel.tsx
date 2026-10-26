import React from "react";
import { Layout } from "../../layout";
import { ReelFrame } from "../../compositions/ReelFrame";
import { ChatCta } from "../../components/ChatCta";
import { ChecklistTrust } from "../../components/ChecklistTrust";
import { EndCard } from "../../scenes/EndCard";
import { whoopDirection } from "./direction";
import { WHTL } from "./timeline";
import { WHAge, WHBand, WHBattery, WHHook, WHIntro, WHRecovery } from "./WHScenes";

// VO says "Produit original" (singular): the trust scene matches it
const WHTrust: React.FC = () => <ChecklistTrust title="PRODUIT ORIGINAL" items={["Boîte fermée", "Jamais ouvert", "Jamais activé"]} />;
const WHCta: React.FC = () => <ChatCta message="Salam ! Je veux commander le WHOOP 5.0 avec l'abonnement Peak." />;
const WHEnd: React.FC = () => <EndCard tagline="الأصلي ديما!" />;

const SCENES = [
  ["hook", WHHook],
  ["intro", WHIntro],
  ["band", WHBand],
  ["recovery", WHRecovery],
  ["battery", WHBattery],
  ["age", WHAge],
  ["trust", WHTrust],
  ["cta", WHCta],
  ["end", WHEnd],
] as const;

/** WHOOP 5.0, abonnement Peak (31 s, over 30 s under the standing approval; VO tightened + 1.10x on request;
 * Darija VO; 9:16 only). Final frame held from 30.0 s. */
export const WhoopReel: React.FC<{ layout: Layout }> = ({ layout }) => (
  <ReelFrame layout={layout} tl={WHTL} scenes={SCENES} direction={whoopDirection} audio="whoop/audio/mix.wav" />
);
