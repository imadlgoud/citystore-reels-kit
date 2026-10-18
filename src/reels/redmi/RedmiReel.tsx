import React from "react";
import { Layout } from "../../layout";
import { ReelFrame } from "../../compositions/ReelFrame";
import { ChatCta } from "../../components/ChatCta";
import { ChecklistTrust } from "../../components/ChecklistTrust";
import { EndCard } from "../../scenes/EndCard";
import { redmiDirection } from "./direction";
import { RSTL } from "./timeline";
import { RSHook, RSNote14, RSNote15, RSProPlus } from "./RSScenes";

// the two Note 14 models are open box: the trust scene states each condition truthfully (not "boîte fermée" for all)
const RSTrust: React.FC = () => <ChecklistTrust title="PRODUITS ORIGINAUX" items={["Note 15 : boîte fermée", "Les 14 : boîte ouverte", "Jamais activés"]} icons={["lock", "box", "power"]} />;
const RSCta: React.FC = () => <ChatCta message="Salam ! Je veux commander un Redmi 5G." />;
const RSEnd: React.FC = () => <EndCard tagline="الأصلي ديما!" />;

const SCENES = [
  ["hook", RSHook],
  ["note15", RSNote15],
  ["proplus", RSProPlus],
  ["note14", RSNote14],
  ["trust", RSTrust],
  ["cta", RSCta],
  ["end", RSEnd],
] as const;

/** Redmi 5G comparison: Note 15 5G, Note 14 Pro+ 5G, Note 14 5G (39.5 s, over 30 s at natural speed under the standing
 * approval; Darija VO; 9:16 only). Final frame held from 38.5 s. */
export const RedmiReel: React.FC<{ layout: Layout }> = ({ layout }) => (
  <ReelFrame layout={layout} tl={RSTL} scenes={SCENES} direction={redmiDirection} audio="redmi/audio/mix.wav" />
);
