"""Timeline for the Redmi Note 15 5G reel -> public/note15/data/timeline.json
(30 s: pause trimming at natural speed puts the VO end at 27.4 s; same schema as scripts/build_timeline.py)."""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
PUB = ROOT / "public" / "note15"
VO = json.loads((PUB / "data" / "vo.json").read_text())
LINES = json.loads((ROOT / "reels" / "note15" / "vo_lines.json").read_text())
FPS, BPM = 30, 120
BEAT = 60 / BPM
TOTAL_FRAMES, HOLD_FROM = 900, 29.0
SCENES = [("hook", 0.0, 4.0), ("intro", 4.0, 8.25), ("ram", 8.25, 13.0), ("net", 13.0, 16.0), ("cam", 16.0, 21.25),
          ("trust", 21.25, 24.75), ("cta", 24.75, 27.75), ("end", 27.75, 30.0)]


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
# HOOK - "your phone got slow and keeps freezing? it's not your fault... time to change it!"
ev["hook.slam"] = 0.0
ev["hook.botLand"] = 0.3
ev["hook.slow"] = q(word_t(0, "كيتقال"))
ev["hook.freeze"] = q(word_t(0, "وكيتبلوكا"))
ev["hook.fault"] = q(word_t(0, "ماشي"))
ev["hook.change"] = q(word_t(0, "وقت"))
# INTRO - Redmi Note 15 5G, the new Redmi, DISPONIBLE
ev["intro.name"] = max(4.1, q(word_t(1, "Redmi")))
ev["intro.g5"] = q(word_t(1, "5G"))
ev["intro.new"] = q(word_t(1, "الجديد"))
ev["intro.dispo"] = q(word_t(1, "disponible"))
# RAM - 8 Go: apps open fast, switch between them without freezing
ev["ram.name"] = max(8.35, q(word_t(2, "8")))
ev["ram.apps"] = q(word_t(2, "التطبيقات"))
ev["ram.fast"] = q(word_t(2, "بالزربة"))
ev["ram.switch"] = q(word_t(2, "وكتدوز"))
ev["ram.nofreeze"] = q(word_t(2, "بلا"))
# 5G - fast internet, video doesn't cut
ev["net.name"] = max(13.1, q(word_t(3, "5G")))
ev["net.fast"] = q(word_t(3, "سريع"))
ev["net.video"] = q(word_t(3, "الفيديو"))
# CAMERA - 108 MP, clear photos, even small details
ev["cam.name"] = max(16.1, q(word_t(4, "caméra")))
ev["cam.mp"] = q(word_t(4, "108"))
ev["cam.clear"] = q(word_t(4, "واضحين"))
ev["cam.detail"] = q(word_t(4, "الديتاي"))
# TRUST (singular, as spoken)
ev["trust.badge"] = 21.25
ev["trust.original"] = q(word_t(5, "original"))
ev["trust.thumb"] = ev["trust.original"]
ev["trust.checks"] = [q(word_t(5, "boîte")), q(nth(5, 4)), q(nth(5, 6))]
# CTA
ev["cta.url"] = 24.85
ev["cta.message"] = max(25.1, q(word_t(5, "تكوموندي")))
ev["cta.socials"] = ev["cta.message"] + 0.1
ev["cta.wave"] = ev["cta.message"] + 0.25
# END CARD (30 s version)
ev["end.city"] = 27.75
ev["end.typeStart"] = 27.95
ev["end.typeStep"] = 0.05
ev["end.icons"] = 28.35
ev["end.iconStep"] = 0.05
ev["end.tagline"] = 28.6
ev["end.wink"] = 28.9
ev["end.hold"] = HOLD_FROM
sfx = [("blip_jump", ev["hook.botLand"], -14), ("hit_small", ev["hook.slow"], -11), ("hit_small", ev["hook.freeze"], -10), ("pop", ev["hook.fault"], -12),
       ("stamp", ev["hook.change"], -9)]
sfx += [("whoosh", end - 0.3, -9) for _, _, end in SCENES[:-3]]
sfx += [("impact", ev["intro.name"], -7), ("pop", ev["intro.g5"], -12), ("shine", ev["intro.new"], -13), ("stamp", ev["intro.dispo"], -10)]
sfx += [("pop_big", ev["ram.name"], -11), ("blip", ev["ram.apps"], -12), ("blip_up", ev["ram.fast"], -12), ("whoosh", ev["ram.switch"], -12), ("ding", ev["ram.nofreeze"], -12)]
sfx += [("pop_big", ev["net.name"], -11), ("blip_up", ev["net.fast"], -12), ("pop", ev["net.video"], -12)]
sfx += [("pop_big", ev["cam.name"], -11), ("hit", ev["cam.mp"], -8), ("shutter", ev["cam.clear"], -12), ("shine", ev["cam.detail"], -12)]
sfx += [("hit", ev["trust.badge"], -8), ("blip_up", ev["trust.thumb"], -12)] + [("ding", t + 0.15, -12) for t in ev["trust.checks"]]
sfx += [("whoosh", 24.45, -10), ("pop_big", ev["cta.url"], -11), ("pop_big", ev["cta.message"], -11), ("pop", ev["cta.socials"] + 0.2, -13),
        ("blip", ev["cta.wave"], -13)]
sfx += [("whoosh", 27.45, -9), ("impact", ev["end.city"], -5)] + [("tick", ev["end.typeStart"] + i * ev["end.typeStep"], -12) for i in range(8)]
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
