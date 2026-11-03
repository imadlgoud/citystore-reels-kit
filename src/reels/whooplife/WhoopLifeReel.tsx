import React from "react";
import { Layout } from "../../layout";
import { ReelFrame } from "../../compositions/ReelFrame";
import { ChatCta } from "../../components/ChatCta";
import { ChecklistTrust } from "../../components/ChecklistTrust";
import { EndCard } from "../../scenes/EndCard";
import { whooplifeDirection } from "./direction";
import { WLTL } from "./timeline";
import { WLAge, WLBand, WLBattery, WLHook, WLIntro, WLLife } from "./WLScenes";

// VO says "Produit original" (singular): the trust scene matches it
const WLTrust: React.FC = () => <ChecklistTrust title="PRODUIT ORIGINAL" items={["Boîte fermée", "Jamais ouvert", "Jamais activé"]} />;
const WLCta: React.FC = () => <ChatCta message="Salam ! Je veux commander le WHOOP Life avec l'abonnement 12 mois." />;
const WLEnd: React.FC = () => <EndCard tagline="الأصلي ديما!" />;

const SCENES = [
  ["hook", WLHook],
  ["intro", WLIntro],
  ["band", WLBand],
  ["life", WLLife],
  ["age", WLAge],
  ["battery", WLBattery],
  ["trust", WLTrust],
  ["cta", WLCta],
  ["end", WLEnd],
] as const;

/** WHOOP Life with a 12-month membership (36.5 s, over 30 s at natural speed under the standing approval; Darija VO;
 * 9:16 only). Final frame held from 35.5 s. */
export const WhoopLifeReel: React.FC<{ layout: Layout }> = ({ layout }) => (
  <ReelFrame layout={layout} tl={WLTL} scenes={SCENES} direction={whooplifeDirection} audio="whooplife/audio/mix.wav" />
);
