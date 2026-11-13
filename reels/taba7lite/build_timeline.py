"""Timeline for the Samsung Galaxy Tab A7 Lite reel -> public/taba7lite/data/timeline.json
(26.5 s: pause trimming at natural speed puts the VO end at 23.8 s, so the reel ends early instead of padding to 30 s;
same schema as scripts/build_timeline.py; shared by the picture and the audio mix)."""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
PUB = ROOT / "public" / "taba7lite"
VO = json.loads((PUB / "data" / "vo.json").read_text())
LINES = json.loads((ROOT / "reels" / "taba7lite" / "vo_lines.json").read_text())
FPS, BPM = 30, 120
BEAT = 60 / BPM
TOTAL_FRAMES, HOLD_FROM = 795, 25.5
SCENES = [("hook", 0.0, 2.75), ("intro", 2.75, 7.5), ("screen", 7.5, 11.0), ("batt", 11.0, 14.0), ("sound", 14.0, 18.0),
          ("trust", 18.0, 21.5), ("cta", 21.5, 24.25), ("end", 24.25, 26.5)]


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
# HOOK - "don't buy a tablet for the kids or for studying before you see this!"
ev["hook.slam"] = 0.0
ev["hook.botLand"] = 0.3
ev["hook.kids"] = q(word_t(0, "للدراري"))
ev["hook.study"] = q(word_t(0, "للقراية"))
ev["hook.see"] = q(word_t(0, "تشوف"))
# INTRO - Samsung Galaxy Tab A7 Lite, Silver, 32GB, DISPONIBLE
ev["intro.name"] = max(2.85, q(word_t(1, "Samsung")))
ev["intro.model"] = q(word_t(1, "Tab"))
ev["intro.silver"] = q(word_t(1, "Silver"))
ev["intro.gb"] = q(word_t(1, "32GB"))
ev["intro.dispo"] = q(word_t(1, "disponible"))
# SCREEN - 8.7" screen: light, small, easy to hold
ev["sc.name"] = max(7.6, q(word_t(2, "écran")))
ev["sc.size"] = q(word_t(2, "8,7"))
ev["sc.light"] = q(word_t(2, "خفيفة"))
ev["sc.small"] = q(word_t(2, "صغيرة"))
ev["sc.hand"] = q(word_t(2, "وساهلة"))
# BATTERY - big battery: read, watch videos, play all day
ev["bt.name"] = max(11.1, q(word_t(3, "batterie")))
ev["bt.read"] = q(word_t(3, "تقرا"))
ev["bt.video"] = q(word_t(3, "الفيديوهات"))
ev["bt.play"] = q(word_t(3, "وتلعب"))
ev["bt.day"] = q(word_t(3, "نهار"))
# SOUND + STORAGE - Dolby Atmos speakers, add memory with a microSD card
ev["so.name"] = max(14.1, q(word_t(4, "haut-parleurs")))
ev["so.dolby"] = q(word_t(4, "Dolby"))
ev["so.add"] = q(word_t(4, "وتقدر"))
ev["so.sd"] = q(word_t(4, "microSD"))
# TRUST (singular, as spoken)
ev["trust.badge"] = 18.0
ev["trust.original"] = q(word_t(5, "original"))
ev["trust.thumb"] = ev["trust.original"]
ev["trust.checks"] = [q(word_t(5, "boîte")), q(nth(5, 4)), q(nth(5, 6))]
# CTA
ev["cta.url"] = 21.6
ev["cta.message"] = max(21.85, q(word_t(6, "تكوموندي")))
ev["cta.socials"] = ev["cta.message"] + 0.1
ev["cta.wave"] = ev["cta.message"] + 0.25
# END CARD (fast version, shifted to 24.25 s)
ev["end.city"] = 24.25
ev["end.typeStart"] = 24.45
ev["end.typeStep"] = 0.05
ev["end.icons"] = 24.85
ev["end.iconStep"] = 0.05
ev["end.tagline"] = 25.1
ev["end.wink"] = 25.4
ev["end.hold"] = HOLD_FROM
sfx = [("blip_jump", ev["hook.botLand"], -14), ("pop", ev["hook.kids"], -12), ("pop", ev["hook.study"], -12), ("stamp", ev["hook.see"], -9)]
sfx += [("whoosh", end - 0.3, -9) for _, _, end in SCENES[:-3]]
sfx += [("impact", ev["intro.name"], -7), ("shine", ev["intro.model"], -13), ("pop", ev["intro.silver"], -12), ("pop", ev["intro.gb"], -12),
        ("stamp", ev["intro.dispo"], -10)]
sfx += [("pop_big", ev["sc.name"], -11), ("hit", ev["sc.size"], -8), ("pop", ev["sc.light"], -12), ("pop", ev["sc.small"], -12), ("ding", ev["sc.hand"], -12)]
sfx += [("pop_big", ev["bt.name"], -11), ("blip", ev["bt.read"], -12), ("blip", ev["bt.video"], -12), ("blip", ev["bt.play"], -12), ("shine", ev["bt.day"], -12)]
sfx += [("pop_big", ev["so.name"], -11), ("hit_small", ev["so.dolby"], -10), ("whoosh", ev["so.add"], -12), ("blip_up", ev["so.sd"], -12)]
sfx += [("hit", ev["trust.badge"], -8), ("blip_up", ev["trust.thumb"], -12)] + [("ding", t + 0.15, -12) for t in ev["trust.checks"]]
sfx += [("whoosh", 21.2, -10), ("pop_big", ev["cta.url"], -11), ("pop_big", ev["cta.message"], -11), ("pop", ev["cta.socials"] + 0.2, -13),
        ("blip", ev["cta.wave"], -13)]
sfx += [("whoosh", 23.95, -9), ("impact", ev["end.city"], -5)] + [("tick", ev["end.typeStart"] + i * ev["end.typeStep"], -12) for i in range(8)]
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
print({k: v for k, v in ev.items() if not k.startswith("end.")})
