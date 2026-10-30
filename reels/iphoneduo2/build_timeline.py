"""Timeline for the iPhone Duo 256GB (Night Sky + Star White) reel -> public/iphoneduo2/data/timeline.json
(30 s: on request, the tightest pauses + a slight 1.06x pitch-kept speed-up put the VO end at 27.5 s; same schema as
scripts/build_timeline.py; shared by the picture and the audio mix). Scene cuts sit on the 120 BPM beat grid next to
sentence breaks; hits land on the half-beat nearest the word that triggers them."""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
PUB = ROOT / "public" / "iphoneduo2"
VO = json.loads((PUB / "data" / "vo.json").read_text())
LINES = json.loads((ROOT / "reels" / "iphoneduo2" / "vo_lines.json").read_text())
FPS, BPM = 30, 120
BEAT = 60 / BPM
TOTAL_FRAMES, HOLD_FROM = 900, 29.0
SCENES = [("hook", 0.0, 3.5), ("intro", 3.5, 6.75), ("folded", 6.75, 10.5), ("open", 10.5, 15.75), ("specs", 15.75, 20.0),
          ("secure", 20.0, 22.25), ("trust", 22.25, 25.5), ("cta", 25.5, 27.75), ("end", 27.75, 30.0)]


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
# HOOK - "the first iPhone that folds... now in two colours at City Store": Star White unfolds, Night Sky joins it
ev["hook.slam"] = 0.0
ev["hook.botLand"] = 0.3
ev["hook.fold"] = q(word_t(0, "كيتطوى"))
ev["hook.two"] = q(word_t(0, "بجوج"))
ev["hook.here"] = q(word_t(0, "City"))
# INTRO - iPhone Duo, 256GB, Night Sky and Star White (+ DISPONIBLE: the hook says "عند City Store")
ev["intro.name"] = q(word_t(1, "iPhone"))
ev["intro.storage"] = q(word_t(1, "256"))
ev["intro.dispo"] = ev["intro.storage"] + 0.5
ev["intro.night"] = q(word_t(1, "Night"))
ev["intro.color"] = q(word_t(1, "Star"))
# FOLDED - 5.4" screen, like a regular iPhone, one hand
ev["fd.fold"] = q(word_t(2, "مطوي"))
ev["fd.size"] = q(word_t(2, "5.4"))
ev["fd.hand"] = q(word_t(2, "فيد"))
# OPEN - 7.6" screen, biggest iPhone screen ever, films / work / games
ev["op.open"] = q(word_t(3, "محلول"))
ev["op.size"] = q(word_t(3, "7.6"))
ev["op.big"] = q(word_t(3, "أكبر"))
ev["op.films"] = q(word_t(3, "للأفلام"))
ev["op.work"] = q(word_t(3, "الخدمة"))
ev["op.games"] = q(word_t(3, "والجيمز"))
# SPECS - A20 Pro, 2 x 48 MP cameras, titanium design
ev["sp.chip"] = q(word_t(4, "A20"))
ev["sp.cams"] = q(word_t(4, "48"))
ev["sp.ti"] = q(word_t(4, "design"))
# SECURE - eSIM, Touch ID
ev["sc.esim"] = q(word_t(5, "eSIM"))
ev["sc.touch"] = q(word_t(5, "Touch"))
# TRUST
ev["trust.badge"] = 22.25
ev["trust.original"] = q(word_t(6, "originaux"))
ev["trust.thumb"] = ev["trust.original"]
ev["trust.checks"] = [q(word_t(6, "boîte")), q(nth(6, 4)), q(nth(6, 6))]
# CTA
ev["cta.url"] = 25.6
ev["cta.message"] = max(25.85, q(word_t(7, "تكوموندي")))
ev["cta.socials"] = ev["cta.message"] + 0.1
ev["cta.wave"] = ev["cta.message"] + 0.25
# END CARD
ev["end.city"] = 27.75
ev["end.typeStart"] = 27.95
ev["end.typeStep"] = 0.05
ev["end.icons"] = 28.35
ev["end.iconStep"] = 0.05
ev["end.tagline"] = 28.6
ev["end.wink"] = 28.9
ev["end.hold"] = HOLD_FROM

sfx = [("blip_jump", ev["hook.botLand"], -14), ("whoosh", ev["hook.fold"] - 0.1, -11), ("impact", ev["hook.fold"] + 0.3, -8), ("pop_big", ev["hook.two"], -10), ("stamp", ev["hook.here"], -9)]
sfx += [("whoosh", end - 0.3, -9) for _, _, end in SCENES[:-3]]
sfx += [("impact", ev["intro.name"], -7), ("shine", ev["intro.name"] + 0.2, -14), ("pop_big", ev["intro.storage"], -11), ("pop_big", ev["intro.dispo"], -11), ("pop", ev["intro.night"], -12), ("pop", ev["intro.color"], -12)]
sfx += [("pop_big", ev["fd.fold"], -11), ("hit", ev["fd.size"], -9), ("pop", ev["fd.hand"], -12)]
sfx += [("whoosh", ev["op.open"] - 0.1, -10), ("hit", ev["op.size"], -8), ("stamp", ev["op.big"], -10), ("pop", ev["op.films"], -12), ("pop", ev["op.work"], -12), ("pop", ev["op.games"], -12)]
sfx += [("hit", ev["sp.chip"], -9), ("shutter", ev["sp.cams"], -11), ("shine", ev["sp.ti"], -13)]
sfx += [("blip_up", ev["sc.esim"], -12), ("ding", ev["sc.touch"] + 0.2, -11)]
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
