"""Timeline for the WHOOP 5.0 (abonnement Peak) reel -> public/whoop/data/timeline.json
(31 s: tightest pauses + the max 1.10x speed-up put the VO end at 27.9 s, then the 3 s end card; over 30 s under the
standing approval; same schema as scripts/build_timeline.py; shared by the picture and the audio mix).
Scene cuts sit on the 120 BPM beat grid next to sentence breaks; hits land on the half-beat nearest the word that
triggers them."""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
PUB = ROOT / "public" / "whoop"
VO = json.loads((PUB / "data" / "vo.json").read_text())
LINES = json.loads((ROOT / "reels" / "whoop" / "vo_lines.json").read_text())
FPS, BPM = 30, 120
BEAT = 60 / BPM
TOTAL_FRAMES, HOLD_FROM = 930, 30.0
SCENES = [("hook", 0.0, 3.25), ("intro", 3.25, 6.5), ("band", 6.5, 11.0), ("recovery", 11.0, 14.5), ("battery", 14.5, 17.5),
          ("age", 17.5, 22.5), ("trust", 22.5, 26.0), ("cta", 26.0, 28.0), ("end", 28.0, 31.0)]


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
# HOOK - "no screen, no notifications... and it knows your health better than you": phone + alerts crossed out, band in
ev["hook.slam"] = 0.0
ev["hook.botLand"] = 0.3
ev["hook.screen"] = q(word_t(0, "شاشة"))
ev["hook.notif"] = q(word_t(0, "نوتيفيكاسيون"))
ev["hook.know"] = q(word_t(0, "وكتعرف"))
ev["hook.health"] = q(word_t(0, "صحتك"))
# INTRO
ev["intro.name"] = q(word_t(1, "WHOOP"))
ev["intro.peak"] = q(word_t(1, "abonnement"))
ev["intro.dispo"] = q(word_t(1, "disponible"))
# BAND - light, worn day and night, tracks heart, sleep, sport and recovery
ev["bd.band"] = q(word_t(2, "bracelet"))
ev["bd.light"] = q(word_t(2, "خفيف"))
ev["bd.day"] = q(word_t(2, "نهار"))
ev["bd.heart"] = q(word_t(2, "القلب"))
ev["bd.sleep"] = q(word_t(2, "النعاس"))
ev["bd.sport"] = q(word_t(2, "الرياضة"))
ev["bd.reco"] = q(word_t(2, "récupération"))
# RECOVERY - every morning: push hard or rest
ev["rc.morning"] = q(word_t(3, "صباح"))
ev["rc.body"] = q(word_t(3, "جسمك"))
ev["rc.push"] = q(word_t(3, "يخدم"))
ev["rc.rest"] = q(word_t(3, "يرتاح"))
# BATTERY - up to 14 days, charge it on the wrist
ev["bt.battery"] = q(word_t(4, "باطري"))
ev["bt.days"] = q(word_t(4, "14"))
ev["bt.charge"] = q(word_t(4, "وكتشارجيها"))
ev["bt.wrist"] = q(word_t(4, "فيدك"))
# HEALTHSPAN / WHOOP AGE
ev["ag.span"] = q(word_t(5, "Healthspan"))
ev["ag.age"] = q(word_t(5, "Age"))
ev["ag.body"] = q(word_t(5, "العمر"))
ev["ag.tips"] = q(word_t(5, "نصائح"))
ev["ag.better"] = q(word_t(5, "تحسّن"))
# TRUST
ev["trust.badge"] = 22.5
ev["trust.original"] = q(word_t(6, "original"))
ev["trust.thumb"] = ev["trust.original"]
ev["trust.checks"] = [q(word_t(6, "boîte")), q(nth(6, 4)), q(nth(6, 6))]
# CTA
ev["cta.url"] = 26.1
ev["cta.message"] = max(26.35, q(word_t(7, "تكوموندي")))
ev["cta.socials"] = ev["cta.message"] + 0.1
ev["cta.wave"] = ev["cta.message"] + 0.25
# END CARD
ev["end.city"] = 28.0
ev["end.typeStart"] = 28.2
ev["end.typeStep"] = 0.06
ev["end.icons"] = 28.75
ev["end.iconStep"] = 0.06
ev["end.tagline"] = 29.15
ev["end.wink"] = 29.4
ev["end.hold"] = HOLD_FROM

sfx = [("blip_jump", ev["hook.botLand"], -14), ("hit_small", ev["hook.screen"] + 0.15, -10), ("pop", ev["hook.notif"], -12),
       ("hit_small", ev["hook.notif"] + 0.4, -10), ("whoosh", ev["hook.know"] - 0.1, -11), ("stamp", ev["hook.health"], -9)]
sfx += [("whoosh", end - 0.3, -9) for _, _, end in SCENES[:-3]]
sfx += [("impact", ev["intro.name"], -7), ("shine", ev["intro.name"] + 0.2, -14), ("pop_big", ev["intro.peak"], -11), ("pop_big", ev["intro.dispo"], -11)]
sfx += [("pop_big", ev["bd.band"], -11), ("pop", ev["bd.light"], -12), ("blip_up", ev["bd.day"], -12)]
sfx += [("pop", t, -12) for t in (ev["bd.heart"], ev["bd.sleep"], ev["bd.sport"], ev["bd.reco"])]
sfx += [("shine", ev["rc.morning"], -13), ("riser_short", ev["rc.body"], -14), ("ding", ev["rc.push"], -11), ("pop", ev["rc.rest"], -12)]
sfx += [("pop_big", ev["bt.battery"], -11), ("hit", ev["bt.days"], -9), ("whoosh", ev["bt.charge"], -12), ("stamp", ev["bt.wrist"], -10)]
sfx += [("pop_big", ev["ag.span"], -11), ("shine", ev["ag.age"], -13), ("blip_up", ev["ag.body"], -12), ("pop", ev["ag.tips"], -12), ("pop", ev["ag.better"], -12)]
sfx += [("hit", ev["trust.badge"], -8), ("blip_up", ev["trust.thumb"], -12)] + [("ding", t + 0.15, -12) for t in ev["trust.checks"]]
sfx += [("whoosh", 25.7, -10), ("pop_big", ev["cta.url"], -11), ("pop_big", ev["cta.message"], -11), ("pop", ev["cta.socials"] + 0.2, -13),
        ("blip", ev["cta.wave"], -13)]
sfx += [("whoosh", 27.7, -9), ("impact", ev["end.city"], -5)] + [("tick", ev["end.typeStart"] + i * ev["end.typeStep"], -12) for i in range(8)]
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
