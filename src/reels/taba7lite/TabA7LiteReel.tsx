import React from "react";
import { Layout } from "../../layout";
import { ReelFrame } from "../../compositions/ReelFrame";
import { ChatCta } from "../../components/ChatCta";
import { ChecklistTrust } from "../../components/ChecklistTrust";
import { EndCard } from "../../scenes/EndCard";
import { taba7liteDirection } from "./direction";
import { TBTL } from "./timeline";
import { TBBatt, TBHook, TBIntro, TBScreen, TBSound } from "./TBScenes";

// VO says "Produit original, boîte fermée, jamais ouvert, jamais activé" (singular): the trust scene matches it
const TBTrust: React.FC = () => <ChecklistTrust title="PRODUIT ORIGINAL" items={["Boîte fermée", "Jamais ouvert", "Jamais activé"]} />;
const TBCta: React.FC = () => <ChatCta message="Salam ! Je veux commander la Samsung Galaxy Tab A7 Lite." />;
const TBEnd: React.FC = () => <EndCard tagline="الأصلي ديما!" />;

const SCENES = [
  ["hook", TBHook],
  ["intro", TBIntro],
  ["screen", TBScreen],
  ["batt", TBBatt],
  ["sound", TBSound],
  ["trust", TBTrust],
  ["cta", TBCta],
  ["end", TBEnd],
] as const;

/** Samsung Galaxy Tab A7 Lite Silver 32 GB (26.5 s; pause trimming, natural speed; Darija VO; 9:16 only). Final frame held from 25.5 s. */
export const TabA7LiteReel: React.FC<{ layout: Layout }> = ({ layout }) => (
  <ReelFrame layout={layout} tl={TBTL} scenes={SCENES} direction={taba7liteDirection} audio="taba7lite/audio/mix.wav" />
);
