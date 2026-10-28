"""Timeline for the Apple Watch Ultra 3 (49 mm, Noir) reel -> public/ultra3/data/timeline.json
(30 s: pause trimming, natural speed, VO ends at 27.6 s; same schema as scripts/build_timeline.py; shared by the picture
and the audio mix). Scene cuts sit on the 120 BPM beat grid next to sentence breaks; hits land on the half-beat nearest
the word that triggers them."""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
PUB = ROOT / "public" / "ultra3"
VO = json.loads((PUB / "data" / "vo.json").read_text())
LINES = json.loads((ROOT / "reels" / "ultra3" / "vo_lines.json").read_text())
FPS, BPM = 30, 120
BEAT = 60 / BPM
TOTAL_FRAMES, HOLD_FROM = 900, 29.0
SCENES = [("hook", 0.0, 3.5), ("intro", 3.5, 7.25), ("titan", 7.25, 9.5), ("band", 9.5, 12.75), ("battery", 12.75, 17.5),
          ("gps", 17.5, 22.0), ("trust", 22.0, 25.5), ("cta", 25.5, 27.75), ("end", 27.75, 30.0)]


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
# HOOK - "made for the mountains, the sea and the desert... and classy even at work!"
ev["hook.slam"] = 0.0
ev["hook.botLand"] = 0.3
ev["hook.mountain"] = q(word_t(0, "للجبل"))
ev["hook.sea"] = q(word_t(0, "البحر"))
ev["hook.desert"] = q(word_t(0, "والصحرا"))
ev["hook.classe"] = q(word_t(0, "classe"))
ev["hook.work"] = q(word_t(0, "فالخدمة"))
# INTRO
ev["intro.name"] = q(word_t(1, "Apple"))
ev["intro.mm"] = q(word_t(1, "49mm"))
ev["intro.noir"] = q(word_t(1, "Noir"))
ev["intro.dispo"] = q(word_t(1, "disponible"))
# BLACK TITANIUM + SAPPHIRE
ev["ti.case"] = q(word_t(2, "boîtier"))
ev["ti.saph"] = q(word_t(2, "saphir"))
ev["ti.strong"] = q(word_t(2, "قوية"))
ev["ti.shock"] = q(word_t(2, "وكتقاوم"))
# BLACK OCEAN BAND - comfortable, stays put while swimming or running
ev["bd.band"] = q(word_t(3, "البراسلي"))
ev["bd.comfy"] = q(word_t(3, "مريح"))
ev["bd.stay"] = q(word_t(3, "ثابت"))
ev["bd.swim"] = q(word_t(3, "تعوم"))
ev["bd.run"] = q(word_t(3, "تجري"))
# BATTERY
ev["bat.42"] = q(word_t(4, "42"))
ev["bat.72"] = q(word_t(4, "72"))
ev["bat.eco"] = q(word_t(4, "mode"))
# GPS + SOS
ev["gps.gps"] = q(word_t(5, "GPS"))
ev["gps.precise"] = q(word_t(5, "دقيق"))
ev["gps.sos"] = q(word_t(5, "SOS"))
ev["gps.sat"] = q(word_t(5, "satellite"))
ev["gps.nonet"] = q(word_t(5, "ريزو"))
# TRUST
ev["trust.badge"] = 22.0
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

sfx = [("blip_jump", ev["hook.botLand"], -14), ("pop_big", ev["hook.mountain"], -11), ("pop_big", ev["hook.sea"], -11), ("pop_big", ev["hook.desert"], -11),
       ("whoosh", ev["hook.classe"] - 0.1, -11), ("impact", ev["hook.classe"], -8), ("shine", ev["hook.work"], -12)]
sfx += [("whoosh", end - 0.3, -9) for _, _, end in SCENES[:-3]]
sfx += [("impact", ev["intro.name"], -7), ("shine", ev["intro.name"] + 0.2, -14), ("pop_big", ev["intro.mm"], -11), ("pop", ev["intro.noir"], -12), ("pop_big", ev["intro.dispo"], -11)]
sfx += [("stamp", ev["ti.case"], -10), ("shine", ev["ti.saph"], -11), ("hit", ev["ti.strong"], -10), ("pop", ev["ti.shock"], -12)]
sfx += [("pop_big", ev["bd.band"], -11), ("pop", ev["bd.comfy"], -12), ("stamp", ev["bd.stay"], -10), ("whoosh", ev["bd.swim"], -12), ("pop", ev["bd.run"], -12)]
sfx += [("riser_short", ev["bat.42"] - 0.15, -15), ("pop_big", ev["bat.42"] + 0.1, -10), ("hit", ev["bat.72"], -9), ("pop", ev["bat.eco"], -12)]
sfx += [("stamp", ev["gps.gps"], -10), ("blip_up", ev["gps.precise"], -12), ("pop_big", ev["gps.sos"], -10), ("blip", ev["gps.sat"], -12), ("blip", ev["gps.sat"] + 0.2, -13), ("pop", ev["gps.nonet"], -12)]
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
