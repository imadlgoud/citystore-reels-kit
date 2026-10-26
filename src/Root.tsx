import React from "react";
import { Composition, Still } from "remotion";
import { CitybotSheet } from "./compositions/CitybotSheet";
import { Cover } from "./compositions/Cover";
import { Reel } from "./compositions/Reel";
import { FPS, MAX_FRAMES } from "./config";
import { LAYOUT_1x1, LAYOUT_9x16 } from "./layout";
import { TL } from "./timeline";
import { WatchReel } from "./reels/watch/WatchReel";
import { WatchCover } from "./reels/watch/WatchCover";
import { WTL } from "./reels/watch/timeline";
import { GalaxyReel } from "./reels/galaxy/GalaxyReel";
import { GalaxyCover } from "./reels/galaxy/GalaxyCover";
import { GTL } from "./reels/galaxy/timeline";
import { SonyReel } from "./reels/sony/SonyReel";
import { SonyCover } from "./reels/sony/SonyCover";
import { STL } from "./reels/sony/timeline";
import { RaybanReel } from "./reels/rayban/RaybanReel";
import { RaybanCover } from "./reels/rayban/RaybanCover";
import { RTL } from "./reels/rayban/timeline";
import { OneplusReel } from "./reels/oneplus/OneplusReel";
import { OneplusCover } from "./reels/oneplus/OneplusCover";
import { OTL } from "./reels/oneplus/timeline";
import { OsmoReel } from "./reels/osmo/OsmoReel";
import { OsmoCover } from "./reels/osmo/OsmoCover";
import { XTL } from "./reels/osmo/timeline";
import { SwitchReel } from "./reels/switch/SwitchReel";
import { SwitchCover } from "./reels/switch/SwitchCover";
import { NTL } from "./reels/switch/timeline";
import { IphonesReel } from "./reels/iphones/IphonesReel";
import { IphonesCover } from "./reels/iphones/IphonesCover";
import { ITL } from "./reels/iphones/timeline";
import { MicminiReel } from "./reels/micmini/MicminiReel";
import { MicminiCover } from "./reels/micmini/MicminiCover";
import { MTL } from "./reels/micmini/timeline";
import { AirpodsReel } from "./reels/airpods/AirpodsReel";
import { AirpodsCover } from "./reels/airpods/AirpodsCover";
import { ATL } from "./reels/airpods/timeline";
import { ShokzReel } from "./reels/shokz/ShokzReel";
import { ShokzCover } from "./reels/shokz/ShokzCover";
import { ZTL } from "./reels/shokz/timeline";
import { TabsReel } from "./reels/tabs/TabsReel";
import { TabsCover } from "./reels/tabs/TabsCover";
import { TTL } from "./reels/tabs/timeline";
import { GoproReel } from "./reels/gopro/GoproReel";
import { GoproCover } from "./reels/gopro/GoproCover";
import { GTL as GOPRO_TL } from "./reels/gopro/timeline";
import { QuestReel } from "./reels/quest/QuestReel";
import { QuestCover } from "./reels/quest/QuestCover";
import { QTL } from "./reels/quest/timeline";
import { DiscReel } from "./reels/disc/DiscReel";
import { DiscCover } from "./reels/disc/DiscCover";
import { DTL } from "./reels/disc/timeline";
import { ReadersReel } from "./reels/readers/ReadersReel";
import { ReadersCover } from "./reels/readers/ReadersCover";
import { RTL_READERS } from "./reels/readers/timeline";
import { Watch9Reel } from "./reels/watch9/Watch9Reel";
import { Watch9Cover } from "./reels/watch9/Watch9Cover";
import { W9TL } from "./reels/watch9/timeline";
import { Hero10Reel } from "./reels/hero10/Hero10Reel";
import { Hero10Cover } from "./reels/hero10/Hero10Cover";
import { H10TL } from "./reels/hero10/timeline";
import { GtabReel } from "./reels/gtab/GtabReel";
import { GtabCover } from "./reels/gtab/GtabCover";
import { GTTL } from "./reels/gtab/timeline";
import { RedmiReel } from "./reels/redmi/RedmiReel";
import { RedmiCover } from "./reels/redmi/RedmiCover";
import { RSTL } from "./reels/redmi/timeline";
import { Kindle11Reel } from "./reels/kindle11/Kindle11Reel";
import { Kindle11Cover } from "./reels/kindle11/Kindle11Cover";
import { K11TL } from "./reels/kindle11/timeline";
import { A07Reel } from "./reels/a07/A07Reel";
import { A07Cover } from "./reels/a07/A07Cover";
import { A7TL } from "./reels/a07/timeline";
import { Ultra4Reel } from "./reels/ultra4/Ultra4Reel";
import { Ultra4Cover } from "./reels/ultra4/Ultra4Cover";
import { U4TL } from "./reels/ultra4/timeline";
import { RazerReel } from "./reels/razer/RazerReel";
import { RazerCover } from "./reels/razer/RazerCover";
import { RZTL } from "./reels/razer/timeline";
import { MacminiReel } from "./reels/macmini/MacminiReel";
import { MacminiCover } from "./reels/macmini/MacminiCover";
import { MMTL } from "./reels/macmini/timeline";
import { Osmo360Reel } from "./reels/osmo360/Osmo360Reel";
import { Osmo360Cover } from "./reels/osmo360/Osmo360Cover";
import { O3TL } from "./reels/osmo360/timeline";
import { GoUltraReel } from "./reels/goultra/GoUltraReel";
import { GoUltraCover } from "./reels/goultra/GoUltraCover";
import { GUTL } from "./reels/goultra/timeline";

