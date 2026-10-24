"""Timeline for the Razer Hammerhead USB-C ANC reel -> public/razer/data/timeline.json
(30 s; same schema as scripts/build_timeline.py; shared by the picture and the audio mix).
Scene cuts sit on the 120 BPM beat grid next to sentence breaks; hits land on the half-beat nearest the word
that triggers them."""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
PUB = ROOT / "public" / "razer"
VO = json.loads((PUB / "data" / "vo.json").read_text())
LINES = json.loads((ROOT / "reels" / "razer" / "vo_lines.json").read_text())
FPS, BPM = 30, 120
BEAT = 60 / BPM
TOTAL_FRAMES, HOLD_FROM = 900, 29.0
SCENES = [("hook", 0.0, 3.25), ("intro", 3.25, 7.25), ("cable", 7.25, 11.0), ("anc", 11.0, 15.5), ("tips", 15.5, 19.5),
          ("remote", 19.5, 23.25), ("trust", 23.25, 26.75), ("cta", 26.75, 28.25), ("end", 28.25, 30.0)]


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

# HOOK - "K.O." first, the "BANG" arrives late (lag); then "it's not you, it's the headset": wireless headset crossed out
ev["hook.slam"] = 0.0
ev["hook.bullet"] = q(word_t(0, "الرصاصة"))
ev["hook.dead"] = q(word_t(0, "تموت"))
ev["hook.bang"] = ev["hook.dead"] + 0.5
ev["hook.notyou"] = q(word_t(0, "ماشي"))
ev["hook.kit"] = q(word_t(0, "فالكيت"))
ev["hook.botLand"] = 0.3
# INTRO
ev["intro.name"] = q(word_t(1, "Razer"))
ev["intro.usbc"] = q(word_t(1, "USB-C"))
ev["intro.anc"] = q(word_t(1, "ANC"))
ev["intro.dispo"] = q(word_t(1, "disponible"))
# CABLE
ev["cb.plug"] = q(word_t(2, "USB-C"))
ev["cb.time"] = q(word_t(2, "فالوقت"))
ev["cb.nolag"] = q(word_t(2, "معطّل"))
# ANC
ev["anc.on"] = q(word_t(3, "réduction"))
ev["anc.noise"] = q(word_t(3, "الصداع"))
ev["anc.focus"] = q(word_t(3, "مركّز"))
# TIPS
ev["tp.comply"] = q(word_t(4, "Comply"))
ev["tp.comfy"] = q(word_t(4, "مريحين"))
ev["tp.iso"] = q(word_t(4, "وكيعزلو"))
# REMOTE + MIC
ev["rm.remote"] = q(word_t(5, "télécommande"))
ev["rm.mic"] = q(word_t(5, "micro"))
ev["rm.talk"] = q(word_t(5, "تهضر"))
ev["rm.calls"] = q(word_t(5, "appels"))
# TRUST
ev["trust.badge"] = 23.25
ev["trust.original"] = q(word_t(6, "original"))
ev["trust.thumb"] = ev["trust.original"]
ev["trust.checks"] = [q(word_t(6, "boîte")), q(nth(6, 4)), q(nth(6, 6))]
# CTA
ev["cta.url"] = 26.85
ev["cta.message"] = q(word_t(7, "تكوموندي"))
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

sfx = [("blip_jump", ev["hook.botLand"], -14), ("whoosh", ev["hook.bullet"], -12), ("hit", ev["hook.dead"], -8), ("impact", ev["hook.bang"], -9),
       ("pop", ev["hook.notyou"], -12), ("stamp", ev["hook.kit"], -10)]
sfx += [("whoosh", end - 0.3, -9) for _, _, end in SCENES[:-3]]
sfx += [("impact", ev["intro.name"], -7), ("shine", ev["intro.name"] + 0.2, -14), ("pop_big", ev["intro.usbc"], -11), ("pop_big", ev["intro.anc"], -11), ("pop_big", ev["intro.dispo"], -11)]
sfx += [("stamp", ev["cb.plug"], -10), ("whoosh", ev["cb.time"], -11), ("ding", ev["cb.nolag"], -12)]
sfx += [("riser_short", ev["anc.on"] - 0.1, -14), ("anc", ev["anc.on"] + 0.15, -12), ("hit_small", ev["anc.noise"], -11), ("pop_big", ev["anc.focus"], -11)]
sfx += [("pop_big", ev["tp.comply"], -11), ("pop", ev["tp.comfy"], -12), ("shine", ev["tp.iso"], -12)]
sfx += [("pop_big", ev["rm.remote"], -11), ("tap", ev["rm.mic"], -10), ("blip", ev["rm.talk"], -12), ("blip", ev["rm.calls"], -12), ("ding", ev["rm.calls"] + 0.25, -13)]
sfx += [("hit", ev["trust.badge"], -8), ("blip_up", ev["trust.thumb"], -12)] + [("ding", t + 0.15, -12) for t in ev["trust.checks"]]
sfx += [("whoosh", 26.45, -10), ("pop_big", ev["cta.url"], -11), ("pop_big", ev["cta.message"], -11), ("pop", ev["cta.socials"] + 0.2, -13),
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
