"""Timeline for the Redmi 5G comparison reel (Note 15 5G, Note 14 Pro+ 5G, Note 14 5G) -> public/redmi/data/timeline.json
(39.5 s: the VO does not fit 30 s even at 1.1x, so the standing approval applies: full VO at natural speed)
(same schema as scripts/build_timeline.py; shared by the picture and the audio mix).
Scene cuts sit on the 120 BPM beat grid next to sentence breaks; hits land on the half-beat nearest the word that
triggers them."""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
PUB = ROOT / "public" / "redmi"
VO = json.loads((PUB / "data" / "vo.json").read_text())
LINES = json.loads((ROOT / "reels" / "redmi" / "vo_lines.json").read_text())
FPS, BPM = 30, 120
BEAT = 60 / BPM
TOTAL_FRAMES, HOLD_FROM = 1185, 38.5
SCENES = [("hook", 0.0, 4.75), ("note15", 4.75, 13.25), ("proplus", 13.25, 23.25), ("note14", 23.25, 32.0),
          ("trust", 32.0, 34.0), ("cta", 34.0, 35.75), ("end", 35.75, 39.5)]


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




def word_n(li, needle, n):
    hits = [VO[li]["start"] + w["start"] for w in VO[li]["words"] if needle.lower() in w["word"].lower()]
    return hits[n]


ev = {}
# HOOK - three phones flip past like cards, "?" bubble, then they freeze in a fan + DISPONIBLES
ev["hook.slam"] = 0.0
ev["hook.botLand"] = 0.3
ev["hook.g5"] = q(word_t(0, "5G"))
ev["hook.which"] = q(word_t(0, "شكون"))
ev["hook.choose"] = q(word_t(0, "تختار"))
ev["hook.fan"] = q(word_t(0, "هاهوما"))
ev["hook.dispo"] = q(word_t(0, "disponibles"))
# PRODUCTS (shared beats: name / ram / storage)
for key, li in [("note15", 1), ("proplus", 2), ("note14", 3)]:
    ev[f"{key}.name"] = q(VO[li]["start"] + 0.05)
    ev[f"{key}.ram"] = q(word_t(li, "GB"))
    ev[f"{key}.sto"] = q(word_n(li, "GB", 1))
ev["note15.new"] = q(word_t(1, "آخر"))
ev["note15.c1"] = q(word_t(1, "ouverte"))
ev["note15.c2"] = q(word_t(1, "activée"))
ev["note15.c3"] = q(word_t(1, "boîte"))
ev["proplus.cam"] = q(word_t(2, "200"))
ev["proplus.charge"] = q(word_t(2, "وشارج"))
ev["proplus.fast"] = q(word_t(2, "سريع"))
ev["proplus.c1"] = q(word_t(2, "boîte"))
ev["proplus.c2"] = q(word_t(2, "jamais"))
ev["note14.space"] = q(word_t(3, "بلاصة"))
ev["note14.price"] = q(word_t(3, "بثمن"))
ev["note14.c1"] = q(word_t(3, "boîte"))
ev["note14.c2"] = q(word_t(3, "jamais"))
# TRUST (short: "Produits originaux." then the conditions recap ticks)
ev["trust.badge"] = 32.0
ev["trust.original"] = q(word_t(4, "originaux"))
ev["trust.thumb"] = ev["trust.original"]
ev["trust.checks"] = [32.75, 33.0, 33.25]
# CTA
ev["cta.url"] = 34.0
ev["cta.message"] = max(34.25, q(word_t(5, "تكوموندي")))
ev["cta.socials"] = ev["cta.message"] + 0.1
ev["cta.wave"] = ev["cta.message"] + 0.25
# END CARD
ev["end.city"] = 35.75
ev["end.typeStart"] = 36.0
ev["end.typeStep"] = 0.0625
ev["end.icons"] = 36.6
ev["end.iconStep"] = 0.06
ev["end.tagline"] = 37.0
ev["end.wink"] = 37.25
ev["end.hold"] = HOLD_FROM

sfx = [("blip_jump", ev["hook.botLand"], -14), ("stamp", ev["hook.g5"], -10), ("whoosh", ev["hook.which"], -12), ("whoosh", ev["hook.which"] + 0.25, -13),
       ("whoosh", ev["hook.which"] + 0.5, -14), ("pop_big", ev["hook.choose"], -11), ("impact", ev["hook.fan"], -8), ("pop_big", ev["hook.dispo"], -11)]
sfx += [("whoosh", end - 0.3, -9) for _, _, end in SCENES[:-3]]
for key in ["note15", "proplus", "note14"]:
    sfx += [("impact", ev[f"{key}.name"], -8), ("shine", ev[f"{key}.name"] + 0.25, -15), ("pop_big", ev[f"{key}.ram"], -12), ("pop_big", ev[f"{key}.sto"], -12)]
sfx += [("stamp", ev["note15.new"], -10)] + [("ding", ev[f"note15.c{i}"], -12) for i in (1, 2, 3)]
sfx += [("hit", ev["proplus.cam"], -9), ("riser_short", ev["proplus.charge"] - 0.1, -15), ("pop", ev["proplus.fast"], -12)] + [("ding", ev[f"proplus.c{i}"], -12) for i in (1, 2)]
sfx += [("pop_big", ev["note14.space"], -11), ("pop", ev["note14.price"], -12)] + [("ding", ev[f"note14.c{i}"], -12) for i in (1, 2)]
sfx += [("hit", ev["trust.badge"], -8), ("blip_up", ev["trust.thumb"], -12)] + [("ding", t + 0.1, -13) for t in ev["trust.checks"]]
sfx += [("whoosh", 33.7, -10), ("pop_big", ev["cta.url"], -11), ("pop_big", ev["cta.message"] + 0.15, -11), ("pop", ev["cta.socials"] + 0.2, -13),
        ("blip", ev["cta.wave"], -13)]
sfx += [("whoosh", 35.45, -9), ("impact", ev["end.city"], -5)] + [("tick", ev["end.typeStart"] + i * ev["end.typeStep"], -12) for i in range(8)]
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
