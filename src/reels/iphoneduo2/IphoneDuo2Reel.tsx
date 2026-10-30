import React from "react";
import { Layout } from "../../layout";
import { ReelFrame } from "../../compositions/ReelFrame";
import { ChatCta } from "../../components/ChatCta";
import { ChecklistTrust } from "../../components/ChecklistTrust";
import { EndCard } from "../../scenes/EndCard";
import { iphoneduo2Direction } from "./direction";
import { D2TL } from "./timeline";
import { D2Folded, D2Hook, D2Intro, D2Open, D2Secure, D2Specs } from "./D2Scenes";

// VO says "Produits originaux" (plural, two colours): the trust scene matches it
const D2Trust: React.FC = () => <ChecklistTrust title="PRODUITS ORIGINAUX" items={["Boîte fermée", "Jamais ouverts", "Jamais activés"]} />;
const D2Cta: React.FC = () => <ChatCta message="Salam ! Je veux commander l'iPhone Duo 256GB. Couleur : …" />;
const D2End: React.FC = () => <EndCard tagline="الأصلي ديما!" />;

const SCENES = [
  ["hook", D2Hook],
  ["intro", D2Intro],
  ["folded", D2Folded],
  ["open", D2Open],
  ["specs", D2Specs],
  ["secure", D2Secure],
  ["trust", D2Trust],
  ["cta", D2Cta],
  ["end", D2End],
] as const;

/** iPhone Duo 256GB, Night Sky + Star White (30 s; tightest pauses + 1.06x pitch-kept on request; Darija VO; 9:16 only).
 * Final frame held from 29.0 s. */
export const IphoneDuo2Reel: React.FC<{ layout: Layout }> = ({ layout }) => (
  <ReelFrame layout={layout} tl={D2TL} scenes={SCENES} direction={iphoneduo2Direction} audio="iphoneduo2/audio/mix.wav" />
);
