import React from "react";
import { Layout } from "../../layout";
import { ReelFrame } from "../../compositions/ReelFrame";
import { ChatCta } from "../../components/ChatCta";
import { ChecklistTrust } from "../../components/ChecklistTrust";
import { EndCard } from "../../scenes/EndCard";
import { airpods5bDirection } from "./direction";
import { APTL } from "./timeline";
import { APAnc, APFeat, APHook, APIntro, APTrans } from "./APScenes";

// VO says "Produits originaux" (plural): the trust scene matches it
const APTrust: React.FC = () => <ChecklistTrust title="PRODUITS ORIGINAUX" items={["Boîte fermée", "Jamais ouverts", "Jamais activés"]} />;
const APCta: React.FC = () => <ChatCta message="Salam ! Je veux commander les AirPods 5." />;
const APEnd: React.FC = () => <EndCard tagline="الأصلي ديما!" />;

const SCENES = [
  ["hook", APHook],
  ["intro", APIntro],
  ["anc", APAnc],
  ["trans", APTrans],
  ["feat", APFeat],
  ["trust", APTrust],
  ["cta", APCta],
  ["end", APEnd],
] as const;

/** AirPods 5, second reel (30 s; pause trimming + light 1.04x pitch-kept; Darija VO; 9:16 only). Final frame held from 29.0 s. */
export const Airpods5bReel: React.FC<{ layout: Layout }> = ({ layout }) => (
  <ReelFrame layout={layout} tl={APTL} scenes={SCENES} direction={airpods5bDirection} audio="airpods5b/audio/mix.wav" />
);
