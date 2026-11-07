import React from "react";
import { Layout } from "../../layout";
import { ReelFrame } from "../../compositions/ReelFrame";
import { ChatCta } from "../../components/ChatCta";
import { ChecklistTrust } from "../../components/ChecklistTrust";
import { EndCard } from "../../scenes/EndCard";
import { rbmetaDirection } from "./direction";
import { RBTL } from "./timeline";
import { RBAi, RBBattery, RBCamera, RBHook, RBIntro, RBTrans } from "./RBScenes";

// VO says "Produit original" (singular): the trust scene matches it
const RBTrust: React.FC = () => <ChecklistTrust title="PRODUIT ORIGINAL" items={["Boîte fermée", "Jamais ouvert", "Jamais activé"]} />;
const RBCta: React.FC = () => <ChatCta message="Salam ! Je veux commander les Ray-Ban Meta Wayfarer Matte Black Transitions." />;
const RBEnd: React.FC = () => <EndCard tagline="الأصلي ديما!" />;

const SCENES = [
  ["hook", RBHook],
  ["intro", RBIntro],
  ["trans", RBTrans],
  ["camera", RBCamera],
  ["ai", RBAi],
  ["battery", RBBattery],
  ["trust", RBTrust],
  ["cta", RBCta],
  ["end", RBEnd],
] as const;

/** Ray-Ban Meta (3rd gen) Wayfarer Matte Black, Transitions lenses (30 s; pause trimming + max 1.10x pitch-kept;
 * Darija VO; 9:16 only). Final frame held from 29.0 s. */
export const RbMetaReel: React.FC<{ layout: Layout }> = ({ layout }) => (
  <ReelFrame layout={layout} tl={RBTL} scenes={SCENES} direction={rbmetaDirection} audio="rbmeta/audio/mix.wav" />
);
