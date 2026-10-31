"""Timeline for the iPhone 15 Pro Max 1TB Blue Titanium (new, sealed) reel -> public/ip15pm/data/timeline.json
(30 s: pause trimming + a light 1.03x pitch-kept speed-up put the VO end at 27.6 s; same schema as
scripts/build_timeline.py; shared by the picture and the audio mix). Scene cuts sit on the 120 BPM beat grid next to
sentence breaks; hits land on the half-beat nearest the word that triggers them."""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
PUB = ROOT / "public" / "ip15pm"
VO = json.loads((PUB / "data" / "vo.json").read_text())
LINES = json.loads((ROOT / "reels" / "ip15pm" / "vo_lines.json").read_text())
FPS, BPM = 30, 120
BEAT = 60 / BPM
TOTAL_FRAMES, HOLD_FROM = 900, 29.0
SCENES = [("hook", 0.0, 5.25), ("intro", 5.25, 7.0), ("titan", 7.0, 11.5), ("chip", 11.5, 14.75), ("camera", 14.75, 19.5),
          ("sim", 19.5, 21.5), ("trust", 21.5, 25.5), ("cta", 25.5, 27.75), ("end", 27.75, 30.0)]


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
# HOOK - "a new iPhone 15 Pro Max, still sealed in its box... in 2026? yes, we have it!"
ev["hook.slam"] = 0.0
ev["hook.botLand"] = 0.3
ev["hook.name"] = q(word_t(0, "15"))
ev["hook.new"] = q(word_t(0, "جديد"))
ev["hook.sealed"] = q(word_t(0, "مسدود"))
ev["hook.year"] = q(word_t(0, "2026"))
ev["hook.yes"] = q(word_t(0, "إيه"))
ev["hook.have"] = q(word_t(0, "كاين"))
# INTRO - 1TB, Blue Titanium (+ DISPONIBLE: "كاين عندنا")
ev["intro.tb"] = q(word_t(1, "1TB"))
ev["intro.blue"] = q(word_t(1, "Blue"))
ev["intro.dispo"] = ev["intro.blue"] + 0.5
# TITANIUM + 6.7" ProMotion screen
ev["ti.design"] = q(word_t(2, "design"))
ev["ti.light"] = q(word_t(2, "خفيف"))
ev["ti.strong"] = q(word_t(2, "وقوي"))
ev["ti.size"] = q(word_t(2, "6.7"))
ev["ti.promo"] = q(word_t(2, "ProMotion"))
# A17 PRO - fast for games, editing and everything
ev["ch.chip"] = q(word_t(3, "A17"))
ev["ch.games"] = q(word_t(3, "فالجيمز"))
ev["ch.edit"] = q(word_t(3, "المونتاج"))
ev["ch.all"] = q(word_t(3, "وكلشي"))
# CAMERA - 48 MP, 5x optical zoom, sharp from afar
ev["cm.mp"] = q(word_t(4, "48"))
ev["cm.zoom"] = q(word_t(4, "zoom"))
ev["cm.x5"] = q(word_t(4, "5"))
ev["cm.far"] = q(word_t(4, "بعيد"))
# SIM CARD + USB-C
ev["sm.sim"] = q(word_t(5, "بالكارط"))
ev["sm.usbc"] = q(word_t(5, "USB-C"))
# TRUST
ev["trust.badge"] = 21.5
ev["trust.original"] = q(word_t(6, "original"))
ev["trust.thumb"] = ev["trust.original"]
ev["trust.checks"] = [q(word_t(6, "boîte")), q(nth(6, 4)), q(nth(6, 6))]
# CTA
ev["cta.url"] = 25.6
ev["cta.message"] = max(25.85, q(word_t(7, "تكوموندي")))
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

sfx = [("blip_jump", ev["hook.botLand"], -14), ("impact", ev["hook.name"], -8), ("pop", ev["hook.new"], -12), ("stamp", ev["hook.sealed"], -9),
       ("pop_big", ev["hook.year"], -11), ("ding", ev["hook.yes"], -11), ("impact", ev["hook.have"], -7), ("shine", ev["hook.have"] + 0.2, -13)]
sfx += [("whoosh", end - 0.3, -9) for _, _, end in SCENES[:-3]]
sfx += [("pop_big", ev["intro.tb"], -10), ("pop", ev["intro.blue"], -12), ("pop_big", ev["intro.dispo"], -11)]
sfx += [("stamp", ev["ti.design"], -10), ("pop", ev["ti.light"], -12), ("hit_small", ev["ti.strong"], -10), ("hit", ev["ti.size"], -9), ("shine", ev["ti.promo"], -12)]
sfx += [("impact", ev["ch.chip"], -8), ("pop", ev["ch.games"], -12), ("pop", ev["ch.edit"], -12), ("pop", ev["ch.all"], -12)]
sfx += [("shutter", ev["cm.mp"], -10), ("riser_short", ev["cm.zoom"], -14), ("hit", ev["cm.x5"], -9), ("shine", ev["cm.far"], -13)]
sfx += [("pop_big", ev["sm.sim"], -11), ("stamp", ev["sm.usbc"], -10)]
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
