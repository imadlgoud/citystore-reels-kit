"""Timeline for the MacBook Air M4 + cadeau surprise AD -> public/adair/data/timeline.json
VO kept at its own pacing (0.13-24.09 s). Phrase windows come from ffmpeg silencedetect on the supplied take
(-33 dB, 70 ms); words inside a phrase are spread by syllables. Ad-style edit: hard cuts on product names, word-by-word
captions, punch zooms on the robot's head turns. 25.0 s (750 frames), final frame held from 24.5 s."""
import json, pathlib, re, sys
ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))
from process_vo import syllables  # noqa: E402

PUB = ROOT / "public" / "adair"
VO = json.loads((PUB / "data" / "vo.json").read_text())
FPS, TOTAL, HOLD = 30, 750, 24.5
f = lambda t: int(round(t * FPS))

# (text, start, end) phrase windows measured on the take
PHRASES = [
    ("MacBook Air M4…", 0.13, 1.55), ("ومعاه cadeau surprise!", 1.78, 3.14), ("وماشي غير هادي،", 3.35, 4.28), ("عندنا كلشي!", 4.51, 5.41),
    ("iPhone،", 5.90, 6.34), ("MacBook،", 6.48, 7.02), ("iPad،", 7.20, 7.66), ("AirPods،", 7.89, 8.40), ("Apple Watch،", 8.63, 9.24),
    ("Samsung،", 9.42, 9.97), ("وحتى le gaming.", 10.23, 11.16),
    ("ومع أول commande ديالك،", 11.55, 12.87), ("كاينة هدية surprise ليك!", 13.19, 14.59),
    ("Produits originaux", 14.98, 16.05), ("avec garantie،", 16.20, 17.02), ("و livraison", 17.26, 17.91), ("partout au Maroc.", 18.14, 19.05),
    ("City Store،", 19.18, 19.87), ("الأصلي ديما.", 20.04, 21.03),
    ("صيفط لينا ميساج،", 21.29, 22.22), ("ولا دخل لـ", 22.38, 23.55), ("citystore.ma", 23.65, 24.08),
]

caps = []
for i, (text, a, b) in enumerate(PHRASES):
    words = text.split()
    w = [max(1, syllables(x)) for x in words]
    tot, acc, ws = sum(w), 0, []
    for x, k in zip(words, w):
        ws.append({"word": x, "start": round(a + (b - a) * acc / tot, 3), "frame": f(a + (b - a) * acc / tot)})
        acc += k
    end = PHRASES[i + 1][1] - 0.02 if i + 1 < len(PHRASES) else HOLD
    caps.append({"text": text, "start": a, "end": round(end, 3), "from": f(a), "to": f(end), "words": ws})

P = {t: a for t, a, _ in PHRASES}
ev = {
    "hook.turn1": 3.33, "hook.turn2": 4.05,  # robot head turns in the retimed hook clip (left, then the slow-mo one)
    "hook.cadeau": P["ومعاه cadeau surprise!"] + 0.55, "hook.out": 5.62,
    "p.iphone": 5.90, "p.macbook": 6.48, "p.ipad": 7.20, "p.airpods": 7.89, "p.watch": 8.63, "p.samsung": 9.42, "p.gaming": 10.23,
    "gift.in": 11.40, "gift.first": 11.95, "gift.shake": 12.5, "gift.open": 13.55, "gift.q": 13.95,
    "trust.orig": 14.98, "trust.gar": 16.20, "trust.liv": 17.26, "trust.maroc": 18.14,
    "end.logo": 19.18, "end.tag": 20.04, "end.cta": 21.29, "end.url": 23.65,
}
SCENES = [("hook", 0, 5.62), ("list", 5.62, 11.40), ("gift", 11.40, 14.85), ("trust", 14.85, 19.12), ("end", 19.12, TOTAL / FPS)]
sfx = [("whoosh", 1.45, -12), ("pop_big", ev["hook.cadeau"], -10), ("shine", ev["hook.cadeau"] + 0.1, -13),
       ("hit_small", ev["hook.turn1"], -11), ("whoosh", ev["hook.turn1"] - 0.05, -14), ("hit", ev["hook.turn2"], -10), ("riser_short", 4.9, -14),
       ("impact", ev["hook.out"], -8)]
sfx += [("hit_small", ev[k], -11) for k in ("p.iphone", "p.macbook", "p.ipad", "p.airpods", "p.watch", "p.samsung")] + [("hit", ev["p.gaming"], -9)]
sfx += [("whoosh", ev["gift.in"] - 0.1, -10), ("tick", ev["gift.shake"], -13), ("tick", ev["gift.shake"] + 0.15, -13), ("tick", ev["gift.shake"] + 0.3, -13),
        ("impact", ev["gift.open"], -8), ("shine", ev["gift.open"] + 0.1, -11), ("pop", ev["gift.q"], -12)]
sfx += [("whoosh", 14.8, -10), ("stamp", ev["trust.orig"], -9), ("stamp", ev["trust.gar"], -9), ("whoosh", ev["trust.liv"], -11), ("ding", ev["trust.maroc"], -12)]
sfx += [("whoosh", 19.05, -9), ("impact", ev["end.logo"], -6), ("shine", ev["end.tag"], -12), ("pop_big", ev["end.cta"], -11)] + \
       [("tick", ev["end.url"] + i * 0.035, -14) for i in range(12)]

tl = {
    "fps": FPS, "bpm": 120, "beatFrames": 15, "totalFrames": TOTAL, "holdFrom": f(HOLD), "musicFirstDownbeat": 0.0,
    "scenes": [{"id": n, "from": f(a), "to": f(b)} for n, a, b in SCENES],
    "events": {k: f(v) for k, v in ev.items()}, "eventsSec": ev,
    "sfx": [{"name": n, "t": round(t, 3), "gainDb": g} for n, t, g in sorted(sfx, key=lambda s: s[1])],
    "subtitles": caps,
    "vo": [{"id": l["id"], "from": f(l["start"]), "start": l["start"], "duration": l["duration"], "mouthCues": l["mouthCues"]} for l in VO],
}
(PUB / "data" / "timeline.json").write_text(json.dumps(tl, ensure_ascii=False, indent=1) + "\n")
print(len(caps), "captions; scenes", [(n, a, b) for n, a, b in SCENES])
