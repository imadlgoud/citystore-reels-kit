"""Timeline for the Samsung Galaxy A16 (4GB / 128GB, Noir) reel -> public/a16/data/timeline.json
(30 s: pause trimming + the max 1.10x pitch-kept speed-up put the VO end at 27.6 s; same schema as scripts/build_timeline.py; shared by the picture and the audio mix).
Scene cuts sit on the 120 BPM beat grid next to sentence breaks; hits land on the half-beat nearest the word
that triggers them."""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
PUB = ROOT / "public" / "a16"
VO = json.loads((PUB / "data" / "vo.json").read_text())
LINES = json.loads((ROOT / "reels" / "a16" / "vo_lines.json").read_text())
FPS, BPM = 30, 120
BEAT = 60 / BPM
TOTAL_FRAMES, HOLD_FROM = 900, 29.0
SCENES = [("hook", 0.0, 2.5), ("intro", 2.5, 8.5), ("screen", 8.5, 12.0), ("cambat", 12.0, 16.25), ("updates", 16.25, 22.0),
          ("trust", 22.0, 25.5), ("cta", 25.5, 27.75), ("end", 27.75, 30.0)]


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


ev = {}
def nth(li, k):
    return VO[li]["start"] + VO[li]["words"][k]["start"]

def word_n(li, needle, n):
    hits = [VO[li]["start"] + w["start"] for w in VO[li]["words"] if needle.lower() in w["word"].lower()]
    return hits[n]

# HOOK - "buy a phone today... it stays new for up to 6 years!": phone slams on "today", NEUF, then a 6-year counter
ev["hook.slam"] = 0.0
ev["hook.botLand"] = 0.3
ev["hook.today"] = q(word_t(0, "اليوم"))
ev["hook.new"] = q(word_t(0, "جديد"))
ev["hook.six"] = q(word_t(0, "6"))
# INTRO
ev["intro.name"] = q(word_t(1, "Galaxy"))
ev["intro.ram"] = q(word_t(1, "4GB"))
ev["intro.sto"] = q(word_t(1, "128GB"))
ev["intro.noir"] = q(word_t(1, "Noir"))
ev["intro.dispo"] = max(q(word_t(1, "disponible")), ev["intro.noir"] + 0.25)
# SCREEN
ev["sc.amoled"] = q(word_t(2, "Super"))
ev["sc.size"] = q(word_t(2, "6.7"))
ev["sc.colors"] = q(word_t(2, "ألوان"))
ev["sc.video"] = q(word_t(2, "للفيديوهات"))
# CAMERA + BATTERY
ev["cb.cam"] = q(word_t(3, "50"))
ev["cb.bat"] = q(word_t(3, "5000"))
ev["cb.day"] = q(word_t(3, "النهار"))
# UPDATES - 6 years of Android updates; stays fast and protected
ev["up.six"] = q(word_t(4, "6"))
ev["up.updates"] = q(word_t(4, "mises"))
ev["up.fast"] = q(word_t(4, "سريع"))
ev["up.safe"] = q(word_t(4, "ومحمي"))
# TRUST
ev["trust.badge"] = 22.0
ev["trust.original"] = q(word_t(5, "original"))
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

sfx = [("blip_jump", ev["hook.botLand"], -14), ("impact", ev["hook.today"], -8), ("shine", ev["hook.new"], -12), ("stamp", ev["hook.six"], -9)]
sfx += [("whoosh", end - 0.3, -9) for _, _, end in SCENES[:-3]]
sfx += [("impact", ev["intro.name"], -7), ("shine", ev["intro.name"] + 0.2, -14), ("pop_big", ev["intro.ram"], -11), ("pop_big", ev["intro.sto"], -11),
        ("pop", ev["intro.noir"], -12), ("pop_big", ev["intro.dispo"], -11)]
sfx += [("pop_big", ev["sc.amoled"], -11), ("hit", ev["sc.size"], -9), ("shine", ev["sc.colors"], -13), ("pop", ev["sc.video"], -12)]
sfx += [("hit", ev["cb.cam"], -9), ("riser_short", ev["cb.bat"] - 0.15, -15), ("pop_big", ev["cb.bat"] + 0.1, -11), ("ding", ev["cb.day"], -12)]
sfx += [("stamp", ev["up.six"], -9), ("whoosh", ev["up.updates"], -12), ("blip_up", ev["up.updates"] + 0.3, -12), ("pop", ev["up.fast"], -12), ("pop", ev["up.safe"], -12)]
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
