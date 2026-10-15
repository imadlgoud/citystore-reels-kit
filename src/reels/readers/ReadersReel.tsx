import React from "react";
import { Layout } from "../../layout";
import { ReelFrame } from "../../compositions/ReelFrame";
import { ChatCta } from "../../components/ChatCta";
import { ChecklistTrust } from "../../components/ChecklistTrust";
import { EndCard } from "../../scenes/EndCard";
import { readersDirection } from "./direction";
import { RTL_READERS } from "./timeline";
import { RColorsoft, REink, RHook, RKobo, RPaperwhite } from "./RScenes";

const RTrust: React.FC = () => <ChecklistTrust title="PRODUITS ORIGINAUX" items={["Boîte fermée", "Jamais ouverts", "Jamais activés"]} />;
const RCta: React.FC = () => <ChatCta message="Salam ! Je veux commander une liseuse." />;
const REnd: React.FC = () => <EndCard tagline="الأصلي ديما!" />;

const SCENES = [
  ["hook", RHook],
  ["kobo", RKobo],
  ["colorsoft", RColorsoft],
  ["paperwhite", RPaperwhite],
  ["eink", REink],
  ["trust", RTrust],
  ["cta", RCta],
  ["end", REnd],
] as const;

/** E-readers reel: Kobo Libra Colour, Kindle Colorsoft 16GB Black, Kindle Paperwhite 12th gen 16GB Black
 * (36.5 s, over 30 s at natural speed under the standing approval; Darija VO). Final frame held from 35.5 s. */
export const ReadersReel: React.FC<{ layout: Layout }> = ({ layout }) => (
  <ReelFrame layout={layout} tl={RTL_READERS} scenes={SCENES} direction={readersDirection} audio="readers/audio/mix.wav" />
);
