"""Timeline for the e-readers comparison reel (Kobo Libra Colour, Kindle Colorsoft, Kindle Paperwhite 12th gen)
-> public/readers/data/timeline.json
(36.5 s: the VO does not fit 30 s even at 1.1x, so the standing approval applies: full VO at natural speed)
(same schema as scripts/build_timeline.py; shared by the picture and the audio mix).
Scene cuts sit on the 120 BPM beat grid next to sentence breaks; hits land on the
half-beat nearest the word that triggers them."""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
PUB = ROOT / "public" / "readers"
VO = json.loads((PUB / "data" / "vo.json").read_text())
LINES = json.loads((ROOT / "reels" / "readers" / "vo_lines.json").read_text())
FPS, BPM = 30, 120
BEAT = 60 / BPM
TOTAL_FRAMES, HOLD_FROM = 1095, 35.5
SCENES = [("hook", 0.0, 4.75), ("kobo", 4.75, 10.5), ("colorsoft", 10.5, 16.5), ("paperwhite", 16.5, 22.5),
          ("eink", 22.5, 26.5), ("trust", 26.5, 30.5), ("cta", 30.5, 33.0), ("end", 33.0, 36.5)]


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
# HOOK - reading on a glaring phone, Citybot's eyes get tired, then the three e-readers fly in
ev["hook.slam"] = 0.0
ev["hook.botLand"] = 0.3
ev["hook.phone"] = q(word_t(0, "فالتيليفون"))
ev["hook.tired"] = q(word_t(0, "وكيعيّيو"))
ev["hook.readers"] = q(word_t(0, "liseuses"))
ev["hook.change"] = q(word_t(0, "يبدّلو"))
ev["hook.reading"] = q(word_t(0, "القراية"))
# PRODUCTS
for key, li in [("kobo", 1), ("colorsoft", 2), ("paperwhite", 3)]:
    ev[f"{key}.name"] = q(VO[li]["start"] + 0.05)
ev["kobo.color"] = q(word_t(1, "écran"))
ev["kobo.buttons"] = q(word_t(1, "boutons"))
ev["kobo.turn"] = q(word_t(1, "تقلب"))
ev["kobo.write"] = q(word_t(1, "تكتب"))
ev["kobo.stylus"] = q(word_t(1, "stylet"))
ev["colorsoft.sto"] = q(word_t(2, "16GB"))
ev["colorsoft.black"] = q(word_t(2, "Black"))
ev["colorsoft.color"] = q(word_t(2, "écran"))
ev["colorsoft.books"] = q(word_t(2, "للكتب"))
ev["colorsoft.comics"] = q(word_t(2, "الكوميكس"))
ev["colorsoft.mags"] = q(word_t(2, "والمجلات"))
ev["paperwhite.gen"] = q(word_t(3, "12e"))
ev["paperwhite.sto"] = q(word_t(3, "16GB"))
ev["paperwhite.black"] = q(word_t(3, "Black"))
ev["paperwhite.fast"] = q(word_t(3, "سريع"))
ev["paperwhite.light"] = q(word_t(3, "خفيف"))
ev["paperwhite.battery"] = q(word_t(3, "وباطري"))
ev["paperwhite.weeks"] = q(word_t(3, "سيمانات"))
# E INK + WATER (all three)
ev["eink.title"] = 22.5
ev["eink.eink"] = q(word_t(4, "Ink"))
ev["eink.eyes"] = q(word_t(4, "كيعييش"))
ev["eink.water"] = q(word_t(4, "ومقاومين"))
# TRUST
ev["trust.badge"] = 26.5
ev["trust.original"] = q(word_t(5, "originaux"))
ev["trust.thumb"] = ev["trust.original"]
ev["trust.checks"] = [q(word_t(5, "boîte")), q(nth(5, 4)), q(nth(5, 6))]
# CTA
ev["cta.url"] = 30.75
ev["cta.message"] = q(word_t(6, "تكوموندي"))
ev["cta.socials"] = ev["cta.message"] + 0.1
ev["cta.wave"] = ev["cta.message"] + 0.25
# END CARD
ev["end.city"] = 33.0
ev["end.typeStart"] = 33.25
ev["end.typeStep"] = 0.0625
ev["end.icons"] = 33.85
ev["end.iconStep"] = 0.06
ev["end.tagline"] = 34.25
ev["end.wink"] = 34.5
ev["end.hold"] = HOLD_FROM

sfx = [("blip_jump", ev["hook.botLand"], -14), ("pop_big", ev["hook.phone"], -12), ("shine", ev["hook.phone"] + 0.1, -16),
       ("hit_small", ev["hook.tired"], -11), ("whoosh", ev["hook.readers"] - 0.25, -10), ("impact", ev["hook.readers"], -8),
       ("riser_short", ev["hook.change"] - 0.2, -15), ("pop", ev["hook.reading"], -12)]
sfx += [("whoosh", end - 0.3, -9) for _, _, end in SCENES[:-3]]
for key in ["kobo", "colorsoft", "paperwhite"]:
    sfx += [("impact", ev[f"{key}.name"], -8), ("shine", ev[f"{key}.name"] + 0.25, -15)]
sfx += [("shine", ev["kobo.color"], -12), ("pop_big", ev["kobo.buttons"], -12), ("tap", ev["kobo.turn"], -10), ("whoosh", ev["kobo.turn"] + 0.05, -16),
        ("riser_short", ev["kobo.write"] - 0.1, -15), ("pop_big", ev["kobo.stylus"], -11)]
sfx += [("pop_big", ev["colorsoft.sto"], -12), ("pop", ev["colorsoft.black"], -13), ("shine", ev["colorsoft.color"], -12),
        ("pop", ev["colorsoft.books"], -12), ("pop", ev["colorsoft.comics"], -12), ("pop", ev["colorsoft.mags"], -12)]
sfx += [("stamp", ev["paperwhite.gen"], -11), ("pop_big", ev["paperwhite.sto"], -12), ("pop", ev["paperwhite.black"], -13),
        ("whoosh", ev["paperwhite.fast"], -12), ("blip_jump", ev["paperwhite.light"], -13), ("blip_up", ev["paperwhite.battery"], -13),
        ("ding", ev["paperwhite.weeks"], -13)]
sfx += [("hit", ev["eink.title"], -8), ("stamp", ev["eink.eink"], -10), ("shine", ev["eink.eyes"], -13), ("pop", ev["eink.water"], -12),
        ("pop", ev["eink.water"] + 0.25, -14), ("pop", ev["eink.water"] + 0.5, -15)]
sfx += [("hit", ev["trust.badge"], -8), ("blip_up", ev["trust.thumb"], -12)] + [("ding", t + 0.15, -12) for t in ev["trust.checks"]]
sfx += [("whoosh", 30.2, -10), ("pop_big", ev["cta.url"], -11), ("pop_big", ev["cta.message"], -11), ("pop", ev["cta.socials"] + 0.2, -13),
        ("blip", ev["cta.wave"], -13)]
sfx += [("whoosh", 32.7, -9), ("impact", ev["end.city"], -5)] + [("tick", ev["end.typeStart"] + i * ev["end.typeStep"], -12) for i in range(8)]
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
