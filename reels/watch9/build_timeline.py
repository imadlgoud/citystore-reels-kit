"""Timeline for the Galaxy Watch9 40mm LTE Black reel -> public/watch9/data/timeline.json
(30 s: fits at natural speed with pause trimming; same schema as scripts/build_timeline.py; shared by the
picture and the audio mix). Scene cuts sit on the 120 BPM beat grid next to sentence breaks; hits land on the
half-beat nearest the word that triggers them."""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
PUB = ROOT / "public" / "watch9"
VO = json.loads((PUB / "data" / "vo.json").read_text())
LINES = json.loads((ROOT / "reels" / "watch9" / "vo_lines.json").read_text())
FPS, BPM = 30, 120
BEAT = 60 / BPM
TOTAL_FRAMES, HOLD_FROM = 900, 29.0
SCENES = [("hook", 0.0, 3.0), ("intro", 3.0, 6.5), ("lte", 6.5, 12.25), ("chip", 12.25, 16.25), ("battery", 16.25, 19.5),
          ("gemini", 19.5, 22.25), ("trust", 22.25, 25.75), ("cta", 25.75, 27.75), ("end", 27.75, 30.0)]


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
# HOOK - a drawn gift box shakes, pops open on "خرجات" and the new watch rises out; "NOUVEAU" + store pill
ev["hook.slam"] = 0.0
ev["hook.botLand"] = 0.3
ev["hook.open"] = q(word_t(0, "خرجات"))
ev["hook.store"] = q(word_t(0, "City"))
# INTRO
ev["intro.name"] = q(VO[1]["start"] + 0.1)
ev["intro.mm"] = q(word_t(1, "40mm"))
ev["intro.lte"] = q(word_t(1, "LTE"))
ev["intro.black"] = q(word_t(1, "Black"))
# LTE
ev["lte.lte"] = q(word_t(2, "LTE"))
ev["lte.call"] = q(word_t(2, "كتعيّط"))
ev["lte.answer"] = q(word_t(2, "كتجاوب"))
ev["lte.msgs"] = q(word_t(2, "الميساجات"))
ev["lte.anywhere"] = q(word_t(2, "المݣانة"))
ev["lte.home"] = q(word_t(2, "تخلي"))
# CHIP
ev["chip.proc"] = q(word_t(3, "processeur"))
ev["chip.name"] = q(word_t(3, "Snapdragon"))
ev["chip.new"] = q(word_t(3, "جديد"))
ev["chip.fast"] = q(word_t(3, "سريعة"))
ev["chip.light"] = q(word_t(3, "وخفيفة"))
ev["chip.wrist"] = q(word_t(3, "فاليد"))
# BATTERY
ev["bat.bat"] = q(word_t(4, "باطري"))
ev["bat.more"] = q(word_t(4, "أكبر"))
ev["bat.pct"] = q(word_t(4, "20%"))
ev["bat.w8"] = q(word_t(4, "Watch8"))
ev["bat.size"] = q(word_t(4, "الحجم"))
# GEMINI + HEALTH
ev["gem.gemini"] = q(word_t(5, "Gemini"))
ev["gem.heart"] = q(word_t(5, "القلب"))
ev["gem.sleep"] = q(word_t(5, "النعاس"))
ev["gem.sport"] = q(word_t(5, "والرياضة"))
# TRUST
ev["trust.badge"] = 22.25
ev["trust.original"] = q(word_t(6, "original"))
ev["trust.thumb"] = ev["trust.original"]
ev["trust.checks"] = [q(word_t(6, "boîte")), q(nth(6, 4)), q(nth(6, 6))]
# CTA
ev["cta.url"] = 25.9
ev["cta.message"] = q(word_t(7, "تكوموندي"))
ev["cta.socials"] = ev["cta.message"] + 0.1
ev["cta.wave"] = ev["cta.message"] + 0.25
# END CARD (fast 30 s version, as in the disc/gopro reels)
ev["end.city"] = 27.75
ev["end.typeStart"] = 27.9
ev["end.typeStep"] = 0.05
ev["end.icons"] = 28.25
ev["end.iconStep"] = 0.05
ev["end.tagline"] = 28.5
ev["end.wink"] = 28.7
ev["end.hold"] = HOLD_FROM

sfx = [("blip_jump", ev["hook.botLand"], -14), ("tap", 0.5, -12), ("tap", 0.75, -13), ("impact", ev["hook.open"], -8),
       ("shine", ev["hook.open"] + 0.2, -13), ("pop_big", ev["hook.store"], -11)]
sfx += [("whoosh", end - 0.3, -9) for _, _, end in SCENES[:-3]]
sfx += [("impact", ev["intro.name"], -8), ("shine", ev["intro.name"] + 0.25, -15), ("pop_big", ev["intro.mm"], -12),
        ("pop_big", ev["intro.lte"], -12), ("pop", ev["intro.black"], -13)]
sfx += [("stamp", ev["lte.lte"], -10), ("blip", ev["lte.call"], -11), ("blip", ev["lte.call"] + 0.25, -12), ("ding", ev["lte.answer"], -12),
        ("pop", ev["lte.msgs"], -12), ("pop", ev["lte.msgs"] + 0.25, -13), ("blip_up", ev["lte.anywhere"], -13), ("pop_big", ev["lte.home"], -12)]
sfx += [("impact", ev["chip.proc"], -9), ("pop_big", ev["chip.name"], -11), ("stamp", ev["chip.new"], -10), ("whoosh", ev["chip.fast"], -11),
        ("blip_jump", ev["chip.light"], -13), ("pop", ev["chip.wrist"], -12)]
sfx += [("riser_short", ev["bat.bat"], -15), ("pop_big", ev["bat.more"], -12), ("hit", ev["bat.pct"], -9), ("pop", ev["bat.w8"], -12), ("ding", ev["bat.size"], -12)]
sfx += [("shine", ev["gem.gemini"], -11), ("pop_big", ev["gem.gemini"], -13), ("pop", ev["gem.heart"], -12), ("pop", ev["gem.sleep"], -12), ("pop", ev["gem.sport"], -12)]
sfx += [("hit", ev["trust.badge"], -8), ("blip_up", ev["trust.thumb"], -12)] + [("ding", t + 0.15, -12) for t in ev["trust.checks"]]
sfx += [("whoosh", 25.45, -10), ("pop_big", ev["cta.url"], -11), ("pop_big", ev["cta.message"], -11), ("pop", ev["cta.socials"] + 0.2, -13),
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
