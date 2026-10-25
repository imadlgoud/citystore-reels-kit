"""Timeline for the DJI Osmo 360 Standard Combo reel -> public/osmo360/data/timeline.json
(38.5 s: the VO does not fit 30 s even at 1.1x, so the standing approval applies: full VO at natural speed)
(same schema as scripts/build_timeline.py; shared by the picture and the audio mix).
Scene cuts sit on the 120 BPM beat grid next to sentence breaks; hits land on the half-beat nearest the word that
triggers them."""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
PUB = ROOT / "public" / "osmo360"
VO = json.loads((PUB / "data" / "vo.json").read_text())
LINES = json.loads((ROOT / "reels" / "osmo360" / "vo_lines.json").read_text())
FPS, BPM = 30, 120
BEAT = 60 / BPM
TOTAL_FRAMES, HOLD_FROM = 1155, 37.5
SCENES = [("hook", 0.0, 3.25), ("intro", 3.25, 8.25), ("sphere", 8.25, 14.75), ("sensor", 14.75, 18.75), ("storage", 18.75, 23.0),
          ("stick", 23.0, 28.0), ("trust", 28.0, 32.5), ("cta", 32.5, 35.0), ("end", 35.0, 38.5)]


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
# HOOK - the camera in the middle of a 360 ring of drawn scenes, then a frame picks one angle
ev["hook.slam"] = 0.0
ev["hook.botLand"] = 0.3
ev["hook.all"] = q(word_t(0, "كلشي"))
ev["hook.pick"] = q(word_t(0, "واختار"))
ev["hook.angle"] = q(word_t(0, "الزاوية"))
# INTRO
ev["intro.name"] = q(word_t(1, "DJI"))
ev["intro.combo"] = q(word_t(1, "Standard"))
ev["intro.dispo"] = q(word_t(1, "disponible"))
# SPHERE
ev["sp.360"] = q(word_t(2, "360"))
ev["sp.around"] = q(word_t(2, "داير"))
ev["sp.video"] = q(word_t(2, "فيديو"))
ev["sp.angle"] = q(word_t(2, "بالزاوية"))
# SENSOR
ev["se.inch"] = q(word_t(3, "1"))
ev["se.8k"] = q(word_t(3, "8K"))
ev["se.clear"] = q(word_t(3, "واضحة"))
ev["se.night"] = q(word_t(3, "فالليل"))
# STORAGE + WATER
ev["st.gb"] = q(word_t(4, "105GB"))
ev["st.water"] = q(word_t(4, "étanche"))
ev["st.m"] = q(word_t(4, "mètres"))
# STICK
ev["sk.stick"] = q(word_t(5, "selfie"))
ev["sk.vanish"] = q(word_t(5, "كتختفي"))
ev["sk.drone"] = q(word_t(5, "درون"))
# TRUST
ev["trust.badge"] = 28.0
ev["trust.original"] = q(word_t(6, "original"))
ev["trust.thumb"] = ev["trust.original"]
ev["trust.checks"] = [q(word_t(6, "boîte")), q(nth(6, 4)), q(nth(6, 6))]
# CTA
ev["cta.url"] = 32.6
ev["cta.message"] = q(word_t(7, "تكوموندي"))
ev["cta.socials"] = ev["cta.message"] + 0.1
ev["cta.wave"] = ev["cta.message"] + 0.25
# END CARD
ev["end.city"] = 35.0
ev["end.typeStart"] = 35.25
ev["end.typeStep"] = 0.0625
ev["end.icons"] = 35.85
ev["end.iconStep"] = 0.06
ev["end.tagline"] = 36.25
ev["end.wink"] = 36.5
ev["end.hold"] = HOLD_FROM

sfx = [("blip_jump", ev["hook.botLand"], -14), ("impact", 0.1, -8), ("whoosh", ev["hook.all"], -11), ("whoosh", ev["hook.all"] + 0.3, -13),
       ("pop_big", ev["hook.pick"], -11), ("shutter", ev["hook.angle"], -10)]
sfx += [("whoosh", end - 0.3, -9) for _, _, end in SCENES[:-3]]
sfx += [("impact", ev["intro.name"], -7), ("shine", ev["intro.name"] + 0.2, -14), ("pop_big", ev["intro.combo"], -11), ("pop_big", ev["intro.dispo"], -11)]
sfx += [("stamp", ev["sp.360"], -10), ("whoosh", ev["sp.around"], -12), ("pop", ev["sp.video"], -12), ("shutter", ev["sp.angle"], -11)]
sfx += [("pop_big", ev["se.inch"], -10), ("hit", ev["se.8k"], -9), ("shine", ev["se.clear"], -12), ("blip_up", ev["se.night"], -12)]
sfx += [("pop_big", ev["st.gb"], -10), ("pop_big", ev["st.water"], -11), ("pop", ev["st.m"], -12)]
sfx += [("pop_big", ev["sk.stick"], -11), ("riser_short", ev["sk.vanish"] - 0.1, -14), ("shine", ev["sk.vanish"] + 0.2, -12), ("blip_up", ev["sk.drone"], -12)]
sfx += [("hit", ev["trust.badge"], -8), ("blip_up", ev["trust.thumb"], -12)] + [("ding", t + 0.15, -12) for t in ev["trust.checks"]]
sfx += [("whoosh", 32.2, -10), ("pop_big", ev["cta.url"], -11), ("pop_big", ev["cta.message"], -11), ("pop", ev["cta.socials"] + 0.2, -13),
        ("blip", ev["cta.wave"], -13)]
sfx += [("whoosh", 34.7, -9), ("impact", ev["end.city"], -5)] + [("tick", ev["end.typeStart"] + i * ev["end.typeStep"], -12) for i in range(8)]
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
