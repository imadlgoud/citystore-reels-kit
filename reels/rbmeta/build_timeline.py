"""Timeline for the Ray-Ban Meta (3rd gen) Wayfarer Matte Black Transitions reel -> public/rbmeta/data/timeline.json
(30 s: pause trimming + the max 1.10x pitch-kept speed-up put the VO end at 28.0 s; same schema as
scripts/build_timeline.py; shared by the picture and the audio mix). Scene cuts sit on the 120 BPM beat grid next to
sentence breaks; hits land on the half-beat nearest the word that triggers them."""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
PUB = ROOT / "public" / "rbmeta"
VO = json.loads((PUB / "data" / "vo.json").read_text())
LINES = json.loads((ROOT / "reels" / "rbmeta" / "vo_lines.json").read_text())
FPS, BPM = 30, 120
BEAT = 60 / BPM
TOTAL_FRAMES, HOLD_FROM = 900, 29.0
SCENES = [("hook", 0.0, 3.75), ("intro", 3.75, 8.5), ("trans", 8.5, 12.25), ("camera", 12.25, 15.75), ("ai", 15.75, 19.5),
          ("battery", 19.5, 22.75), ("trust", 22.75, 26.0), ("cta", 26.0, 28.25), ("end", 28.25, 30.0)]


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
# HOOK - "in the sun they turn into sunglasses, indoors they're normal again... and they have a camera!"
ev["hook.slam"] = 0.0
ev["hook.botLand"] = 0.3
ev["hook.sun"] = 0.25
ev["hook.shades"] = q(word_t(0, "نضاضر"))
ev["hook.inside"] = q(word_t(0, "وفالداخل"))
ev["hook.normal"] = q(word_t(0, "عاديين"))
ev["hook.cam"] = q(word_t(0, "كاميرا"))
# INTRO - Ray-Ban Meta 3rd gen, Wayfarer Matte Black, Transitions lenses, DISPONIBLE
ev["intro.name"] = q(word_t(1, "Ray-Ban"))
ev["intro.gen"] = q(word_t(1, "3e"))
ev["intro.way"] = q(word_t(1, "Wayfarer"))
ev["intro.black"] = q(word_t(1, "Black"))
ev["intro.trans"] = q(word_t(1, "Transitions"))
ev["intro.dispo"] = q(word_t(1, "disponible"))
# TRANSITIONS - tint by themselves with the light: one pair for everywhere
ev["tr.name"] = q(word_t(2, "Transitions"))
ev["tr.auto"] = q(word_t(2, "بوحدهم"))
ev["tr.light"] = q(word_t(2, "الضو"))
ev["tr.one"] = q(word_t(2, "نضاضر"))
ev["tr.every"] = q(word_t(2, "بلاصة"))
# CAMERA - 12 MP, 3K video, film without taking out the phone
ev["cm.mp"] = q(word_t(3, "12"))
ev["cm.vid"] = q(word_t(3, "3K"))
ev["cm.free"] = q(word_t(3, "تحيّد"))
# META AI button + 6 microphones for calls
ev["ai.button"] = q(word_t(4, "bouton"))
ev["ai.meta"] = q(word_t(4, "Meta"))
ev["ai.mics"] = q(word_t(4, "6"))
ev["ai.hear"] = q(word_t(4, "يسمعوك"))
# BATTERY - up to 9 h, the charging case adds up to 50 h
ev["bt.h9"] = q(word_t(5, "9"))
ev["bt.case"] = q(word_t(5, "boîte"))
ev["bt.h50"] = q(word_t(5, "50"))
# TRUST
ev["trust.badge"] = 22.75
ev["trust.original"] = q(word_t(6, "original"))
ev["trust.thumb"] = ev["trust.original"]
ev["trust.checks"] = [q(word_t(6, "boîte")), q(nth(6, 4)), q(nth(6, 6))]
# CTA
ev["cta.url"] = 26.1
ev["cta.message"] = max(26.35, q(word_t(7, "تكوموندي")))
ev["cta.socials"] = ev["cta.message"] + 0.1
ev["cta.wave"] = ev["cta.message"] + 0.25
# END CARD (fast 30 s version)
ev["end.city"] = 28.25
ev["end.typeStart"] = 28.4
ev["end.typeStep"] = 0.05
ev["end.icons"] = 28.6
ev["end.iconStep"] = 0.05
ev["end.tagline"] = 28.8
ev["end.wink"] = 28.9
ev["end.hold"] = HOLD_FROM

sfx = [("blip_jump", ev["hook.botLand"], -14), ("shine", ev["hook.sun"], -12), ("whoosh", ev["hook.shades"], -11), ("whoosh", ev["hook.inside"], -12),
       ("pop", ev["hook.normal"], -12), ("shutter", ev["hook.cam"], -9), ("impact", ev["hook.cam"] + 0.15, -9)]
sfx += [("whoosh", end - 0.3, -9) for _, _, end in SCENES[:-3]]
sfx += [("impact", ev["intro.name"], -7), ("shine", ev["intro.name"] + 0.2, -14), ("pop_big", ev["intro.gen"], -11), ("pop", ev["intro.way"], -12), ("pop", ev["intro.black"], -12),
        ("pop_big", ev["intro.trans"], -11), ("pop_big", ev["intro.dispo"], -11)]
sfx += [("stamp", ev["tr.name"], -10), ("riser_short", ev["tr.auto"], -14), ("shine", ev["tr.light"], -12), ("pop", ev["tr.one"], -12), ("ding", ev["tr.every"], -11)]
sfx += [("shutter", ev["cm.mp"], -10), ("hit", ev["cm.vid"], -9), ("pop", ev["cm.free"], -12)]
sfx += [("blip", ev["ai.button"], -11), ("blip_up", ev["ai.meta"], -12), ("pop_big", ev["ai.mics"], -11), ("pop", ev["ai.hear"], -12)]
sfx += [("pop_big", ev["bt.h9"], -11), ("whoosh", ev["bt.case"], -12), ("hit", ev["bt.h50"], -9)]
sfx += [("hit", ev["trust.badge"], -8), ("blip_up", ev["trust.thumb"], -12)] + [("ding", t + 0.15, -12) for t in ev["trust.checks"]]
sfx += [("whoosh", 25.7, -10), ("pop_big", ev["cta.url"], -11), ("pop_big", ev["cta.message"], -11), ("pop", ev["cta.socials"] + 0.2, -13),
        ("blip", ev["cta.wave"], -13)]
sfx += [("whoosh", 27.95, -9), ("impact", ev["end.city"], -5)] + [("tick", ev["end.typeStart"] + i * ev["end.typeStep"], -12) for i in range(8)]
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
