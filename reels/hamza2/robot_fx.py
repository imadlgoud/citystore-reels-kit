"""Light robotic colour on Citybot's lines (L2, L4, L6, L7) for the Hamza episode-2 sketch.
Dry voice kept dominant so every word stays clear: + 22 % ring-modulated copy (55 Hz carrier) + a short metallic comb
(7 ms, feedback 0.35) mixed at 18 %; each line is re-matched to its original loudness. L8 (both) gets a lighter touch
(ring 8 %, comb 6 %). Clean originals are kept in public/hamza2/audio/vo_clean/ (first run copies them there; later runs
always start from the clean copies, so the effect is never applied twice)."""
import json, pathlib, shutil
import numpy as np, soundfile as sf, pyloudnorm as pyln

ROOT = pathlib.Path(__file__).resolve().parents[2]
VO = ROOT / "public" / "hamza2" / "audio" / "vo"
CLEAN = ROOT / "public" / "hamza2" / "audio" / "vo_clean"
LINES = json.loads((ROOT / "reels" / "hamza2" / "vo_lines.json").read_text())
CLEAN.mkdir(parents=True, exist_ok=True)

AMOUNT = {"citybot": (0.22, 0.18), "both": (0.08, 0.06)}


def robot(x, sr, ring, comb):
    t = np.arange(len(x)) / sr
    rm = x * np.sin(2 * np.pi * 55 * t)
    d = int(sr * 0.007)
    y = x.copy()
    for i in range(d, len(y)):
        y[i] = x[i] + 0.35 * y[i - d]
    y /= max(1e-9, np.abs(y).max()) / max(1e-9, np.abs(x).max())
    return (1 - ring - comb) * x + ring * rm * 1.6 + comb * y


for line in LINES:
    src = VO / f"{line['id']}.wav"
    keep = CLEAN / src.name
    if not keep.exists():
        shutil.copy(src, keep)
    x, sr = sf.read(keep)
    if line["speaker"] not in AMOUNT:
        shutil.copy(keep, src)
        continue
    ring, comb = AMOUNT[line["speaker"]]
    y = robot(x.astype(np.float64), sr, ring, comb)
    m = pyln.Meter(sr)
    lx, ly = m.integrated_loudness(x), m.integrated_loudness(y)
    y *= 10 ** ((lx - ly) / 20)
    sf.write(src, np.clip(y, -1, 1), sr)
    print(f"{line['id']} {line['speaker']:<8} ring {ring:.2f} comb {comb:.2f}  {lx:.1f} LUFS")
