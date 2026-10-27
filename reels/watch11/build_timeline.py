"""Timeline for the Apple Watch Series 11 46mm reel -> public/watch11/data/timeline.json
(30 s: pause trimming only, natural speed, VO ends at 26.4 s, then the end card; same schema as
scripts/build_timeline.py; shared by the picture and the audio mix).
Scene cuts sit on the 120 BPM beat grid next to sentence breaks; hits land on the half-beat nearest the word that
triggers them."""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
PUB = ROOT / "public" / "watch11"
VO = json.loads((PUB / "data" / "vo.json").read_text())
LINES = json.loads((ROOT / "reels" / "watch11" / "vo_lines.json").read_text())
FPS, BPM = 30, 120
BEAT = 60 / BPM
TOTAL_FRAMES, HOLD_FROM = 900, 29.0
SCENES = [("hook", 0.0, 3.5), ("intro", 3.5, 7.75), ("battery", 7.75, 11.0), ("sleep", 11.0, 17.0), ("display", 17.0, 21.0),
          ("trust", 21.0, 24.0), ("cta", 24.0, 27.0), ("end", 27.0, 30.0)]


def f(t):
    return int(round(t * FPS))


def q(t, grid=BEAT / 2):
    return round(round(t / grid) * grid, 4)


def word_t(li, needle):
    line = VO[li]
    for w in line["words"]:
        if needle.lower() in w["word"].lower():
            return line["start"] + w["start"]
    raise KeyError(f"{needle!r} not in {line['id']}")


def nth(li, k):
    return VO[li]["start"] + VO[li]["words"][k]["start"]


ev = {}
# HOOK - "no need to buy the latest model to get a great Apple Watch!": "DERNIER MODÈLE" price tag crossed out, then the trio
ev["hook.slam"] = 0.0
ev["hook.botLand"] = 0.3
ev["hook.latest"] = q(word_t(0, "آخر"))
ev["hook.watch"] = q(word_t(0, "Apple"))
ev["hook.great"] = q(word_t(0, "واعرة"))
# INTRO - Apple Watch Series 11, 46 mm, DISPONIBLE
ev["intro.name"] = q(word_t(1, "Apple"))
ev["intro.series"] = q(word_t(1, "Series"))
ev["intro.size"] = q(word_t(1, "46"))
ev["intro.dispo"] = q(word_t(1, "disponible"))
# BATTERY - up to 24 h, fast charging
ev["bt.battery"] = q(word_t(2, "باطري"))
ev["bt.hours"] = q(word_t(2, "24"))
ev["bt.charge"] = q(word_t(2, "وكتشارجا"))
ev["bt.fast"] = q(word_t(2, "بسرعة"))
# SLEEP SCORE + high blood pressure alert
ev["sl.score"] = q(word_t(3, "Sleep"))
ev["sl.note"] = q(word_t(3, "نقطة"))
ev["sl.morning"] = q(word_t(3, "صباح"))
ev["sl.alert"] = q(word_t(3, "وكتنبّهك"))
ev["sl.tension"] = q(word_t(3, "الطونسيون"))
ev["sl.high"] = q(word_t(3, "مرتفعة"))
# DISPLAY - big strong screen, water resistant, heart + workouts
ev["dp.screen"] = q(word_t(4, "écran"))
ev["dp.strong"] = q(word_t(4, "وقوي"))
ev["dp.water"] = q(word_t(4, "مقاومة"))
ev["dp.heart"] = q(word_t(4, "القلب"))
ev["dp.sport"] = q(word_t(4, "والرياضة"))
# TRUST - "Produit original, neuf, jamais utilisé" (two checks, as spoken)
ev["trust.badge"] = 21.0
ev["trust.original"] = q(word_t(5, "Produit"))
ev["trust.thumb"] = ev["trust.original"]
ev["trust.checks"] = [q(word_t(5, "neuf")), q(word_t(5, "jamais"))]
# CTA
ev["cta.url"] = 24.1
ev["cta.message"] = max(24.35, q(word_t(6, "تكوموندي")))
ev["cta.socials"] = ev["cta.message"] + 0.1
ev["cta.wave"] = ev["cta.message"] + 0.25
# END CARD
ev["end.city"] = 27.0
ev["end.typeStart"] = 27.2
ev["end.typeStep"] = 0.06
ev["end.icons"] = 27.75
ev["end.iconStep"] = 0.06
ev["end.tagline"] = 28.15
ev["end.wink"] = 28.4
ev["end.hold"] = HOLD_FROM

sfx = [("blip_jump", ev["hook.botLand"], -14), ("pop_big", ev["hook.latest"], -11), ("hit_small", ev["hook.latest"] + 0.4, -10),
       ("impact", ev["hook.watch"], -8), ("stamp", ev["hook.great"], -9)]
