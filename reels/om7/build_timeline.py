"""Timeline for the DJI Osmo Mobile 7 reel -> public/om7/data/timeline.json
(30 s: pause trimming + the max 1.10x pitch-kept speed-up put the VO end at 28.05 s; same schema as
scripts/build_timeline.py; shared by the picture and the audio mix). Scene cuts sit on the 120 BPM beat grid next to
sentence breaks; hits land on the half-beat nearest the word that triggers them."""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
PUB = ROOT / "public" / "om7"
VO = json.loads((PUB / "data" / "vo.json").read_text())
LINES = json.loads((ROOT / "reels" / "om7" / "vo_lines.json").read_text())
FPS, BPM = 30, 120
BEAT = 60 / BPM
TOTAL_FRAMES, HOLD_FROM = 900, 29.0
SCENES = [("hook", 0.0, 3.5), ("intro", 3.5, 6.5), ("stab", 6.5, 11.0), ("track", 11.0, 16.25), ("fold", 16.25, 20.25),
          ("battery", 20.25, 22.5), ("trust", 22.5, 26.0), ("cta", 26.0, 28.25), ("end", 28.25, 30.0)]


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
# HOOK - "your phone films well... but the video always shakes? here's the fix!"
ev["hook.slam"] = 0.0
ev["hook.botLand"] = 0.3
ev["hook.good"] = q(word_t(0, "مزيان"))
ev["hook.shake"] = q(word_t(0, "كيترعد"))
ev["hook.fix"] = q(word_t(0, "هاهوا"))
# INTRO
ev["intro.name"] = q(word_t(1, "DJI"))
ev["intro.osmo"] = q(word_t(1, "Osmo"))
ev["intro.dispo"] = q(word_t(1, "disponible"))
# 3-AXIS STABILISER - steady like cinema, even walking or running
ev["st.axes"] = q(word_t(2, "3"))
ev["st.steady"] = q(word_t(2, "ثابت"))
ev["st.cinema"] = q(word_t(2, "السينما"))
ev["st.walk"] = q(word_t(2, "تمشي"))
# ACTIVETRACK with DJI Mimo - follows you or your kids automatically, hands-free
ev["tr.active"] = q(word_t(3, "ActiveTrack"))
ev["tr.mimo"] = q(word_t(3, "DJI"))
ev["tr.follow"] = q(word_t(3, "كيتبّعك"))
ev["tr.kids"] = q(word_t(3, "ولادك"))
ev["tr.hands"] = q(word_t(3, "بلا"))
# FOLDS INTO A POCKET + MAGNETIC CLAMP in a second
ev["fd.fold"] = q(word_t(4, "كيتطوى"))
ev["fd.pocket"] = q(word_t(4, "فالجيب"))
ev["fd.clamp"] = q(word_t(4, "pince"))
ev["fd.sec"] = q(word_t(4, "فثانية"))
# BATTERY - up to 10 h of filming
ev["bt.battery"] = q(word_t(5, "باطري"))
ev["bt.hours"] = q(word_t(5, "10"))
# TRUST
ev["trust.badge"] = 22.5
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

sfx = [("blip_jump", ev["hook.botLand"], -14), ("pop", ev["hook.good"], -12), ("hit_small", ev["hook.shake"], -9), ("hit_small", ev["hook.shake"] + 0.2, -11),
       ("impact", ev["hook.fix"], -7), ("shine", ev["hook.fix"] + 0.2, -13)]
sfx += [("whoosh", end - 0.3, -9) for _, _, end in SCENES[:-3]]
sfx += [("impact", ev["intro.name"], -7), ("shine", ev["intro.osmo"], -14), ("pop_big", ev["intro.dispo"], -11)]
sfx += [("stamp", ev["st.axes"], -10), ("riser_short", ev["st.steady"] - 0.15, -15), ("ding", ev["st.steady"] + 0.1, -11), ("shine", ev["st.cinema"], -13), ("pop", ev["st.walk"], -12)]
sfx += [("pop_big", ev["tr.active"], -11), ("blip", ev["tr.mimo"], -12), ("blip_up", ev["tr.follow"], -12), ("pop", ev["tr.kids"], -12), ("pop", ev["tr.hands"], -12)]
sfx += [("whoosh", ev["fd.fold"], -11), ("pop", ev["fd.pocket"], -12), ("stamp", ev["fd.clamp"] + 0.1, -10), ("ding", ev["fd.sec"], -11)]
sfx += [("pop_big", ev["bt.battery"], -11), ("riser_short", ev["bt.hours"] - 0.15, -15), ("hit", ev["bt.hours"] + 0.1, -9)]
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
