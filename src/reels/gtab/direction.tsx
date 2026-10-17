import { interpolate } from "remotion";
import { clamp, Direction, Gesture, kf } from "../../components/CitybotActor";
import { Expression } from "../../citybot/Citybot";
import { gtev, gtscene, GTTL } from "./timeline";

// Citybot's acting for the G-Tab T13 reel: shows off the big tablet, cheers at "BON PRIX", then presents each
// feature from the corner.
const intro = gtscene("intro"), screen = gtscene("screen"), lte = gtscene("lte"), and = gtscene("android"), bat = gtscene("battery");
const trust = gtscene("trust"), cta = gtscene("cta"), end = gtscene("end");
const big = gtev("hook.big"), ok = gtev("hook.ok");

const gestures: Gesture[] = [
  { from: big, to: gtev("hook.sim") - 2, arm: "left", pose: { rot: 150, hand: "open" }, osc: 6 }, // "this big!"
  { from: big, to: gtev("hook.sim") - 2, arm: "right", pose: { rot: 150, hand: "open" }, osc: 6 },
  { from: gtev("hook.sim"), to: ok - 2, arm: "right", pose: { rot: 120, hand: "point" }, osc: 4 },
  { from: ok, to: intro.from + 2, arm: "right", pose: { rot: 72, hand: "thumb" } },
  ...[intro, screen, lte, and, bat].map((s) => ({ from: s.from + 6, to: s.to - 4, arm: "right" as const, pose: { rot: 140, hand: "point" as const }, osc: 3 })),
  { from: gtev("and.kids"), to: gtev("and.split") - 2, arm: "left", pose: { rot: 130, hand: "wave" }, osc: 18 },
  { from: gtev("bat.bat"), to: gtev("bat.sd") - 2, arm: "left", pose: { rot: 160, hand: "fist" } },
  { from: trust.from + 2, to: gtev("trust.thumb") - 3, arm: "right", pose: { rot: 140, hand: "point" }, osc: 3 },
  { from: gtev("trust.thumb") - 3, to: trust.to - 4, arm: "right", pose: { rot: 72, hand: "thumb" } },
  { from: cta.from + 2, to: gtev("cta.wave") - 2, arm: "right", pose: { rot: 140, hand: "point" }, osc: 3 },
  { from: gtev("cta.wave"), to: cta.to - 2, arm: "right", pose: { rot: 122, hand: "wave" }, osc: 20 },
  { from: end.from + 4, to: gtev("end.wink") - 2, arm: "left", pose: { rot: 120, hand: "wave" }, osc: 18 },
  { from: gtev("end.wink"), to: GTTL.totalFrames + 60, arm: "right", pose: { rot: 72, hand: "thumb" } },
];

const expressionAt = (f: number): Expression => {
  if (f < intro.from) return f >= ok ? "excited" : f >= big ? "happy" : "neutral";
  if (f >= gtev("end.wink")) return "wink";
  if (f >= end.from) return "happy";
  if (f >= gtev("cta.wave") && f < cta.to) return "happy";
  if (f >= gtev("trust.thumb") && f < trust.to) return "proud";
  if (f >= gtev("bat.bat") && f < bat.to) return "excited";
  if (f >= gtev("and.kids") && f < and.to) return "happy";
  if (f >= gtev("lte.conn") && f < lte.to) return "happy";
  if (f >= gtev("sc.size") && f < screen.to) return "happy";
  return "neutral";
};

export const gtabDirection: Direction = {
  gestures,
  expressionAt,
  cornerFrom: intro.from - 3,
  endFrom: end.from - 2,
  hops: [
    { at: big, dur: 10, height: 40 },
    { at: ok, dur: 12, height: 60 },
    { at: gtev("sc.size"), dur: 10, height: 34 },
    { at: gtev("lte.conn"), dur: 10, height: 34 },
    { at: gtev("and.kids"), dur: 12, height: 44 },
    { at: gtev("bat.bat"), dur: 12, height: 50 },
    { at: gtev("trust.thumb"), dur: 10, height: 40 },
    { at: end.from + 3, dur: 12, height: 56 },
  ],
  squashAt: (f) => interpolate(f, [0, 7, 12, 15, 20], [1.22, 1.12, 0.84, 1.05, 1], clamp) * interpolate(f - ok, [0, 3, 8, 12], [1, 0.86, 1.05, 1], clamp),
  tiltAt: (f) =>
    f < intro.from
      ? kf(f, [[0, 0], [big, 0], [big + 6, -6], [ok, -4], [ok + 8, 6], [intro.from, 4]])
      : kf(f, [[intro.from, 4], [intro.from + 12, 8], [trust.from, 8], [trust.from + 8, 4], [end.from, 4], [end.from + 8, -6], [gtev("end.wink") - 3, -6], [gtev("end.wink") + 3, 7]]),
  lookAt: (f) => {
    if (f < intro.from) return { x: Math.sin(f * 0.05) * 0.3, y: -0.7 };
    if (f < end.from) return { x: kf(f, [[intro.from, 0], [intro.from + 10, 0.75]]), y: kf(f, [[intro.from, 0], [intro.from + 10, -0.6]]) };
    return { x: kf(f, [[end.from, 0.5], [gtev("end.wink") - 4, 0.5], [gtev("end.wink"), 0]]), y: kf(f, [[end.from, -0.8], [gtev("end.wink") - 4, -0.8], [gtev("end.wink"), 0]]) };
  },
  flashAt: (f) => Math.max(interpolate(f, [11, 12, 20], [0, 1, 0], clamp), interpolate(f, [ok, ok + 1, ok + 8], [0, 0.8, 0], clamp)),
};
