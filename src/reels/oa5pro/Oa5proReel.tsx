import React from "react";
import { Layout } from "../../layout";
import { ReelFrame } from "../../compositions/ReelFrame";
import { ChatCta } from "../../components/ChatCta";
import { ChecklistTrust } from "../../components/ChecklistTrust";
import { EndCard } from "../../scenes/EndCard";
import { oa5proDirection } from "./direction";
import { OATL } from "./timeline";
import { OAHook, OAIntro, OAMic, OAScreen, OAStab } from "./OAScenes";

// VO says "Produit original, boîte fermée, jamais ouvert, jamais activé" (singular): the trust scene matches it
const OATrust: React.FC = () => <ChecklistTrust title="PRODUIT ORIGINAL" items={["Boîte fermée", "Jamais ouvert", "Jamais activé"]} />;
const OACta: React.FC = () => <ChatCta message="Salam ! Je veux commander la DJI Osmo Action 5 Pro." />;
const OAEnd: React.FC = () => <EndCard tagline="الأصلي ديما!" />;

const SCENES = [
  ["hook", OAHook],
  ["intro", OAIntro],
  ["screen", OAScreen],
  ["stab", OAStab],
  ["mic", OAMic],
  ["trust", OATrust],
  ["cta", OACta],
  ["end", OAEnd],
] as const;

/** DJI Osmo Action 5 Pro Essential Combo, vlogger angle (30 s; pause trimming + 1.019x pitch-kept; Darija VO; 9:16 only). Final frame held from 29.0 s. */
export const Oa5proReel: React.FC<{ layout: Layout }> = ({ layout }) => (
  <ReelFrame layout={layout} tl={OATL} scenes={SCENES} direction={oa5proDirection} audio="oa5pro/audio/mix.wav" />
);
