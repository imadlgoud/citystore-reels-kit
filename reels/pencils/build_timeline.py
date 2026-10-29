"""Timeline for the Apple Pencil range reel (Pro, 2nd gen, 1st gen, USB-C) -> public/pencils/data/timeline.json
(36.5 s: trimmed VO is 33.1 s and even 1.10x would end at 30.1 s, so the standing over-30 s rule applies: natural speed;
same schema as scripts/build_timeline.py; shared by the picture and the audio mix). Scene cuts sit on the 120 BPM beat
grid next to sentence breaks; hits land on the half-beat nearest the word that triggers them."""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
PUB = ROOT / "public" / "pencils"
VO = json.loads((PUB / "data" / "vo.json").read_text())
LINES = json.loads((ROOT / "reels" / "pencils" / "vo_lines.json").read_text())
FPS, BPM = 30, 120
BEAT = 60 / BPM
TOTAL_FRAMES, HOLD_FROM = 1095, 35.5
SCENES = [("hook", 0.0, 5.5), ("pro", 5.5, 10.5), ("gen2", 10.5, 16.0), ("gen1", 16.0, 20.5), ("usbc", 20.5, 25.75),
          ("trust", 25.75, 29.5), ("cta", 29.5, 33.5), ("end", 33.5, 36.5)]


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
# HOOK - "an Apple Pencil, but which one fits your iPad? here are all four, available here:"
ev["hook.slam"] = 0.0
ev["hook.botLand"] = 0.3
ev["hook.pencil"] = q(word_t(0, "Pencil"))
ev["hook.unsure"] = q(word_t(0, "عارفش"))
ev["hook.ipad"] = q(word_t(0, "الآيباد"))
ev["hook.here"] = q(word_t(0, "هاهوما"))
ev["hook.four"] = q(word_t(0, "بربعة"))
ev["hook.dispo"] = q(word_t(0, "disponibles"))
# PRO - squeeze to switch tools, barrel roll like a real pen, magnetic charging
ev["pro.name"] = q(word_t(1, "Apple"))
ev["pro.squeeze"] = q(word_t(1, "كتزيرها"))
ev["pro.tools"] = q(word_t(1, "الأدوات"))
ev["pro.roll"] = q(word_t(1, "كتدوّرها"))
ev["pro.pen"] = q(word_t(1, "ستيلو"))
ev["pro.charge"] = q(word_t(1, "وكتشارجا"))
# 2ND GEN - pressure sensitive, double tap, attaches + charges on the side of the iPad
ev["g2.name"] = q(word_t(2, "Apple"))
ev["g2.press"] = q(word_t(2, "sensible"))
ev["g2.tap"] = q(word_t(2, "double"))
ev["g2.stick"] = q(word_t(2, "وكتلصق"))
ev["g2.side"] = q(word_t(2, "فجنب"))
# 1ST GEN - pressure sensitive, for older iPads
ev["g1.name"] = q(word_t(3, "Apple"))
ev["g1.press"] = q(word_t(3, "sensible"))
ev["g1.old"] = q(word_t(3, "للآيبادات"))
# USB-C - the cheapest, good for writing and notes, charges with a USB-C cable
ev["uc.name"] = q(word_t(4, "Apple"))
ev["uc.cheap"] = q(word_t(4, "الأرخص"))
ev["uc.notes"] = q(word_t(4, "للكتابة"))
ev["uc.cable"] = q(word_t(4, "بالكابل"))
# TRUST (plural, as spoken)
ev["trust.badge"] = 25.75
ev["trust.original"] = q(word_t(5, "originaux"))
ev["trust.thumb"] = ev["trust.original"]
ev["trust.checks"] = [q(word_t(5, "boîte")), q(nth(5, 4)), q(nth(5, 6))]
# CTA - "send us your iPad model and we'll tell you which one fits"
ev["cta.url"] = 29.6
ev["cta.message"] = max(29.85, q(word_t(6, "الموديل")))
ev["cta.socials"] = ev["cta.message"] + 0.1
ev["cta.wave"] = ev["cta.message"] + 0.25
# END CARD
ev["end.city"] = 33.5
ev["end.typeStart"] = 33.7
ev["end.typeStep"] = 0.06
ev["end.icons"] = 34.25
ev["end.iconStep"] = 0.06
ev["end.tagline"] = 34.65
ev["end.wink"] = 34.9
ev["end.hold"] = HOLD_FROM

sfx = [("blip_jump", ev["hook.botLand"], -14), ("pop_big", ev["hook.pencil"], -11), ("blip", ev["hook.unsure"], -12), ("pop", ev["hook.ipad"], -12),
       ("whoosh", ev["hook.here"], -11)] + [("pop_big", ev["hook.four"] + i * 0.12, -12) for i in range(4)] + [("stamp", ev["hook.dispo"], -10)]
sfx += [("whoosh", end - 0.3, -9) for _, _, end in SCENES[:-3]]
sfx += [("impact", ev["pro.name"], -8), ("shine", ev["pro.name"] + 0.2, -14), ("pop_big", ev["pro.squeeze"], -11), ("pop", ev["pro.tools"], -12),
        ("whoosh", ev["pro.roll"], -12), ("pop", ev["pro.pen"], -12), ("stamp", ev["pro.charge"], -10)]
sfx += [("impact", ev["g2.name"], -8), ("pop_big", ev["g2.press"], -11), ("blip", ev["g2.tap"], -11), ("blip", ev["g2.tap"] + 0.15, -11),
        ("whoosh", ev["g2.stick"], -12), ("stamp", ev["g2.side"], -10)]
sfx += [("impact", ev["g1.name"], -8), ("pop_big", ev["g1.press"], -11), ("pop", ev["g1.old"], -12)]
sfx += [("impact", ev["uc.name"], -8), ("ding", ev["uc.cheap"], -11), ("pop", ev["uc.notes"], -12), ("stamp", ev["uc.cable"], -10)]
sfx += [("hit", ev["trust.badge"], -8), ("blip_up", ev["trust.thumb"], -12)] + [("ding", t + 0.15, -12) for t in ev["trust.checks"]]
sfx += [("whoosh", 29.2, -10), ("pop_big", ev["cta.url"], -11), ("pop_big", ev["cta.message"], -11), ("pop", ev["cta.socials"] + 0.2, -13),
        ("blip", ev["cta.wave"], -13)]
sfx += [("whoosh", 33.2, -9), ("impact", ev["end.city"], -5)] + [("tick", ev["end.typeStart"] + i * ev["end.typeStep"], -12) for i in range(8)]
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
