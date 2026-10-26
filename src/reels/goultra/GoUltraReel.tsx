import React from "react";
import { Layout } from "../../layout";
import { ReelFrame } from "../../compositions/ReelFrame";
import { ChatCta } from "../../components/ChatCta";
import { ChecklistTrust } from "../../components/ChecklistTrust";
import { EndCard } from "../../scenes/EndCard";
import { goultraDirection } from "./direction";
import { GUTL } from "./timeline";
import { GUHook, GUIntro, GUMagnet, GUPod, GUTripod, GUVideo } from "./GUScenes";

// VO says "Produits originaux" (plural): the trust scene matches it
const GUTrust: React.FC = () => <ChecklistTrust title="PRODUITS ORIGINAUX" items={["Boîte fermée", "Jamais ouverts", "Jamais activés"]} />;
const GUCta: React.FC = () => <ChatCta message="Salam ! Je veux commander l'Insta360 GO Ultra Creator Bundle." />;
const GUEnd: React.FC = () => <EndCard tagline="الأصلي ديما!" />;

const SCENES = [
  ["hook", GUHook],
  ["intro", GUIntro],
  ["magnet", GUMagnet],
  ["video", GUVideo],
  ["pod", GUPod],
  ["tripod", GUTripod],
  ["trust", GUTrust],
  ["cta", GUCta],
  ["end", GUEnd],
] as const;

/** Insta360 GO Ultra Creator Bundle (34 s, over 30 s under the standing approval; VO tightened + 1.10x on request;
 * Darija VO; 9:16 only). Final frame held from 33.0 s. */
export const GoUltraReel: React.FC<{ layout: Layout }> = ({ layout }) => (
  <ReelFrame layout={layout} tl={GUTL} scenes={SCENES} direction={goultraDirection} audio="goultra/audio/mix.wav" />
);
