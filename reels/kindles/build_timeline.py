"""Timeline for the Kindle Colorsoft + Kindle Scribe reel -> public/kindles/data/timeline.json
(35 s: on request the VO was sped up: pause trimming + the max 1.10x pitch-kept, VO ends at 31.6 s; over 30 s under the
standing approval; same schema as scripts/build_timeline.py; shared by the picture and the audio mix). Scene cuts sit
on the 120 BPM beat grid next to sentence breaks; hits land on the half-beat nearest the word that triggers them."""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
PUB = ROOT / "public" / "kindles"
VO = json.loads((PUB / "data" / "vo.json").read_text())
LINES = json.loads((ROOT / "reels" / "kindles" / "vo_lines.json").read_text())
FPS, BPM = 30, 120
BEAT = 60 / BPM
TOTAL_FRAMES, HOLD_FROM = 1050, 34.0
SCENES = [("hook", 0.0, 4.0), ("colorsoft", 4.0, 10.5), ("scribe", 10.5, 16.5), ("notes", 16.5, 21.25), ("eink", 21.25, 26.0),
          ("trust", 26.0, 29.5), ("cta", 29.5, 32.0), ("end", 32.0, 35.0)]


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
# HOOK - "read or write? here are two Kindles, each one great at something!"
ev["hook.slam"] = 0.0
ev["hook.botLand"] = 0.3
ev["hook.read"] = q(word_t(0, "تقرا"))
ev["hook.write"] = q(word_t(0, "تكتب"))
ev["hook.two"] = q(word_t(0, "جوج"))
ev["hook.best"] = q(word_t(0, "واعر"))
# KINDLE COLORSOFT - 16GB, 7" colour screen, books / comics / magazines, water resistant
ev["cs.name"] = q(word_t(1, "Colorsoft"))
ev["cs.gb"] = q(word_t(1, "16GB"))
ev["cs.size"] = q(word_t(1, "7"))
ev["cs.books"] = q(word_t(1, "للكتب"))
ev["cs.comics"] = q(word_t(1, "الكوميكس"))
ev["cs.mags"] = q(word_t(1, "والمجلات"))
ev["cs.water"] = q(word_t(1, "ومقاوم"))
# KINDLE SCRIBE - 16GB, Premium Pen, 10.2" screen, read and write like on paper
ev["sc.name"] = q(word_t(2, "Scribe"))
ev["sc.gb"] = q(word_t(2, "16GB"))
ev["sc.pen"] = q(word_t(2, "Premium"))
ev["sc.size"] = q(word_t(2, "10.2"))
ev["sc.read"] = q(word_t(2, "كتقرا"))
ev["sc.write"] = q(word_t(2, "وكتكتب"))
ev["sc.paper"] = q(word_t(2, "الكاغط"))
# NOTES - notes next to the books; handwriting -> text to share
ev["nt.notes"] = q(word_t(3, "الملاحظات"))
ev["nt.side"] = q(word_t(3, "فجنب"))
ev["nt.convert"] = q(word_t(3, "كيحوّل"))
ev["nt.text"] = q(word_t(3, "texte"))
ev["nt.share"] = q(word_t(3, "تبارطاجيها"))
# E INK + auto light (both)
ev["ei.both"] = q(word_t(4, "بجوج"))
ev["ei.eink"] = q(word_t(4, "E"))
ev["ei.eyes"] = q(word_t(4, "العينين"))
ev["ei.light"] = q(word_t(4, "lumière"))
ev["ei.auto"] = q(word_t(4, "بوحدها"))
# TRUST (plural, as spoken)
ev["trust.badge"] = 26.0
ev["trust.original"] = q(word_t(5, "originaux"))
ev["trust.thumb"] = ev["trust.original"]
ev["trust.checks"] = [q(word_t(5, "boîte")), q(nth(5, 4)), q(nth(5, 6))]
# CTA
ev["cta.url"] = 29.6
ev["cta.message"] = max(29.85, q(word_t(6, "تكوموندي")))
ev["cta.socials"] = ev["cta.message"] + 0.1
ev["cta.wave"] = ev["cta.message"] + 0.25
# END CARD
ev["end.city"] = 32.0
ev["end.typeStart"] = 32.2
ev["end.typeStep"] = 0.06
ev["end.icons"] = 32.75
ev["end.iconStep"] = 0.06
ev["end.tagline"] = 33.15
ev["end.wink"] = 33.4
ev["end.hold"] = HOLD_FROM

sfx = [("blip_jump", ev["hook.botLand"], -14), ("pop_big", ev["hook.read"], -11), ("pop_big", ev["hook.write"], -11), ("impact", ev["hook.two"], -8),
       ("shine", ev["hook.two"] + 0.2, -13), ("stamp", ev["hook.best"], -10)]
sfx += [("whoosh", end - 0.3, -9) for _, _, end in SCENES[:-3]]
sfx += [("impact", ev["cs.name"], -8), ("pop_big", ev["cs.gb"], -11), ("hit", ev["cs.size"], -9), ("pop", ev["cs.books"], -12), ("pop", ev["cs.comics"], -12),
        ("pop", ev["cs.mags"], -12), ("whoosh", ev["cs.water"], -12)]
sfx += [("impact", ev["sc.name"], -8), ("pop_big", ev["sc.gb"], -11), ("stamp", ev["sc.pen"], -10), ("hit", ev["sc.size"], -9), ("pop", ev["sc.read"], -12),
        ("blip_up", ev["sc.write"], -12), ("shine", ev["sc.paper"], -13)]
sfx += [("pop_big", ev["nt.notes"], -11), ("pop", ev["nt.side"], -12), ("riser_short", ev["nt.convert"], -14), ("ding", ev["nt.text"], -11), ("whoosh", ev["nt.share"], -12)]
sfx += [("pop_big", ev["ei.both"], -11), ("stamp", ev["ei.eink"], -10), ("shine", ev["ei.eyes"], -13), ("blip_up", ev["ei.light"], -12), ("pop", ev["ei.auto"], -12)]
sfx += [("hit", ev["trust.badge"], -8), ("blip_up", ev["trust.thumb"], -12)] + [("ding", t + 0.15, -12) for t in ev["trust.checks"]]
sfx += [("whoosh", 29.2, -10), ("pop_big", ev["cta.url"], -11), ("pop_big", ev["cta.message"], -11), ("pop", ev["cta.socials"] + 0.2, -13),
        ("blip", ev["cta.wave"], -13)]
sfx += [("whoosh", 31.7, -9), ("impact", ev["end.city"], -5)] + [("tick", ev["end.typeStart"] + i * ev["end.typeStep"], -12) for i in range(8)]
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
