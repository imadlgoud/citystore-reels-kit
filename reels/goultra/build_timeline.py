"""Timeline for the Insta360 GO Ultra Creator Bundle reel -> public/goultra/data/timeline.json
(34 s: even with the tightest pauses and the max 1.10x speed-up the VO ends at 30.6 s, so the standing over-30 s
approval applies; same schema as scripts/build_timeline.py; shared by the picture and the audio mix).
Scene cuts sit on the 120 BPM beat grid next to sentence breaks; hits land on the half-beat nearest the word that
triggers them."""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
PUB = ROOT / "public" / "goultra"
VO = json.loads((PUB / "data" / "vo.json").read_text())
LINES = json.loads((ROOT / "reels" / "goultra" / "vo_lines.json").read_text())
FPS, BPM = 30, 120
BEAT = 60 / BPM
TOTAL_FRAMES, HOLD_FROM = 1020, 33.0
SCENES = [("hook", 0.0, 2.75), ("intro", 2.75, 8.0), ("magnet", 8.0, 13.0), ("video", 13.0, 17.0), ("pod", 17.0, 21.5),
          ("tripod", 21.5, 25.5), ("trust", 25.5, 28.5), ("cta", 28.5, 31.0), ("end", 31.0, 34.0)]


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
# HOOK - "film or live the moment?": a phone held up blocks the view (crossed out), then the tiny camera clips on
ev["hook.slam"] = 0.0
ev["hook.botLand"] = 0.3
ev["hook.film"] = q(word_t(0, "كتصوّر"))
ev["hook.live"] = q(word_t(0, "كتعيش"))
ev["hook.both"] = q(word_t(0, "بجوج"))
# INTRO
ev["intro.name"] = q(word_t(1, "Insta360"))
ev["intro.bundle"] = q(word_t(1, "Creator"))
ev["intro.tripod"] = q(word_t(1, "Tripod"))
ev["intro.dispo"] = q(word_t(1, "disponible"))
# MAGNET
ev["mg.small"] = q(word_t(2, "صغيرة"))
ev["mg.clip"] = q(word_t(2, "كتلصقها"))
ev["mg.pov"] = q(word_t(2, "كتشوف"))
ev["mg.hands"] = q(word_t(2, "فيدك"))
# VIDEO
ev["vd.4k"] = q(word_t(3, "4K"))
ev["vd.stab"] = q(word_t(3, "stabilisation"))
ev["vd.steady"] = q(word_t(3, "ثابت"))
ev["vd.run"] = q(word_t(3, "تجري"))
# ACTION POD + WATER
ev["pd.pod"] = q(word_t(4, "Action"))
ev["pd.flip"] = q(word_t(4, "كيدور"))
ev["pd.self"] = q(word_t(4, "راسك"))
ev["pd.water"] = q(word_t(4, "étanche"))
ev["pd.m"] = q(word_t(4, "mètres"))
# MINI TRIPOD
ev["tp.tripod"] = q(word_t(5, "Mini"))
ev["tp.stick"] = q(word_t(5, "selfie"))
ev["tp.legs"] = q(word_t(5, "trépied"))
ev["tp.remote"] = q(word_t(5, "télécommande"))
# TRUST
ev["trust.badge"] = 25.5
ev["trust.original"] = q(word_t(6, "originaux"))
ev["trust.thumb"] = ev["trust.original"]
ev["trust.checks"] = [q(word_t(6, "boîte")), q(nth(6, 4)), q(nth(6, 6))]
# CTA
ev["cta.url"] = 28.6
ev["cta.message"] = q(word_t(7, "تكوموندي"))
ev["cta.socials"] = ev["cta.message"] + 0.1
ev["cta.wave"] = ev["cta.message"] + 0.25
# END CARD
ev["end.city"] = 31.0
ev["end.typeStart"] = 31.2
ev["end.typeStep"] = 0.06
ev["end.icons"] = 31.75
ev["end.iconStep"] = 0.06
ev["end.tagline"] = 32.15
ev["end.wink"] = 32.4
ev["end.hold"] = HOLD_FROM

sfx = [("blip_jump", ev["hook.botLand"], -14), ("pop_big", ev["hook.film"], -11), ("hit_small", ev["hook.live"], -10), ("stamp", ev["hook.both"], -9)]
sfx += [("whoosh", end - 0.3, -9) for _, _, end in SCENES[:-3]]
sfx += [("impact", ev["intro.name"], -7), ("shine", ev["intro.name"] + 0.2, -14), ("pop_big", ev["intro.bundle"], -11), ("pop_big", ev["intro.tripod"], -11), ("pop_big", ev["intro.dispo"], -11)]
sfx += [("pop", ev["mg.small"], -12), ("stamp", ev["mg.clip"] + 0.15, -9), ("blip_up", ev["mg.pov"], -12), ("pop", ev["mg.hands"], -12)]
sfx += [("hit", ev["vd.4k"], -9), ("riser_short", ev["vd.stab"] - 0.1, -14), ("stamp", ev["vd.steady"], -10), ("pop", ev["vd.run"], -12)]
sfx += [("pop_big", ev["pd.pod"], -11), ("whoosh", ev["pd.flip"], -12), ("pop", ev["pd.self"], -12), ("pop_big", ev["pd.water"], -11), ("pop", ev["pd.m"], -12)]
sfx += [("pop_big", ev["tp.tripod"], -11), ("pop", ev["tp.stick"], -12), ("pop", ev["tp.legs"], -12), ("blip", ev["tp.remote"], -12), ("shutter", ev["tp.remote"] + 0.35, -11)]
sfx += [("hit", ev["trust.badge"], -8), ("blip_up", ev["trust.thumb"], -12)] + [("ding", t + 0.15, -12) for t in ev["trust.checks"]]
sfx += [("whoosh", 28.2, -10), ("pop_big", ev["cta.url"], -11), ("pop_big", ev["cta.message"], -11), ("pop", ev["cta.socials"] + 0.2, -13),
        ("blip", ev["cta.wave"], -13)]
sfx += [("whoosh", 30.7, -9), ("impact", ev["end.city"], -5)] + [("tick", ev["end.typeStart"] + i * ev["end.typeStep"], -12) for i in range(8)]
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