sfx += [("whoosh", end - 0.3, -9) for _, _, end in SCENES[:-3]]
sfx += [("impact", ev["intro.name"], -7), ("shine", ev["intro.name"] + 0.2, -14), ("pop_big", ev["intro.series"], -11), ("pop_big", ev["intro.size"], -11), ("pop_big", ev["intro.dispo"], -11)]
sfx += [("pop_big", ev["bt.battery"], -11), ("riser_short", ev["bt.hours"] - 0.15, -15), ("hit", ev["bt.hours"] + 0.1, -9), ("whoosh", ev["bt.charge"], -12), ("ding", ev["bt.fast"], -11)]
sfx += [("pop_big", ev["sl.score"], -11), ("blip_up", ev["sl.note"], -12), ("shine", ev["sl.morning"], -13), ("blip", ev["sl.alert"], -11), ("pop", ev["sl.tension"], -12), ("hit_small", ev["sl.high"], -10)]
sfx += [("pop_big", ev["dp.screen"], -11), ("stamp", ev["dp.strong"], -10), ("pop", ev["dp.water"], -12), ("pop", ev["dp.heart"], -12), ("pop", ev["dp.sport"], -12)]
sfx += [("hit", ev["trust.badge"], -8), ("blip_up", ev["trust.thumb"], -12)] + [("ding", t + 0.15, -12) for t in ev["trust.checks"]]
sfx += [("whoosh", 23.7, -10), ("pop_big", ev["cta.url"], -11), ("pop_big", ev["cta.message"], -11), ("pop", ev["cta.socials"] + 0.2, -13),
        ("blip", ev["cta.wave"], -13)]
sfx += [("whoosh", 26.7, -9), ("impact", ev["end.city"], -5)] + [("tick", ev["end.typeStart"] + i * ev["end.typeStep"], -12) for i in range(8)]
sfx += [("pop", ev["end.icons"] + i * ev["end.iconStep"], -15) for i in range(6)]
sfx += [("shine", ev["end.tagline"], -14), ("blip_wink", ev["end.wink"], -11)]


def chunk_line(line, explicit):
    words, chunks, i = line["words"], [], 0
    for text in explicit:
        n, c = len(text.split()), []
        while i < len(words) and len(" ".join(x["word"] for x in c).split()) < n:
            c.append(words[i])
            i += 1
        chunks.append(c)
    out = [{"text": " ".join(x["word"] for x in c), "start": round(line["start"] + c[0]["start"], 3),
            "end": round(line["start"] + c[-1]["end"], 3),
            "words": [{"word": x["word"], "start": round(line["start"] + x["start"], 3)} for x in c]} for c in chunks if c]
    for k, c in enumerate(out):
        c["end"] = round(out[k + 1]["start"] if k + 1 < len(out) else c["end"] + 0.35, 3)
    return out


subs = []
for li, line in enumerate(VO):
    nxt = VO[li + 1]["start"] if li + 1 < len(VO) else HOLD_FROM
    for c in chunk_line(line, LINES[li]["chunks"]):
        c["end"] = min(c["end"], nxt - 0.02, HOLD_FROM)
        c["line"] = li
        subs.append(c)

timeline = {
    "fps": FPS, "bpm": BPM, "beatFrames": BEAT * FPS, "totalFrames": TOTAL_FRAMES, "holdFrom": f(HOLD_FROM),
    "musicFirstDownbeat": 1.5,
    "scenes": [{"id": n, "from": f(a), "to": f(b)} for n, a, b in SCENES],
    "events": {k: ([f(x) for x in v] if isinstance(v, list) else (v if k.endswith("Step") else f(v))) for k, v in ev.items()},
    "eventsSec": ev,
    "sfx": [{"name": n, "t": round(t, 3), "gainDb": g} for n, t, g in sorted(sfx, key=lambda s: s[1])],
    "subtitles": [{**s, "from": f(s["start"]), "to": f(s["end"]), "words": [{**w, "frame": f(w["start"])} for w in s["words"]]} for s in subs],
    "vo": [{"id": l["id"], "from": f(l["start"]), "start": l["start"], "duration": l["duration"], "mouthCues": l["mouthCues"]} for l in VO],
}
assert VO[-1]["start"] + VO[-1]["duration"] <= HOLD_FROM + 0.01, "VO must end before the final-frame hold"
(PUB / "data" / "timeline.json").write_text(json.dumps(timeline, ensure_ascii=False, indent=1) + "\n")
for s in timeline["subtitles"]:
    print(f'{s["start"]:6.2f}-{s["end"]:6.2f}  {s["text"]}')
print({k: v for k, v in ev.items() if not k.startswith(("end.", "hook."))})
