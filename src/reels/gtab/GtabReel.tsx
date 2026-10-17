import React from "react";
import { Layout } from "../../layout";
import { ReelFrame } from "../../compositions/ReelFrame";
import { ChatCta } from "../../components/ChatCta";
import { ChecklistTrust } from "../../components/ChecklistTrust";
import { EndCard } from "../../scenes/EndCard";
import { gtabDirection } from "./direction";
import { GTTL } from "./timeline";
import { GTAndroid, GTBattery, GTHook, GTIntro, GTLte, GTScreen } from "./GTScenes";

const GTTrust: React.FC = () => <ChecklistTrust title="PRODUITS ORIGINAUX" items={["Boîte fermée", "Jamais ouverts", "Jamais activés"]} />;
const GTCta: React.FC = () => <ChatCta message="Salam ! Je veux commander la tablette G-Tab T13." />;
const GTEnd: React.FC = () => <EndCard tagline="الأصلي ديما!" />;

const SCENES = [
  ["hook", GTHook],
  ["intro", GTIntro],
  ["screen", GTScreen],
  ["lte", GTLte],
  ["android", GTAndroid],
  ["battery", GTBattery],
  ["trust", GTTrust],
  ["cta", GTCta],
  ["end", GTEnd],
] as const;

/** G-Tab T13 tablet reel (38.5 s, over 30 s at natural speed under the standing approval; Darija VO; 9:16 only).
 * Final frame held from 37.5 s. */
export const GtabReel: React.FC<{ layout: Layout }> = ({ layout }) => (
  <ReelFrame layout={layout} tl={GTTL} scenes={SCENES} direction={gtabDirection} audio="gtab/audio/mix.wav" />
);
