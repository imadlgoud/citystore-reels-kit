import React from "react";
import { Layout } from "../../layout";
import { ReelFrame } from "../../compositions/ReelFrame";
import { ChatCta } from "../../components/ChatCta";
import { ChecklistTrust } from "../../components/ChecklistTrust";
import { EndCard } from "../../scenes/EndCard";
import { pencilsDirection } from "./direction";
import { PNTL } from "./timeline";
import { PNGen1, PNGen2, PNHook, PNPro, PNUsbc } from "./PNScenes";

// VO says "Produits originaux" (plural, four products): the trust scene matches it
const PNTrust: React.FC = () => <ChecklistTrust title="PRODUITS ORIGINAUX" items={["Boîte fermée", "Jamais ouverts", "Jamais activés"]} />;
const PNCta: React.FC = () => <ChatCta message="Salam ! Je veux commander un Apple Pencil. Mon iPad : …" />;
const PNEnd: React.FC = () => <EndCard tagline="الأصلي ديما!" />;

const SCENES = [
  ["hook", PNHook],
  ["pro", PNPro],
  ["gen2", PNGen2],
  ["gen1", PNGen1],
  ["usbc", PNUsbc],
  ["trust", PNTrust],
  ["cta", PNCta],
  ["end", PNEnd],
] as const;

/** Apple Pencil range: Pro, 2nd gen, 1st gen, USB-C (36.5 s, over 30 s at natural speed under the standing approval;
 * Darija VO; 9:16 only). Final frame held from 35.5 s. */
export const PencilsReel: React.FC<{ layout: Layout }> = ({ layout }) => (
  <ReelFrame layout={layout} tl={PNTL} scenes={SCENES} direction={pencilsDirection} audio="pencils/audio/mix.wav" />
);
