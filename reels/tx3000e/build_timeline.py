"""Timeline for the TP-Link Archer TX3000E reel -> public/tx3000e/data/timeline.json
(30 s: pause trimming + 1.074x pitch-kept speed-up put the VO end at 27.6 s; same schema as scripts/build_timeline.py;
shared by the picture and the audio mix). Scene cuts sit on the 120 BPM beat grid next to sentence breaks; hits land
on the half-beat nearest the word that triggers them."""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
PUB = ROOT / "public" / "tx3000e"
VO = json.loads((PUB / "data" / "vo.json").read_text())
LINES = json.loads((ROOT / "reels" / "tx3000e" / "vo_lines.json").read_text())
FPS, BPM = 30, 120
BEAT = 60 / BPM
TOTAL_FRAMES, HOLD_FROM = 900, 29.0
SCENES = [("hook", 0.0, 4.0), ("intro", 4.0, 8.75), ("wifi", 8.75, 15.5), ("bt", 15.5, 19.0), ("ant", 19.0, 22.5),
          ("trust", 22.5, 25.75), ("cta", 25.75, 27.75), ("end", 27.75, 30.0)]


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
# HOOK - "your PC's Wi-Fi still drops? don't buy a USB Wi-Fi dongle before you see this!"
ev["hook.slam"] = 0.0
ev["hook.botLand"] = 0.3
ev["hook.wifi"] = q(word_t(0, "Wi-Fi"))
ev["hook.cut"] = q(word_t(0, "كيقطع"))
ev["hook.dont"] = q(word_t(0, "تشريش"))
ev["hook.usb"] = q(word_t(0, "USB"))
# INTRO - TP-Link Archer TX3000E, PCIe card, Wi-Fi 6 + Bluetooth 5.0, DISPONIBLE
ev["intro.name"] = max(4.1, q(word_t(1, "TP-Link")))
ev["intro.model"] = q(word_t(1, "Archer"))
ev["intro.pcie"] = q(word_t(1, "carte"))
ev["intro.wifi"] = q(word_t(1, "Wi-Fi"))
ev["intro.bt"] = q(word_t(1, "Bluetooth"))
ev["intro.dispo"] = q(word_t(1, "disponible"))
# WI-FI 6 - AX3000, up to 2400 Mbps, fast downloads, stable connection for gaming
ev["wf.name"] = max(8.85, q(word_t(2, "Wi-Fi")))
ev["wf.ax"] = q(word_t(2, "AX3000"))
ev["wf.speed"] = q(word_t(2, "2400"))
ev["wf.dl"] = q(word_t(2, "téléchargement"))
ev["wf.stable"] = q(word_t(2, "connexion"))
ev["wf.gaming"] = q(word_t(2, "gaming"))
# BLUETOOTH 5.0 - headset, controller, mouse, wireless
ev["bt.name"] = q(word_t(3, "Bluetooth"))
ev["bt.head"] = q(word_t(3, "الكاسك"))
ev["bt.pad"] = q(word_t(3, "manette"))
ev["bt.mouse"] = q(word_t(3, "والسوري"))
ev["bt.free"] = q(word_t(3, "fil"))
# ANTENNAS - two antennas on a magnetic base, put them where you want for the best signal
ev["an.name"] = q(word_t(4, "antennes"))
ev["an.mag"] = q(word_t(4, "magnétique"))
ev["an.move"] = q(word_t(4, "حطهم"))
ev["an.best"] = q(word_t(4, "أحسن"))
# TRUST (singular, as spoken)
ev["trust.badge"] = 22.5
ev["trust.original"] = q(word_t(5, "original"))
ev["trust.thumb"] = ev["trust.original"]
ev["trust.checks"] = [q(word_t(5, "boîte")), q(nth(5, 4)), q(nth(5, 6))]
# CTA
ev["cta.url"] = 25.85
ev["cta.message"] = max(26.1, q(word_t(6, "تكوموندي")))
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

sfx = [("blip_jump", ev["hook.botLand"], -14), ("pop", ev["hook.wifi"], -12), ("hit_small", ev["hook.cut"], -10), ("stamp", ev["hook.dont"], -9),
       ("pop", ev["hook.usb"], -12)]
sfx += [("whoosh", end - 0.3, -9) for _, _, end in SCENES[:-3]]
sfx += [("impact", ev["intro.name"], -7), ("shine", ev["intro.model"], -13), ("pop", ev["intro.pcie"], -12), ("pop", ev["intro.wifi"], -12),
        ("pop", ev["intro.bt"], -12), ("stamp", ev["intro.dispo"], -10)]
sfx += [("pop_big", ev["wf.name"], -11), ("pop", ev["wf.ax"], -12), ("hit", ev["wf.speed"], -8), ("blip_up", ev["wf.dl"], -12), ("pop", ev["wf.stable"], -12),
        ("ding", ev["wf.gaming"], -12)]
sfx += [("pop_big", ev["bt.name"], -11), ("blip", ev["bt.head"], -12), ("blip", ev["bt.pad"], -12), ("blip", ev["bt.mouse"], -12), ("shine", ev["bt.free"], -12)]
sfx += [("pop_big", ev["an.name"], -11), ("hit_small", ev["an.mag"], -11), ("whoosh", ev["an.move"], -12), ("blip_up", ev["an.best"], -12)]
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
print({k: v for k, v in ev.items() if not k.startswith("end.")})
