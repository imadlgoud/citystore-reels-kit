"""Timeline for the DJI Osmo Action 5 Pro reel (vlogger angle) -> public/oa5pro/data/timeline.json
(30 s: pause trimming + 1.019x pitch-kept speed-up put the VO end at 27.6 s; same schema as scripts/build_timeline.py;
shared by the picture and the audio mix)."""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
PUB = ROOT / "public" / "oa5pro"
VO = json.loads((PUB / "data" / "vo.json").read_text())
LINES = json.loads((ROOT / "reels" / "oa5pro" / "vo_lines.json").read_text())
FPS, BPM = 30, 120
BEAT = 60 / BPM
TOTAL_FRAMES, HOLD_FROM = 900, 29.0
SCENES = [("hook", 0.0, 4.25), ("intro", 4.25, 7.25), ("screen", 7.25, 11.5), ("stab", 11.5, 17.0), ("mic", 17.0, 22.0),
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


def nth(li, k):
    return VO[li]["start"] + VO[li]["words"][k]["start"]


ev = {}
# HOOK - "want to start vlogging, or still filming with your phone? this is what you need!"
ev["hook.slam"] = 0.0
ev["hook.botLand"] = 0.3
ev["hook.vlog"] = q(word_t(0, "vlog"))
ev["hook.phone"] = q(word_t(0, "بالتيليفون"))
ev["hook.this"] = q(word_t(0, "هادي"))
# INTRO - DJI Osmo Action 5 Pro, Essential Combo, DISPONIBLE
ev["intro.name"] = max(4.35, q(word_t(1, "DJI")))
ev["intro.model"] = q(word_t(1, "Osmo"))
ev["intro.combo"] = q(word_t(1, "Essential"))
ev["intro.dispo"] = q(word_t(1, "disponible"))
# FRONT SCREEN - front OLED screen: see yourself while you vlog, never lose the framing
ev["sc.name"] = max(7.35, q(word_t(2, "écran")))
ev["sc.front"] = q(word_t(2, "القدام"))
ev["sc.you"] = q(word_t(2, "كتشوف"))
ev["sc.frame"] = q(word_t(2, "بلا"))
# STABILISATION - walk, run, the video stays steady; sharp 4K even at night
ev["st.name"] = max(11.6, q(word_t(3, "stabilisation")))
ev["st.walk"] = q(word_t(3, "تمشي"))
ev["st.run"] = q(word_t(3, "تجري"))
ev["st.steady"] = q(word_t(3, "ثابت"))
ev["st.k4"] = q(word_t(3, "4K"))
ev["st.night"] = q(word_t(3, "فالليل"))
# MIC + BATTERY - connects directly to the DJI Mic 2 for clean sound; battery up to 4 hours
ev["mc.name"] = max(17.1, q(word_t(4, "كتكونيكطي")))
ev["mc.mic"] = q(word_t(4, "Mic"))
ev["mc.clean"] = q(word_t(4, "الصوت"))
ev["mc.batt"] = q(word_t(4, "batterie"))
ev["mc.hours"] = q(word_t(4, "heures"))
# TRUST (singular, as spoken)
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

sfx = [("blip_jump", ev["hook.botLand"], -14), ("pop", ev["hook.vlog"], -12), ("hit_small", ev["hook.phone"], -10), ("stamp", ev["hook.this"], -9)]
sfx += [("whoosh", end - 0.3, -9) for _, _, end in SCENES[:-3]]
sfx += [("impact", ev["intro.name"], -7), ("shine", ev["intro.model"], -13), ("pop", ev["intro.combo"], -12), ("stamp", ev["intro.dispo"], -10)]
sfx += [("pop_big", ev["sc.name"], -11), ("pop", ev["sc.front"], -12), ("blip", ev["sc.you"], -12), ("ding", ev["sc.frame"], -12)]
sfx += [("pop_big", ev["st.name"], -11), ("blip", ev["st.walk"], -12), ("blip", ev["st.run"], -12), ("ding", ev["st.steady"], -11),
        ("hit", ev["st.k4"], -8), ("shine", ev["st.night"], -12)]
sfx += [("pop_big", ev["mc.name"], -11), ("pop", ev["mc.mic"], -12), ("blip_up", ev["mc.clean"], -12), ("pop", ev["mc.batt"], -12), ("ding", ev["mc.hours"], -12)]
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
print({k: v for k, v in ev.items() if not k.startswith("end.")})
