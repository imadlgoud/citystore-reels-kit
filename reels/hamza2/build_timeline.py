"""Timeline for the Hamza & Citybot episode 2 sketch "الكورة قد النملة" (iPhone Duo) -> public/hamza2/data/timeline.json
Scenes follow the recorded lines (one scene per line, cut at each line start), not fixed numbers. VO 0.25-23.28 s at
natural speed; end card from L8, final frame held from 23.45 s, reel ends at 23.6 s (708 frames). Each VO entry carries
its speaker so only that character lip-syncs (both on L8)."""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
PUB = ROOT / "public" / "hamza2"
VO = json.loads((PUB / "data" / "vo.json").read_text())
LINES = json.loads((ROOT / "reels" / "hamza2" / "vo_lines.json").read_text())
FPS, BPM = 30, 120
BEAT = 60 / BPM
TOTAL_FRAMES, HOLD_FROM = 708, 23.45
LS = [l["start"] for l in VO]
SCENES = [("s1", 0.0, LS[1]), ("s2", LS[1], LS[2]), ("s3", LS[2], LS[3]), ("s4", LS[3], LS[4]), ("s5", LS[4], LS[5]),
          ("s6", LS[5], LS[6]), ("s7", LS[6], LS[7]), ("end", LS[7], TOTAL_FRAMES / FPS)]


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
r = lambda t: round(t, 3)  # exact word times (sketch acting is lip-synced, not beat-snapped)
# S1 / L1 - Hamza squints at the match on his phone; on "النملة" an ant walks next to the tiny ball
ev["s1.closeup"] = r(word_t(0, "فالتيليفون") + 0.15)
ev["s1.ant"] = r(word_t(0, "النملة"))
# S2 / L2 - phone glows, Citybot bursts out, brand takes over; on "iPhone Duo" a box drops and the folded Duo rises
ev["s2.glow"] = r(LS[1])
ev["s2.burst"] = r(LS[1] + 0.3)
ev["s2.tv"] = r(word_t(1, "تلفزة"))
ev["s2.look"] = r(word_t(1, "شوف"))
ev["s2.box"] = r(word_t(1, "iPhone") - 0.2)
ev["s2.rise"] = r(word_t(1, "Duo"))
# S3 / L3 - Citybot unfolds the Duo (book-style hinge); Hamza's jaw drops, question marks
ev["s3.unfold"] = r(LS[2] + 0.15)
ev["s3.jaw"] = r(word_t(2, "آش"))
ev["s3.q1"] = r(word_t(2, "تيليفون"))
ev["s3.q2"] = r(word_t(2, "تابليت"))
# S4 / L4 - folded 5.4" vs open 7.6" with the match big and clear; colour swatches
ev["s4.both"] = r(word_t(3, "بجوج"))
ev["s4.folded"] = r(word_t(3, "مطوي"))
ev["s4.open"] = r(word_t(3, "ومحلول"))
ev["s4.biggest"] = r(word_t(3, "أكبر"))
ev["s4.colors"] = r(word_t(3, "فتاريخ"))
# S5 / L5 - Hamza suspicious, one eyebrow up, big "؟"
ev["s5.lean"] = r(LS[4])
ev["s5.q"] = r(word_t(4, "أوريجينال"))
# S6 / L6 - Citybot winks, checkmark on its face on "ديما", three badges stamp in
ev["s6.city"] = r(word_t(5, "City"))
ev["s6.always"] = r(word_t(5, "ديما"))
ev["s6.b1"] = r(word_t(5, "boîte"))
ev["s6.b2"] = r(nth(5, 6))
ev["s6.b3"] = r(nth(5, 8))
# S7 / L7 - CTA: Hamza holds the open Duo; message bubble on "ميساج", citystore.ma types in
ev["s7.msg"] = r(word_t(6, "ميساج"))
ev["s7.url"] = r(word_t(6, "citystore.ma"))
# END / L8 - logo reveal, tagline, high-five; hold
ev["end.city"] = r(LS[7] + 0.05)
ev["end.typeStart"] = r(LS[7] + 0.3)
ev["end.typeStep"] = 0.05
ev["end.icons"] = r(LS[7] + 0.75)
ev["end.iconStep"] = 0.05
ev["end.tagline"] = r(word_t(7, "الأصلي"))
ev["end.wink"] = r(word_t(7, "ديما"))
ev["end.five"] = r(word_t(7, "ديما") + 0.35)
ev["end.hold"] = HOLD_FROM

sfx = [("crowd", 0.1, -26), ("tap", ev["s1.closeup"], -16), ("blip", ev["s1.ant"], -14),
       ("riser_short", ev["s2.glow"] - 0.2, -14), ("impact", ev["s2.burst"], -8), ("whoosh", ev["s2.burst"] + 0.1, -11),
       ("pop", ev["s2.tv"], -15), ("hit_small", ev["s2.box"], -11), ("shine", ev["s2.rise"], -12),
       ("whoosh", ev["s3.unfold"], -11), ("shutter", ev["s3.unfold"] + 0.55, -14), ("pop", ev["s3.q1"], -14), ("pop", ev["s3.q2"], -13),
       ("pop", ev["s4.folded"], -13), ("whoosh", ev["s4.open"], -12), ("shutter", ev["s4.open"] + 0.45, -15), ("crowd", ev["s4.open"] + 0.3, -20),
       ("ding", ev["s4.biggest"], -13), ("pop", ev["s4.colors"], -15),
       ("hit_small", ev["s5.q"], -12),
       ("blip_wink", ev["s6.always"], -12)] + [("stamp", ev[k], -10) for k in ("s6.b1", "s6.b2", "s6.b3")] + [
       ("pop_big", ev["s7.msg"], -12)] + [("tick", ev["s7.url"] + i * 0.05, -14) for i in range(12)] + [
       ("whoosh", LS[7] - 0.3, -10), ("impact", ev["end.city"], -6)] + [("tick", ev["end.typeStart"] + i * ev["end.typeStep"], -13) for i in range(8)] + [
       ("pop", ev["end.icons"] + i * ev["end.iconStep"], -16) for i in range(6)] + [("shine", ev["end.tagline"], -14), ("hit", ev["end.five"], -9)]


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
    "vo": [{"id": l["id"], "speaker": LINES[i]["speaker"], "from": f(l["start"]), "start": l["start"], "duration": l["duration"], "mouthCues": l["mouthCues"]} for i, l in enumerate(VO)],
}
assert VO[-1]["start"] + VO[-1]["duration"] <= HOLD_FROM + 0.01, "VO must end before the final-frame hold"
(PUB / "data" / "timeline.json").write_text(json.dumps(timeline, ensure_ascii=False, indent=1) + "\n")
for s in timeline["subtitles"]:
    print(f'{s["start"]:6.2f}-{s["end"]:6.2f}  {s["text"]}')
print(ev)