// Hard length limit: never more than 900 frames (30.0 s).
const DURATION = Math.min(TL.totalFrames, MAX_FRAMES);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Reel9x16" component={Reel} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} defaultProps={{ layout: LAYOUT_9x16 }} />
    <Composition id="Reel1x1" component={Reel} durationInFrames={DURATION} fps={FPS} width={1080} height={1080} defaultProps={{ layout: LAYOUT_1x1 }} />
    <Still id="Cover" component={Cover} width={1080} height={1920} />
    <Composition id="WatchReel9x16" component={WatchReel} durationInFrames={Math.min(WTL.totalFrames, MAX_FRAMES)} fps={FPS} width={1080} height={1920} defaultProps={{ layout: LAYOUT_9x16 }} />
    <Composition id="WatchReel1x1" component={WatchReel} durationInFrames={Math.min(WTL.totalFrames, MAX_FRAMES)} fps={FPS} width={1080} height={1080} defaultProps={{ layout: LAYOUT_1x1 }} />
    <Still id="WatchCover" component={WatchCover} width={1080} height={1920} />
    <Composition id="GalaxyReel9x16" component={GalaxyReel} durationInFrames={Math.min(GTL.totalFrames, MAX_FRAMES)} fps={FPS} width={1080} height={1920} defaultProps={{ layout: LAYOUT_9x16 }} />
    <Composition id="GalaxyReel1x1" component={GalaxyReel} durationInFrames={Math.min(GTL.totalFrames, MAX_FRAMES)} fps={FPS} width={1080} height={1080} defaultProps={{ layout: LAYOUT_1x1 }} />
    <Still id="GalaxyCover" component={GalaxyCover} width={1080} height={1920} />
    <Composition id="SonyReel9x16" component={SonyReel} durationInFrames={Math.min(STL.totalFrames, MAX_FRAMES)} fps={FPS} width={1080} height={1920} defaultProps={{ layout: LAYOUT_9x16 }} />
    <Composition id="SonyReel1x1" component={SonyReel} durationInFrames={Math.min(STL.totalFrames, MAX_FRAMES)} fps={FPS} width={1080} height={1080} defaultProps={{ layout: LAYOUT_1x1 }} />
    <Still id="SonyCover" component={SonyCover} width={1080} height={1920} />
    <Composition id="RaybanReel9x16" component={RaybanReel} durationInFrames={Math.min(RTL.totalFrames, MAX_FRAMES)} fps={FPS} width={1080} height={1920} defaultProps={{ layout: LAYOUT_9x16 }} />
    <Composition id="RaybanReel1x1" component={RaybanReel} durationInFrames={Math.min(RTL.totalFrames, MAX_FRAMES)} fps={FPS} width={1080} height={1080} defaultProps={{ layout: LAYOUT_1x1 }} />
    <Still id="RaybanCover" component={RaybanCover} width={1080} height={1920} />
    <Composition id="OneplusReel9x16" component={OneplusReel} durationInFrames={Math.min(OTL.totalFrames, MAX_FRAMES)} fps={FPS} width={1080} height={1920} defaultProps={{ layout: LAYOUT_9x16 }} />
    <Composition id="OneplusReel1x1" component={OneplusReel} durationInFrames={Math.min(OTL.totalFrames, MAX_FRAMES)} fps={FPS} width={1080} height={1080} defaultProps={{ layout: LAYOUT_1x1 }} />
    <Still id="OneplusCover" component={OneplusCover} width={1080} height={1920} />
    {/* DJI Osmo: the user approved going over 30 s for this reel (full 60 s VO kept), so no MAX_FRAMES cap */}
    <Composition id="OsmoReel9x16" component={OsmoReel} durationInFrames={XTL.totalFrames} fps={FPS} width={1080} height={1920} defaultProps={{ layout: LAYOUT_9x16 }} />
    <Composition id="OsmoReel1x1" component={OsmoReel} durationInFrames={XTL.totalFrames} fps={FPS} width={1080} height={1080} defaultProps={{ layout: LAYOUT_1x1 }} />
    <Still id="OsmoCover" component={OsmoCover} width={1080} height={1920} />
    <Composition id="SwitchReel9x16" component={SwitchReel} durationInFrames={Math.min(NTL.totalFrames, MAX_FRAMES)} fps={FPS} width={1080} height={1920} defaultProps={{ layout: LAYOUT_9x16 }} />
    <Composition id="SwitchReel1x1" component={SwitchReel} durationInFrames={Math.min(NTL.totalFrames, MAX_FRAMES)} fps={FPS} width={1080} height={1080} defaultProps={{ layout: LAYOUT_1x1 }} />
    <Still id="SwitchCover" component={SwitchCover} width={1080} height={1920} />
    {/* iPhone 18 Pro / 17 Pro: the user approved going over 30 s for this reel (full VO at natural speed), so no MAX_FRAMES cap */}
    <Composition id="IphonesReel9x16" component={IphonesReel} durationInFrames={ITL.totalFrames} fps={FPS} width={1080} height={1920} defaultProps={{ layout: LAYOUT_9x16 }} />
    <Composition id="IphonesReel1x1" component={IphonesReel} durationInFrames={ITL.totalFrames} fps={FPS} width={1080} height={1080} defaultProps={{ layout: LAYOUT_1x1 }} />
    <Still id="IphonesCover" component={IphonesCover} width={1080} height={1920} />
    <Composition id="MicminiReel9x16" component={MicminiReel} durationInFrames={Math.min(MTL.totalFrames, MAX_FRAMES)} fps={FPS} width={1080} height={1920} defaultProps={{ layout: LAYOUT_9x16 }} />
    <Composition id="MicminiReel1x1" component={MicminiReel} durationInFrames={Math.min(MTL.totalFrames, MAX_FRAMES)} fps={FPS} width={1080} height={1080} defaultProps={{ layout: LAYOUT_1x1 }} />
    <Still id="MicminiCover" component={MicminiCover} width={1080} height={1920} />
    {/* AirPods 5: the user approved going over 30 s for this reel (full VO at natural speed), so no MAX_FRAMES cap */}
    <Composition id="AirpodsReel9x16" component={AirpodsReel} durationInFrames={ATL.totalFrames} fps={FPS} width={1080} height={1920} defaultProps={{ layout: LAYOUT_9x16 }} />
    <Composition id="AirpodsReel1x1" component={AirpodsReel} durationInFrames={ATL.totalFrames} fps={FPS} width={1080} height={1080} defaultProps={{ layout: LAYOUT_1x1 }} />
    <Still id="AirpodsCover" component={AirpodsCover} width={1080} height={1920} />
    {/* Shokz OpenRun Pro: the user approved going over 30 s for this reel (full VO at natural speed), so no MAX_FRAMES cap */}
    <Composition id="ShokzReel9x16" component={ShokzReel} durationInFrames={ZTL.totalFrames} fps={FPS} width={1080} height={1920} defaultProps={{ layout: LAYOUT_9x16 }} />
    <Composition id="ShokzReel1x1" component={ShokzReel} durationInFrames={ZTL.totalFrames} fps={FPS} width={1080} height={1080} defaultProps={{ layout: LAYOUT_1x1 }} />
    <Still id="ShokzCover" component={ShokzCover} width={1080} height={1920} />
    {/* Tablets (A9+ 5G, A11, Idea Tab Plus, Pad 8): the user approved going over 30 s for this reel, so no MAX_FRAMES cap */}
    <Composition id="TabsReel9x16" component={TabsReel} durationInFrames={TTL.totalFrames} fps={FPS} width={1080} height={1920} defaultProps={{ layout: LAYOUT_9x16 }} />
    <Composition id="TabsReel1x1" component={TabsReel} durationInFrames={TTL.totalFrames} fps={FPS} width={1080} height={1080} defaultProps={{ layout: LAYOUT_1x1 }} />
    <Still id="TabsCover" component={TabsCover} width={1080} height={1920} />
    <Composition id="GoproReel9x16" component={GoproReel} durationInFrames={Math.min(GOPRO_TL.totalFrames, MAX_FRAMES)} fps={FPS} width={1080} height={1920} defaultProps={{ layout: LAYOUT_9x16 }} />
    <Composition id="GoproReel1x1" component={GoproReel} durationInFrames={Math.min(GOPRO_TL.totalFrames, MAX_FRAMES)} fps={FPS} width={1080} height={1080} defaultProps={{ layout: LAYOUT_1x1 }} />
    <Still id="GoproCover" component={GoproCover} width={1080} height={1920} />
    {/* Meta Quest 3 512GB: over 30 s (standing approval), 9:16 + cover only (the user asked for no 1:1) */}
    <Composition id="QuestReel9x16" component={QuestReel} durationInFrames={QTL.totalFrames} fps={FPS} width={1080} height={1920} defaultProps={{ layout: LAYOUT_9x16 }} />
    <Still id="QuestCover" component={QuestCover} width={1080} height={1920} />
    {/* PlayStation Disc Drive: 30 s, 9:16 + cover only (the user asked for no 1:1) */}
    <Composition id="DiscReel9x16" component={DiscReel} durationInFrames={Math.min(DTL.totalFrames, MAX_FRAMES)} fps={FPS} width={1080} height={1920} defaultProps={{ layout: LAYOUT_9x16 }} />
    <Still id="DiscCover" component={DiscCover} width={1080} height={1920} />
    {/* E-readers (Kobo Libra Colour, Kindle Colorsoft, Kindle Paperwhite): 36.5 s, over 30 s at natural speed (standing approval), so no MAX_FRAMES cap; 9:16 + cover only */}
    <Composition id="ReadersReel9x16" component={ReadersReel} durationInFrames={RTL_READERS.totalFrames} fps={FPS} width={1080} height={1920} defaultProps={{ layout: LAYOUT_9x16 }} />
    <Still id="ReadersCover" component={ReadersCover} width={1080} height={1920} />
    {/* Galaxy Watch9 40mm LTE Black: 30 s, 9:16 + cover only */}
    <Composition id="Watch9Reel9x16" component={Watch9Reel} durationInFrames={Math.min(W9TL.totalFrames, MAX_FRAMES)} fps={FPS} width={1080} height={1920} defaultProps={{ layout: LAYOUT_9x16 }} />
    <Still id="Watch9Cover" component={Watch9Cover} width={1080} height={1920} />
    {/* GoPro HERO10 Black (used unit): 30 s, 9:16 + cover only */}
    <Composition id="Hero10Reel9x16" component={Hero10Reel} durationInFrames={Math.min(H10TL.totalFrames, MAX_FRAMES)} fps={FPS} width={1080} height={1920} defaultProps={{ layout: LAYOUT_9x16 }} />
    <Still id="Hero10Cover" component={Hero10Cover} width={1080} height={1920} />
    {/* G-Tab T13 tablet: 38.5 s, over 30 s at natural speed (standing approval), so no MAX_FRAMES cap; 9:16 + cover only */}
    <Composition id="GtabReel9x16" component={GtabReel} durationInFrames={GTTL.totalFrames} fps={FPS} width={1080} height={1920} defaultProps={{ layout: LAYOUT_9x16 }} />
    <Still id="GtabCover" component={GtabCover} width={1080} height={1920} />
    {/* Redmi 5G comparison (Note 15 / Note 14 Pro+ / Note 14): 39.5 s, over 30 s at natural speed (standing approval), so no MAX_FRAMES cap; 9:16 + cover only */}
    <Composition id="RedmiReel9x16" component={RedmiReel} durationInFrames={RSTL.totalFrames} fps={FPS} width={1080} height={1920} defaultProps={{ layout: LAYOUT_9x16 }} />
    <Still id="RedmiCover" component={RedmiCover} width={1080} height={1920} />
    {/* Amazon Kindle 11th gen 16GB Black: 30 s, 9:16 + cover only */}
    <Composition id="Kindle11Reel9x16" component={Kindle11Reel} durationInFrames={Math.min(K11TL.totalFrames, MAX_FRAMES)} fps={FPS} width={1080} height={1920} defaultProps={{ layout: LAYOUT_9x16 }} />
    <Still id="Kindle11Cover" component={Kindle11Cover} width={1080} height={1920} />
    {/* Samsung Galaxy A07 4GB/64GB: 30 s, 9:16 + cover only */}
    <Composition id="A07Reel9x16" component={A07Reel} durationInFrames={Math.min(A7TL.totalFrames, MAX_FRAMES)} fps={FPS} width={1080} height={1920} defaultProps={{ layout: LAYOUT_9x16 }} />
    <Still id="A07Cover" component={A07Cover} width={1080} height={1920} />
    {/* Apple Watch Ultra 4 49mm Titanium: 37 s, over 30 s at natural speed (standing approval), so no MAX_FRAMES cap; 9:16 + cover only */}
    <Composition id="Ultra4Reel9x16" component={Ultra4Reel} durationInFrames={U4TL.totalFrames} fps={FPS} width={1080} height={1920} defaultProps={{ layout: LAYOUT_9x16 }} />
    <Still id="Ultra4Cover" component={Ultra4Cover} width={1080} height={1920} />
    {/* Razer Hammerhead USB-C ANC: 30 s, 9:16 + cover only */}
    <Composition id="RazerReel9x16" component={RazerReel} durationInFrames={Math.min(RZTL.totalFrames, MAX_FRAMES)} fps={FPS} width={1080} height={1920} defaultProps={{ layout: LAYOUT_9x16 }} />
    <Still id="RazerCover" component={RazerCover} width={1080} height={1920} />
    {/* Mac mini M6 16GB/256GB: 30 s, 9:16 + cover only */}
    <Composition id="MacminiReel9x16" component={MacminiReel} durationInFrames={Math.min(MMTL.totalFrames, MAX_FRAMES)} fps={FPS} width={1080} height={1920} defaultProps={{ layout: LAYOUT_9x16 }} />
    <Still id="MacminiCover" component={MacminiCover} width={1080} height={1920} />
    {/* DJI Osmo 360 Standard Combo: 38.5 s, over 30 s at natural speed (standing approval), so no MAX_FRAMES cap; 9:16 + cover only */}
    <Composition id="Osmo360Reel9x16" component={Osmo360Reel} durationInFrames={O3TL.totalFrames} fps={FPS} width={1080} height={1920} defaultProps={{ layout: LAYOUT_9x16 }} />
    <Still id="Osmo360Cover" component={Osmo360Cover} width={1080} height={1920} />
    {/* Insta360 GO Ultra Creator Bundle: 34 s, over 30 s (standing approval), so no MAX_FRAMES cap; 9:16 + cover only */}
    <Composition id="GoUltraReel9x16" component={GoUltraReel} durationInFrames={GUTL.totalFrames} fps={FPS} width={1080} height={1920} defaultProps={{ layout: LAYOUT_9x16 }} />
    <Still id="GoUltraCover" component={GoUltraCover} width={1080} height={1920} />
    <Still id="CitybotSheet" component={CitybotSheet} width={1920} height={1080} />
  </>
);
