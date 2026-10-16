"""Timeline for the GoPro HERO10 Black (used) reel -> public/hero10/data/timeline.json
(30 s; same schema as scripts/build_timeline.py; shared by the picture and the audio mix).
Scene cuts sit on the 120 BPM beat grid next to sentence breaks; hits land on the half-beat nearest the word
that triggers them."""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
PUB = ROOT / "public" / "hero10"
VO = json.loads((PUB / "data" / "vo.json").read_text())
LINES = json.loads((ROOT / "reels" / "hero10" / "vo_lines.json").read_text())
FPS, BPM = 30, 120
BEAT = 60 / BPM
TOTAL_FRAMES, HOLD_FROM = 900, 29.0
SCENES = [("hook", 0.0, 3.0), ("intro", 3.0, 6.5), ("res", 6.5, 10.25), ("smooth", 10.25, 14.25), ("water", 14.25, 18.75),
          ("kit", 18.75, 22.5), ("trust", 22.5, 26.5), ("cta", 26.5, 28.25), ("end", 28.25, 30.0)]


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

# HOOK - a powerful GoPro without paying the new price: "PRIX DU NEUF" tag gets crossed out
ev["hook.slam"] = 0.0
ev["hook.botLand"] = 0.3
ev["hook.gopro"] = q(word_t(0, "GoPro"))
ev["hook.strong"] = q(word_t(0, "قوية"))
ev["hook.price"] = q(word_t(0, "تخلّص"))
ev["hook.cross"] = q(word_t(0, "الجديدة"))
# INTRO
ev["intro.name"] = q(word_t(1, "GoPro"))
ev["intro.used"] = q(word_t(1, "occasion"))
ev["intro.dispo"] = q(word_t(1, "disponible"))
# RESOLUTION
ev["res.video"] = q(word_t(2, "فيديو"))
ev["res.k"] = q(word_t(2, "5.3K"))
ev["res.photo"] = q(word_t(2, "وتصاور"))
ev["res.mp"] = q(word_t(2, "23"))
# HYPERSMOOTH
ev["sm.title"] = q(word_t(3, "HyperSmooth"))
ev["sm.steady"] = q(word_t(3, "ثابت"))
ev["sm.run"] = q(word_t(3, "تجري"))
ev["sm.jump"] = q(word_t(3, "تنقز"))
ev["sm.fall"] = q(word_t(3, "تطيح"))
# WATERPROOF + FRONT SCREEN
ev["wt.dive"] = q(word_t(4, "étanche"))
ev["wt.m"] = q(word_t(4, "10"))
ev["wt.screen"] = q(word_t(4, "écran"))
ev["wt.self"] = q(word_t(4, "راسك"))
ev["wt.film"] = q(word_t(4, "كتصوّر"))
# KIT: case + batteries, ready to go out and film
ev["kit.case"] = q(word_t(5, "الساكوش"))
ev["kit.bat"] = q(word_t(5, "والباطريات"))
ev["kit.ready"] = q(word_t(5, "واجدة"))
# TRUST (used product: occasion / tested / works well, then "first come, first served")
ev["trust.badge"] = 22.5
ev["trust.original"] = q(word_t(6, "Produit"))
ev["trust.thumb"] = ev["trust.original"]
ev["trust.checks"] = [q(word_t(6, "occasion")), q(word_t(6, "testé")), q(word_t(6, "مزيان"))]
ev["trust.first"] = q(word_t(6, "Premier"))
# CTA
ev["cta.url"] = 26.6
ev["cta.message"] = q(word_t(7, "تكوموندي"))
ev["cta.socials"] = ev["cta.message"] + 0.1
ev["cta.wave"] = ev["cta.message"] + 0.25
# END CARD
ev["end.city"] = 28.25
ev["end.typeStart"] = 28.4
ev["end.typeStep"] = 0.05
ev["end.icons"] = 28.6
ev["end.iconStep"] = 0.05
ev["end.tagline"] = 28.8
ev["end.wink"] = 28.9
ev["end.hold"] = HOLD_FROM

sfx = [("blip_jump", ev["hook.botLand"], -14), ("impact", ev["hook.gopro"], -7), ("shine", ev["hook.gopro"] + 0.2, -14), ("pop_big", ev["hook.strong"], -11),
       ("pop", ev["hook.price"], -11), ("hit", ev["hook.cross"], -9)]
sfx += [("whoosh", end - 0.3, -9) for _, _, end in SCENES[:-3]]
sfx += [("impact", ev["intro.name"], -6), ("shine", ev["intro.name"] + 0.2, -14), ("stamp", ev["intro.used"], -10), ("pop_big", ev["intro.dispo"], -11)]
sfx += [("pop", ev["res.video"], -12), ("pop_big", ev["res.k"], -9), ("blip_up", ev["res.photo"], -13), ("pop_big", ev["res.mp"], -10)]
sfx += [("riser_short", ev["sm.title"] - 0.1, -14), ("stamp", ev["sm.steady"], -10), ("pop", ev["sm.run"], -12), ("blip_jump", ev["sm.jump"], -12), ("hit", ev["sm.fall"], -11)]
sfx += [("pop_big", ev["wt.dive"], -11), ("pop_big", ev["wt.m"], -10), ("blip_up", ev["wt.screen"], -12), ("pop", ev["wt.self"], -12), ("shine", ev["wt.film"], -13)]
sfx += [("pop_big", ev["kit.case"], -11), ("pop_big", ev["kit.bat"], -11), ("ding", ev["kit.ready"], -12)]
sfx += [("hit", ev["trust.badge"], -8), ("blip_up", ev["trust.thumb"], -12)] + [("ding", t + 0.15, -12) for t in ev["trust.checks"]] + [("stamp", ev["trust.first"], -10)]
sfx += [("whoosh", 26.2, -10), ("pop_big", ev["cta.url"], -11), ("pop_big", ev["cta.message"], -11), ("pop", ev["cta.socials"] + 0.2, -13),
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
