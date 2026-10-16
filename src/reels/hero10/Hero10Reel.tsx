import React from "react";
import { Layout } from "../../layout";
import { ReelFrame } from "../../compositions/ReelFrame";
import { ChatCta } from "../../components/ChatCta";
import { ChecklistTrust } from "../../components/ChecklistTrust";
import { EndCard } from "../../scenes/EndCard";
import { hero10Direction } from "./direction";
import { H10TL } from "./timeline";
import { HFirstServed, HHook, HIntro, HKit, HRes, HSmooth, HWater } from "./HScenes";

// used product: the trust scene states what is true for it (occasion, tested, works well), not "boîte fermée / jamais ouvert"
const HTrust: React.FC = () => (
  <>
    <ChecklistTrust title="OCCASION TESTÉE" items={["Produit d'occasion", "Testé", "Fonctionne bien"]} icons={["camera", "check", "power"]} />
    <HFirstServed />
  </>
);
const HCta: React.FC = () => <ChatCta message="Salam ! Je veux commander la GoPro HERO10 Black d'occasion." />;
const HEnd: React.FC = () => <EndCard tagline="الأصلي ديما!" />;

const SCENES = [
  ["hook", HHook],
  ["intro", HIntro],
  ["res", HRes],
  ["smooth", HSmooth],
  ["water", HWater],
  ["kit", HKit],
  ["trust", HTrust],
  ["cta", HCta],
  ["end", HEnd],
] as const;

/** GoPro HERO10 Black, used unit (30 s, Darija VO, 9:16 only). Final frame held from 29.0 s. */
export const Hero10Reel: React.FC<{ layout: Layout }> = ({ layout }) => (
  <ReelFrame layout={layout} tl={H10TL} scenes={SCENES} direction={hero10Direction} audio="hero10/audio/mix.wav" />
);
