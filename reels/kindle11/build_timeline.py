"""Timeline for the Amazon Kindle 11th gen (basic, 6", 16GB, Black) reel -> public/kindle11/data/timeline.json
(30 s; same schema as scripts/build_timeline.py; shared by the picture and the audio mix).
Scene cuts sit on the 120 BPM beat grid next to sentence breaks; hits land on the half-beat nearest the word
that triggers them."""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
PUB = ROOT / "public" / "kindle11"
VO = json.loads((PUB / "data" / "vo.json").read_text())
LINES = json.loads((ROOT / "reels" / "kindle11" / "vo_lines.json").read_text())
FPS, BPM = 30, 120
BEAT = 60 / BPM
TOTAL_FRAMES, HOLD_FROM = 900, 29.0
SCENES = [("hook", 0.0, 2.25), ("intro", 2.25, 5.75), ("screen", 5.75, 10.75), ("storage", 10.75, 15.0), ("light", 15.0, 19.0),
          ("battery", 19.0, 22.75), ("trust", 22.75, 26.75), ("cta", 26.75, 28.25), ("end", 28.25, 30.0)]


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

# HOOK - a stack of books shrinks into the Kindle, which slides into a jeans pocket
ev["hook.slam"] = 0.0
ev["hook.botLand"] = 0.3
ev["hook.books"] = 0.0
ev["hook.shrink"] = q(word_t(0, "الكتب"))
ev["hook.pocket"] = q(word_t(0, "فجيبك"))
# INTRO
ev["intro.name"] = q(word_t(1, "Kindle"))
ev["intro.gen"] = q(word_t(1, "11e"))
ev["intro.black"] = q(word_t(1, "Noir"))
ev["intro.dispo"] = q(word_t(1, "disponible"))
# SCREEN
ev["sc.size"] = q(word_t(2, "6"))
ev["sc.eink"] = q(word_t(2, "Ink"))
ev["sc.paper"] = q(word_t(2, "الورق"))
ev["sc.eyes"] = q(word_t(2, "كيعييش"))
ev["sc.sun"] = q(word_t(2, "فالشمس"))
# STORAGE + LIGHT WEIGHT
ev["st.gb"] = q(word_t(3, "16GB"))
ev["st.books"] = q(word_t(3, "آلاف"))
ev["st.light"] = q(word_t(3, "وخفيف"))
ev["st.hand"] = q(word_t(3, "فاليد"))
# FRONT LIGHT + DARK MODE
ev["li.light"] = q(word_t(4, "lumière"))
ev["li.dark"] = q(word_t(4, "sombre"))
ev["li.night"] = q(word_t(4, "فالليل"))
ev["li.lamp"] = q(word_t(4, "تشعل"))
# BATTERY + USB-C
ev["bat.weeks"] = q(word_t(5, "6"))
ev["bat.usbc"] = q(word_t(5, "USB-C"))
# TRUST
ev["trust.badge"] = 22.75
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

sfx = [("blip_jump", ev["hook.botLand"], -14), ("pop_big", 0.1, -11), ("whoosh", ev["hook.shrink"], -11), ("pop_big", ev["hook.shrink"] + 0.3, -11),
       ("whoosh", ev["hook.pocket"], -11), ("hit_small", ev["hook.pocket"] + 0.35, -10)]
sfx += [("whoosh", end - 0.3, -9) for _, _, end in SCENES[:-3]]
sfx += [("impact", ev["intro.name"], -7), ("shine", ev["intro.name"] + 0.2, -14), ("stamp", ev["intro.gen"], -11), ("pop", ev["intro.black"], -12), ("pop_big", ev["intro.dispo"], -11)]
sfx += [("pop_big", ev["sc.size"], -10), ("stamp", ev["sc.eink"], -10), ("shine", ev["sc.paper"], -13), ("pop", ev["sc.eyes"], -12), ("blip_up", ev["sc.sun"], -12)]
sfx += [("pop_big", ev["st.gb"], -10), ("pop", ev["st.books"], -12), ("pop", ev["st.books"] + 0.2, -13), ("pop", ev["st.books"] + 0.4, -14), ("blip_jump", ev["st.light"], -13), ("pop", ev["st.hand"], -12)]
sfx += [("shine", ev["li.light"], -11), ("whoosh", ev["li.dark"], -12), ("blip", ev["li.night"], -13), ("pop", ev["li.lamp"], -12)]
sfx += [("riser_short", ev["bat.weeks"] - 0.2, -15), ("pop_big", ev["bat.weeks"], -10), ("whoosh", ev["bat.usbc"] - 0.15, -13), ("stamp", ev["bat.usbc"] + 0.2, -11)]
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
