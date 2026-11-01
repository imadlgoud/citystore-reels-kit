"""Timeline for the EA SPORTS FC 27 (PS5) reel -> public/fc27/data/timeline.json
(30 s: pause trimming with 0.25 s sentence breaks, natural speed, VO ends at 27.4 s; same schema as
scripts/build_timeline.py; shared by the picture and the audio mix). Scene cuts sit on the 120 BPM beat grid next to
sentence breaks; hits land on the half-beat nearest the word that triggers them."""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
PUB = ROOT / "public" / "fc27"
VO = json.loads((PUB / "data" / "vo.json").read_text())
LINES = json.loads((ROOT / "reels" / "fc27" / "vo_lines.json").read_text())
FPS, BPM = 30, 120
BEAT = 60 / BPM
TOTAL_FRAMES, HOLD_FROM = 900, 29.0
SCENES = [("hook", 0.0, 3.5), ("intro", 3.5, 7.5), ("game", 7.5, 12.75), ("modes", 12.75, 17.25), ("leagues", 17.25, 21.5),
          ("trust", 21.5, 25.0), ("cta", 25.0, 27.75), ("end", 27.75, 30.0)]


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
# HOOK - "your friends play FC 27 and you're still on the old one?"
ev["hook.slam"] = 0.0
ev["hook.botLand"] = 0.3
ev["hook.friends"] = q(word_t(0, "كيلعبو"))
ev["hook.fc27"] = q(word_t(0, "FC"))
ev["hook.you"] = q(word_t(0, "وانت"))
ev["hook.old"] = q(word_t(0, "فالقديمة"))
# INTRO - EA SPORTS FC 27, PS5, DISPONIBLE
ev["intro.name"] = q(word_t(1, "EA"))
ev["intro.ps5"] = q(word_t(1, "PS5"))
ev["intro.dispo"] = q(word_t(1, "disponible"))
# THE GAME - n°1 football game, latest teams, players and line-ups of the season
ev["gm.one"] = q(word_t(2, "رقم"))
ev["gm.world"] = q(word_t(2, "فالعالم"))
ev["gm.teams"] = q(word_t(2, "الفرق"))
ev["gm.players"] = q(word_t(2, "اللاعبين"))
ev["gm.form"] = q(word_t(2, "والتشكيلات"))
# MODES - new The Grounds, plus Career, Ultimate Team and matches with friends
ev["md.new"] = q(word_t(3, "جديد"))
ev["md.grounds"] = q(word_t(3, "Grounds"))
ev["md.career"] = q(word_t(3, "Career"))
ev["md.ut"] = q(word_t(3, "Ultimate"))
ev["md.friends"] = q(word_t(3, "والماتشات"))
# LEAGUES - LaLiga, Champions League and many more, all in one game
ev["lg.laliga"] = q(word_t(4, "LaLiga"))
ev["lg.ucl"] = q(word_t(4, "Champions"))
ev["lg.more"] = q(word_t(4, "وبزاف"))
ev["lg.one"] = q(word_t(4, "كلهم"))
# TRUST - "Produit original، neuf، boîte fermée، jamais ouvert" (three checks, as spoken)
ev["trust.badge"] = 21.5
ev["trust.original"] = q(word_t(5, "original"))
ev["trust.thumb"] = ev["trust.original"]
ev["trust.checks"] = [q(word_t(5, "neuf")), q(word_t(5, "boîte")), q(word_t(5, "jamais"))]
# CTA
ev["cta.url"] = 25.1
ev["cta.message"] = max(25.35, q(word_t(6, "تكوموندي")))
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

sfx = [("blip_jump", ev["hook.botLand"], -14), ("pop_big", ev["hook.friends"], -11), ("shine", ev["hook.fc27"], -12), ("pop", ev["hook.you"], -12),
       ("hit_small", ev["hook.old"], -9), ("blip", ev["hook.old"] + 0.3, -12)]
sfx += [("whoosh", end - 0.3, -9) for _, _, end in SCENES[:-3]]
sfx += [("impact", ev["intro.name"], -7), ("shine", ev["intro.name"] + 0.2, -14), ("pop_big", ev["intro.ps5"], -11), ("pop_big", ev["intro.dispo"], -11)]
sfx += [("stamp", ev["gm.one"], -9), ("shine", ev["gm.world"], -13), ("pop", ev["gm.teams"], -12), ("pop", ev["gm.players"], -12), ("riser_short", ev["gm.form"] - 0.1, -15), ("ding", ev["gm.form"] + 0.3, -12)]
sfx += [("pop_big", ev["md.new"], -11), ("stamp", ev["md.grounds"], -10), ("pop", ev["md.career"], -12), ("pop", ev["md.ut"], -12), ("pop", ev["md.friends"], -12)]
sfx += [("pop_big", ev["lg.laliga"], -11), ("pop_big", ev["lg.ucl"], -11), ("pop", ev["lg.more"], -12), ("impact", ev["lg.one"], -8)]
sfx += [("hit", ev["trust.badge"], -8), ("blip_up", ev["trust.thumb"], -12)] + [("ding", t + 0.15, -12) for t in ev["trust.checks"]]
sfx += [("whoosh", 24.7, -10), ("pop_big", ev["cta.url"], -11), ("pop_big", ev["cta.message"], -11), ("pop", ev["cta.socials"] + 0.2, -13),
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
