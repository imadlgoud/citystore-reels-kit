import React from "react";
import { Layout } from "../../layout";
import { ReelFrame } from "../../compositions/ReelFrame";
import { ChatCta } from "../../components/ChatCta";
import { ChecklistTrust } from "../../components/ChecklistTrust";
import { EndCard } from "../../scenes/EndCard";
import { tx3000eDirection } from "./direction";
import { TXTL } from "./timeline";
import { TXAnt, TXBt, TXHook, TXIntro, TXWifi } from "./TXScenes";

// VO says "Produit original, boîte fermée, jamais ouvert, jamais activé" (singular): the trust scene matches it
const TXTrust: React.FC = () => <ChecklistTrust title="PRODUIT ORIGINAL" items={["Boîte fermée", "Jamais ouvert", "Jamais activé"]} />;
const TXCta: React.FC = () => <ChatCta message="Salam ! Je veux commander la TP-Link Archer TX3000E." />;
const TXEnd: React.FC = () => <EndCard tagline="الأصلي ديما!" />;

const SCENES = [
  ["hook", TXHook],
  ["intro", TXIntro],
  ["wifi", TXWifi],
  ["bt", TXBt],
  ["ant", TXAnt],
  ["trust", TXTrust],
  ["cta", TXCta],
  ["end", TXEnd],
] as const;

/** TP-Link Archer TX3000E (30 s; pause trimming + 1.074x pitch-kept; Darija VO; 9:16 only). Final frame held from 29.0 s. */
export const Tx3000eReel: React.FC<{ layout: Layout }> = ({ layout }) => (
  <ReelFrame layout={layout} tl={TXTL} scenes={SCENES} direction={tx3000eDirection} audio="tx3000e/audio/mix.wav" />
);
