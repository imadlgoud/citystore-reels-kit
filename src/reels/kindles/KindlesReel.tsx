import React from "react";
import { Layout } from "../../layout";
import { ReelFrame } from "../../compositions/ReelFrame";
import { ChatCta } from "../../components/ChatCta";
import { ChecklistTrust } from "../../components/ChecklistTrust";
import { EndCard } from "../../scenes/EndCard";
import { kindlesDirection } from "./direction";
import { KDTL } from "./timeline";
import { KDColorsoft, KDEink, KDHook, KDNotes, KDScribe } from "./KDScenes";

// VO says "Produits originaux" (plural, two products): the trust scene matches it
const KDTrust: React.FC = () => <ChecklistTrust title="PRODUITS ORIGINAUX" items={["Boîte fermée", "Jamais ouverts", "Jamais activés"]} />;
const KDCta: React.FC = () => <ChatCta message="Salam ! Je veux commander le Kindle (Colorsoft ou Scribe) : …" />;
const KDEnd: React.FC = () => <EndCard tagline="الأصلي ديما!" />;

const SCENES = [
  ["hook", KDHook],
  ["colorsoft", KDColorsoft],
  ["scribe", KDScribe],
  ["notes", KDNotes],
  ["eink", KDEink],
  ["trust", KDTrust],
  ["cta", KDCta],
  ["end", KDEnd],
] as const;

/** Kindle Colorsoft 16GB + Kindle Scribe 16GB with Premium Pen (35 s, over 30 s under the standing approval; VO sped up
 * on request: trim + max 1.10x pitch-kept; Darija VO; 9:16 only). Final frame held from 34.0 s. */
export const KindlesReel: React.FC<{ layout: Layout }> = ({ layout }) => (
  <ReelFrame layout={layout} tl={KDTL} scenes={SCENES} direction={kindlesDirection} audio="kindles/audio/mix.wav" />
);
