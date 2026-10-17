"""Timeline for the G-Tab T13 tablet reel -> public/gtab/data/timeline.json
(38.5 s: the VO does not fit 30 s even at 1.1x, so the standing approval applies: full VO at natural speed)
(same schema as scripts/build_timeline.py; shared by the picture and the audio mix).
Scene cuts sit on the 120 BPM beat grid next to sentence breaks; hits land on the half-beat nearest the word that
triggers them."""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
PUB = ROOT / "public" / "gtab"
VO = json.loads((PUB / "data" / "vo.json").read_text())
LINES = json.loads((ROOT / "reels" / "gtab" / "vo_lines.json").read_text())
FPS, BPM = 30, 120
BEAT = 60 / BPM
TOTAL_FRAMES, HOLD_FROM = 1155, 37.5
SCENES = [("hook", 0.0, 7.25), ("intro", 7.25, 10.25), ("screen", 10.25, 14.5), ("lte", 14.5, 18.75), ("android", 18.75, 24.5),
          ("battery", 24.5, 28.25), ("trust", 28.25, 32.25), ("cta", 32.25, 35.0), ("end", 35.0, 38.5)]


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
# HOOK - a big tablet: SIM card slides in, 12GB RAM + 128GB pop, then a "BON PRIX" tag
ev["hook.slam"] = 0.0
ev["hook.botLand"] = 0.3
ev["hook.big"] = q(word_t(0, "كبيرة"))
ev["hook.sim"] = q(word_t(0, "بالكارط"))
ev["hook.ram"] = q(word_t(0, "12GB"))
ev["hook.sto"] = q(word_t(0, "128GB"))
ev["hook.price"] = q(word_t(0, "بثمن"))
ev["hook.ok"] = q(word_t(0, "مناسب"))
# INTRO
ev["intro.name"] = q(word_t(1, "G-Tab"))
ev["intro.dispo"] = q(word_t(1, "disponible"))
# SCREEN
ev["sc.size"] = q(word_t(2, "10.1"))
ev["sc.read"] = q(word_t(2, "للقراية"))
ev["sc.yt"] = q(word_t(2, "اليوتيوب"))
ev["sc.movies"] = q(word_t(2, "والأفلام"))
# 4G
ev["lte.g4"] = q(word_t(3, "4G"))
ev["lte.sim"] = q(word_t(3, "الكارط"))
ev["lte.conn"] = q(word_t(3, "connecté"))
ev["lte.where"] = q(word_t(3, "فين"))
# ANDROID
ev["and.os"] = q(word_t(4, "Android"))
ev["and.kids"] = q(word_t(4, "enfant"))
ev["and.split"] = q(word_t(4, "écran"))
ev["and.two"] = q(word_t(4, "بجوج"))
# BATTERY + MEMORY CARD
ev["bat.bat"] = q(word_t(5, "5000"))
ev["bat.sd"] = q(word_t(5, "carte"))
# TRUST
ev["trust.badge"] = 28.25
ev["trust.original"] = q(word_t(6, "originaux"))
ev["trust.thumb"] = ev["trust.original"]
ev["trust.checks"] = [q(word_t(6, "boîte")), q(nth(6, 4)), q(nth(6, 6))]
# CTA
ev["cta.url"] = 32.5
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

sfx = [("blip_jump", ev["hook.botLand"], -14), ("impact", 0.1, -8), ("riser_short", ev["hook.big"] - 0.1, -14), ("pop_big", ev["hook.big"] + 0.2, -12),
       ("whoosh", ev["hook.sim"], -12), ("pop_big", ev["hook.ram"], -11), ("pop_big", ev["hook.sto"], -11), ("pop", ev["hook.price"], -11),
       ("stamp", ev["hook.ok"], -9)]
sfx += [("whoosh", end - 0.3, -9) for _, _, end in SCENES[:-3]]
sfx += [("impact", ev["intro.name"], -7), ("shine", ev["intro.name"] + 0.2, -14), ("pop_big", ev["intro.dispo"], -11)]
sfx += [("pop_big", ev["sc.size"], -10), ("pop", ev["sc.read"], -12), ("pop", ev["sc.yt"], -12), ("pop", ev["sc.movies"], -12)]
sfx += [("stamp", ev["lte.g4"], -10), ("whoosh", ev["lte.sim"], -13), ("pop", ev["lte.sim"] + 0.3, -12), ("blip_up", ev["lte.conn"], -12), ("pop", ev["lte.where"], -12)]
sfx += [("impact", ev["and.os"], -9), ("pop_big", ev["and.kids"], -11), ("whoosh", ev["and.split"], -12), ("pop", ev["and.two"], -12)]
sfx += [("riser_short", ev["bat.bat"] - 0.1, -15), ("pop_big", ev["bat.bat"] + 0.2, -11), ("whoosh", ev["bat.sd"], -13), ("ding", ev["bat.sd"] + 0.35, -12)]
sfx += [("hit", ev["trust.badge"], -8), ("blip_up", ev["trust.thumb"], -12)] + [("ding", t + 0.15, -12) for t in ev["trust.checks"]]
sfx += [("whoosh", 31.95, -10), ("pop_big", ev["cta.url"], -11), ("pop_big", ev["cta.message"], -11), ("pop", ev["cta.socials"] + 0.2, -13),
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
