import React from "react";
import { Layout } from "../../layout";
import { ReelFrame } from "../../compositions/ReelFrame";
import { ChatCta } from "../../components/ChatCta";
import { ChecklistTrust } from "../../components/ChecklistTrust";
import { EndCard } from "../../scenes/EndCard";
import { fc27Direction } from "./direction";
import { FCTL } from "./timeline";
import { FCGame, FCHook, FCIntro, FCLeagues, FCModes } from "./FCScenes";

// VO says "Produit original، neuf، boîte fermée، jamais ouvert": exactly those three checks (singular)
const FCTrust: React.FC = () => <ChecklistTrust title="PRODUIT ORIGINAL" items={["Neuf", "Boîte fermée", "Jamais ouvert"]} icons={["spark", "box", "lock"]} />;
const FCCta: React.FC = () => <ChatCta message="Salam ! Je veux commander EA SPORTS FC 27 sur PS5." />;
const FCEnd: React.FC = () => <EndCard tagline="الأصلي ديما!" />;

const SCENES = [
  ["hook", FCHook],
  ["intro", FCIntro],
  ["game", FCGame],
  ["modes", FCModes],
  ["leagues", FCLeagues],
  ["trust", FCTrust],
  ["cta", FCCta],
  ["end", FCEnd],
] as const;

/** EA SPORTS FC 27 (PS5), new and sealed (30 s; pause trimming, natural speed; Darija VO; 9:16 only).
 * Final frame held from 29.0 s. */
export const FC27Reel: React.FC<{ layout: Layout }> = ({ layout }) => (
  <ReelFrame layout={layout} tl={FCTL} scenes={SCENES} direction={fc27Direction} audio="fc27/audio/mix.wav" />
);
