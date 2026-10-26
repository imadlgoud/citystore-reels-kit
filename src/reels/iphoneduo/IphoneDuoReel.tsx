import React from "react";
import { Layout } from "../../layout";
import { ReelFrame } from "../../compositions/ReelFrame";
import { ChatCta } from "../../components/ChatCta";
import { ChecklistTrust } from "../../components/ChecklistTrust";
import { EndCard } from "../../scenes/EndCard";
import { iphoneduoDirection } from "./direction";
import { DUTL } from "./timeline";
import { DUFolded, DUHook, DUIntro, DUOpen, DUSecure, DUSpecs } from "./DUScenes";

// VO says "Produit original" (singular): the trust scene matches it
const DUTrust: React.FC = () => <ChecklistTrust title="PRODUIT ORIGINAL" items={["Boîte fermée", "Jamais ouvert", "Jamais activé"]} />;
const DUCta: React.FC = () => <ChatCta message="Salam ! Je veux commander l'iPhone Duo 256GB Star White." />;
const DUEnd: React.FC = () => <EndCard tagline="الأصلي ديما!" />;

const SCENES = [
  ["hook", DUHook],
  ["intro", DUIntro],
  ["folded", DUFolded],
  ["open", DUOpen],
  ["specs", DUSpecs],
  ["secure", DUSecure],
  ["trust", DUTrust],
  ["cta", DUCta],
  ["end", DUEnd],
] as const;

/** iPhone Duo 256GB Star White (30 s; pause trimming + 1.09x pitch-kept; Darija VO; 9:16 only).
 * Final frame held from 29.0 s. */
export const IphoneDuoReel: React.FC<{ layout: Layout }> = ({ layout }) => (
  <ReelFrame layout={layout} tl={DUTL} scenes={SCENES} direction={iphoneduoDirection} audio="iphoneduo/audio/mix.wav" />
);
