"""Timeline for the Ray-Ban Meta range reel (Wayfarer Gen 3 Transitions, Aviator Gen 3, Wayfarer + Headliner Gen 2)
-> public/rbrange/data/timeline.json (39.5 s: the take barely pauses, trimmed 36.9 s; even 1.10x would end at 33.6 s, so the
standing over-30 s rule applies at natural speed; same schema as scripts/build_timeline.py; shared by the picture and
the audio mix). Scene cuts sit on the 120 BPM beat grid next to sentence breaks; hits land on the half-beat nearest the
word that triggers them."""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
PUB = ROOT / "public" / "rbrange"
VO = json.loads((PUB / "data" / "vo.json").read_text())
LINES = json.loads((ROOT / "reels" / "rbrange" / "vo_lines.json").read_text())
FPS, BPM = 30, 120
BEAT = 60 / BPM
TOTAL_FRAMES, HOLD_FROM = 1185, 38.5
SCENES = [("hook", 0.0, 5.0), ("lineup", 5.0, 7.0), ("w3", 7.0, 13.75), ("aviator", 13.75, 20.5), ("gen2", 20.5, 24.5),
          ("all", 24.5, 31.25), ("trust", 31.25, 34.75), ("cta", 34.75, 37.0), ("end", 37.0, 39.5)]


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
# HOOK - "looking for smart glasses? don't buy before watching this video!"
ev["hook.slam"] = 0.0
ev["hook.botLand"] = 0.3
ev["hook.look"] = q(word_t(0, "كتقلّب"))
ev["hook.smart"] = q(word_t(0, "smart"))
ev["hook.stop"] = q(word_t(0, "تشريش"))
ev["hook.watch"] = q(word_t(0, "تشوف"))
ev["hook.video"] = q(word_t(0, "الفيديو"))
# LINEUP - Ray-Ban Meta x4, DISPONIBLES
ev["ln.name"] = q(word_t(1, "Ray-Ban"))
ev["ln.four"] = q(word_t(1, "بربعة"))
ev["ln.dispo"] = q(word_t(1, "disponibles"))
# WAYFARER GEN 3 - Matte Black, Transitions (tint by themselves), Meta AI button
ev["w3.name"] = q(word_t(2, "Wayfarer"))
ev["w3.gen"] = q(word_t(2, "3e"))
ev["w3.black"] = q(word_t(2, "Black"))
ev["w3.trans"] = q(word_t(2, "Transitions"))
ev["w3.auto"] = q(word_t(2, "بوحدهم"))
ev["w3.light"] = q(word_t(2, "الضو"))
ev["w3.button"] = q(word_t(2, "bouton"))
ev["w3.ai"] = q(word_t(2, "Meta"))
# AVIATOR GEN 3 - classic aviator style, same Gen 3 upgrades, up to 9 h
ev["av.name"] = q(word_t(3, "Aviator"))
ev["av.gen"] = q(word_t(3, "3e"))
ev["av.style"] = q(word_t(3, "style"))
ev["av.classic"] = q(word_t(3, "classique"))
ev["av.up"] = q(word_t(3, "upgrades"))
ev["av.h9"] = q(word_t(3, "9"))
# GEN 2 - Wayfarer + Headliner: same camera, up to 8 h, lower price
ev["g2.name"] = q(word_t(4, "Wayfarer"))
ev["g2.head"] = q(word_t(4, "Headliner"))
ev["g2.cam"] = q(word_t(4, "الكاميرا"))
ev["g2.h8"] = q(word_t(4, "8"))
ev["g2.price"] = q(word_t(4, "وبثمن"))
# ALL FOUR - 12 MP camera, 3K video, music + calls
ev["al.all"] = q(word_t(5, "وكاملين"))
ev["al.mp"] = q(word_t(5, "12"))
ev["al.vid"] = q(word_t(5, "3K"))
ev["al.music"] = q(word_t(5, "الموسيقى"))
ev["al.calls"] = q(word_t(5, "وتجاوب"))
# TRUST
ev["trust.badge"] = 31.25
ev["trust.original"] = q(word_t(6, "originaux"))
ev["trust.thumb"] = ev["trust.original"]
ev["trust.checks"] = [q(word_t(6, "boîte")), q(nth(6, 4)), q(nth(6, 6))]
# CTA
ev["cta.url"] = 34.85
ev["cta.message"] = max(35.1, q(word_t(7, "تكوموندي")))
ev["cta.socials"] = ev["cta.message"] + 0.1
ev["cta.wave"] = ev["cta.message"] + 0.25
# END CARD
ev["end.city"] = 37.0
ev["end.typeStart"] = 37.2
ev["end.typeStep"] = 0.06
ev["end.icons"] = 37.75
ev["end.iconStep"] = 0.06
ev["end.tagline"] = 38.0
ev["end.wink"] = 38.25
ev["end.hold"] = HOLD_FROM

sfx = [("blip_jump", ev["hook.botLand"], -14), ("pop", ev["hook.look"], -12), ("shine", ev["hook.smart"], -13), ("stamp", ev["hook.stop"], -8),
       ("blip", ev["hook.watch"], -12), ("pop_big", ev["hook.video"], -11)]
sfx += [("whoosh", end - 0.3, -9) for _, _, end in SCENES[:-3]]
sfx += [("impact", ev["ln.name"], -7)] + [("pop_big", ev["ln.four"] + i * 0.12, -12) for i in range(4)] + [("stamp", ev["ln.dispo"], -10)]
sfx += [("impact", ev["w3.name"], -8), ("pop", ev["w3.gen"], -12), ("pop", ev["w3.black"], -12), ("pop_big", ev["w3.trans"], -11), ("riser_short", ev["w3.auto"], -14),
        ("shine", ev["w3.light"], -12), ("blip", ev["w3.button"], -11), ("blip_up", ev["w3.ai"], -12)]
sfx += [("impact", ev["av.name"], -8), ("pop", ev["av.gen"], -12), ("pop_big", ev["av.style"], -11), ("shine", ev["av.classic"], -13), ("pop", ev["av.up"], -12), ("hit", ev["av.h9"], -9)]
sfx += [("impact", ev["g2.name"], -8), ("pop_big", ev["g2.head"], -11), ("pop", ev["g2.cam"], -12), ("hit", ev["g2.h8"], -9), ("ding", ev["g2.price"], -11)]
sfx += [("stamp", ev["al.all"], -10), ("shutter", ev["al.mp"], -10), ("hit", ev["al.vid"], -9), ("pop", ev["al.music"], -12), ("pop", ev["al.calls"], -12)]
sfx += [("hit", ev["trust.badge"], -8), ("blip_up", ev["trust.thumb"], -12)] + [("ding", t + 0.15, -12) for t in ev["trust.checks"]]
sfx += [("whoosh", 34.45, -10), ("pop_big", ev["cta.url"], -11), ("pop_big", ev["cta.message"], -11), ("pop", ev["cta.socials"] + 0.2, -13),
        ("blip", ev["cta.wave"], -13)]
sfx += [("whoosh", 36.7, -9), ("impact", ev["end.city"], -5)] + [("tick", ev["end.typeStart"] + i * ev["end.typeStep"], -12) for i in range(8)]
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
