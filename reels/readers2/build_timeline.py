"""Timeline for the e-readers reel (Kindle 11th gen Vert + Noir, Kobo Libra Colour Noir) -> public/readers2/data/timeline.json
(30 s: pause trimming only, natural speed, VO ends at 27.5 s; same schema as scripts/build_timeline.py; shared by the
picture and the audio mix). Scene cuts sit on the 120 BPM beat grid next to sentence breaks; hits land on the half-beat
nearest the word that triggers them."""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
PUB = ROOT / "public" / "readers2"
VO = json.loads((PUB / "data" / "vo.json").read_text())
LINES = json.loads((ROOT / "reels" / "readers2" / "vo_lines.json").read_text())
FPS, BPM = 30, 120
BEAT = 60 / BPM
TOTAL_FRAMES, HOLD_FROM = 900, 29.0
SCENES = [("hook", 0.0, 3.25), ("intro", 3.25, 5.0), ("kindle", 5.0, 12.0), ("kobo", 12.0, 17.0), ("eink", 17.0, 21.75),
          ("trust", 21.75, 25.5), ("cta", 25.5, 27.75), ("end", 27.75, 30.0)]


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
# HOOK - "if you read on your phone and your eyes get tired, this video is for you!"
ev["hook.slam"] = 0.0
ev["hook.botLand"] = 0.3
ev["hook.phone"] = q(word_t(0, "فالتيليفون"))
ev["hook.tired"] = q(word_t(0, "وكيعياو"))
ev["hook.eyes"] = q(word_t(0, "عينيك"))
ev["hook.you"] = q(word_t(0, "ليك!"))
# INTRO - some of the best e-readers we have, DISPONIBLES
ev["intro.best"] = q(word_t(1, "أحسن"))
ev["intro.readers"] = q(word_t(1, "liseuses"))
ev["intro.dispo"] = q(word_t(1, "عندنا"))
# KINDLE 11th gen - 16GB, Vert + Noir, small, light, pocketable, up to 6 weeks
ev["kd.name"] = q(word_t(2, "Kindle"))
ev["kd.gen"] = q(word_t(2, "11e"))
ev["kd.gb"] = q(word_t(2, "16GB"))
ev["kd.green"] = q(word_t(2, "Vert"))
ev["kd.black"] = q(word_t(2, "Noir"))
ev["kd.light"] = q(word_t(2, "خفيف"))
ev["kd.pocket"] = q(word_t(2, "فالجيب"))
ev["kd.weeks"] = q(word_t(2, "semaines") - 0.2)  # "6" alone would match "16GB"
# KOBO LIBRA COLOUR - Noir, 7" colour screen, page-turn buttons, water resistant
ev["kb.name"] = q(word_t(3, "Kobo"))
ev["kb.black"] = q(word_t(3, "Noir"))
ev["kb.size"] = q(word_t(3, "7"))
ev["kb.colour"] = q(word_t(3, "بالألوان"))
ev["kb.buttons"] = q(word_t(3, "boutons"))
ev["kb.page"] = q(word_t(3, "الصفحة"))
ev["kb.water"] = q(word_t(3, "ومقاوم"))
# BOTH - E Ink screen easy on the eyes, built-in light to read at night
ev["ei.all"] = q(word_t(4, "وكاملين"))
ev["ei.eink"] = q(word_t(4, "E"))
ev["ei.eyes"] = q(word_t(4, "العينين"))
ev["ei.light"] = q(word_t(4, "lumière"))
ev["ei.night"] = q(word_t(4, "فالليل"))
# TRUST
ev["trust.badge"] = 21.75
ev["trust.original"] = q(word_t(5, "originaux"))
ev["trust.thumb"] = ev["trust.original"]
ev["trust.checks"] = [q(word_t(5, "boîte")), q(nth(5, 4)), q(nth(5, 6))]
# CTA
ev["cta.url"] = 25.6
ev["cta.message"] = max(25.85, q(word_t(6, "تكوموندي")))
ev["cta.socials"] = ev["cta.message"] + 0.1
ev["cta.wave"] = ev["cta.message"] + 0.25
# END CARD (fast 30 s version)
ev["end.city"] = 27.75
ev["end.typeStart"] = 27.95
ev["end.typeStep"] = 0.05
ev["end.icons"] = 28.35
ev["end.iconStep"] = 0.05
ev["end.tagline"] = 28.6
ev["end.wink"] = 28.9
ev["end.hold"] = HOLD_FROM

sfx = [("blip_jump", ev["hook.botLand"], -14), ("pop", ev["hook.phone"], -12), ("hit_small", ev["hook.tired"], -10), ("blip", ev["hook.eyes"], -12),
       ("impact", ev["hook.you"], -8), ("shine", ev["hook.you"] + 0.2, -13)]
sfx += [("whoosh", end - 0.3, -9) for _, _, end in SCENES[:-3]]
sfx += [("pop_big", ev["intro.best"], -11), ("pop_big", ev["intro.readers"], -11), ("stamp", ev["intro.dispo"], -10)]
sfx += [("impact", ev["kd.name"], -8), ("pop", ev["kd.gen"], -12), ("pop_big", ev["kd.gb"], -11), ("pop", ev["kd.green"], -12), ("pop", ev["kd.black"], -12),
        ("pop", ev["kd.light"], -12), ("whoosh", ev["kd.pocket"], -12), ("hit", ev["kd.weeks"], -9)]
sfx += [("impact", ev["kb.name"], -8), ("pop", ev["kb.black"], -12), ("hit", ev["kb.size"], -9), ("shine", ev["kb.colour"], -12), ("blip", ev["kb.buttons"], -11),
        ("whoosh", ev["kb.page"], -12), ("whoosh", ev["kb.water"], -12)]
sfx += [("stamp", ev["ei.all"], -10), ("pop_big", ev["ei.eink"], -11), ("shine", ev["ei.eyes"], -13), ("blip_up", ev["ei.light"], -12), ("pop", ev["ei.night"], -12)]
sfx += [("hit", ev["trust.badge"], -8), ("blip_up", ev["trust.thumb"], -12)] + [("ding", t + 0.15, -12) for t in ev["trust.checks"]]
sfx += [("whoosh", 25.2, -10), ("pop_big", ev["cta.url"], -11), ("pop_big", ev["cta.message"], -11), ("pop", ev["cta.socials"] + 0.2, -13),
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
print({k: v for k, v in ev.items() if not k.startswith(("end.", "hook."))})
