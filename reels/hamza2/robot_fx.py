"""Clean robotic colour on Citybot's lines (L2, L4, L6, L7) for the Hamza episode-2 sketch (v2: no buzz).
v1 used a 55 Hz ring modulator + a feedback comb: the ring-mod sidebands and the comb resonance read as noise/growl.
v2 is tonal and clean (ffmpeg):
  - dry voice 70 %
  - a +1.5-semitone double (rubberband, formants preserved), 9 ms later, 30 %  -> synthetic "robot" shimmer
  - a static 4 ms copy, 12 % (no feedback)                                     -> light metallic tint
  - speaker EQ: high-pass 110 Hz, +3 dB presence at 2.8 kHz, low-pass 9.5 kHz, gentle de-ess
Each line is re-matched to its original loudness. L8 (both) gets a lighter touch. Clean originals stay in
public/hamza2/audio/vo_clean/ and every run starts from them, so the effect is never stacked."""
import json, pathlib, shutil, subprocess
import numpy as np, soundfile as sf, pyloudnorm as pyln

ROOT = pathlib.Path(__file__).resolve().parents[2]
VO = ROOT / "public" / "hamza2" / "audio" / "vo"
CLEAN = ROOT / "public" / "hamza2" / "audio" / "vo_clean"
LINES = json.loads((ROOT / "reels" / "hamza2" / "vo_lines.json").read_text())
CLEAN.mkdir(parents=True, exist_ok=True)
AMOUNT = {"citybot": (0.70, 0.30, 0.12), "both": (0.85, 0.15, 0.06)}  # dry, pitched double, metallic tint

for line in LINES:
    src = VO / f"{line['id']}.wav"
    keep = CLEAN / src.name
    if not keep.exists():
        shutil.copy(src, keep)
    if line["speaker"] not in AMOUNT:
        shutil.copy(keep, src)
        continue
    dry, wet, tint = AMOUNT[line["speaker"]]
    fc = (f"[0:a]asplit=3[d][w][c];"
          f"[w]rubberband=pitch=1.0905:formant=preserved,adelay=9,volume={wet}[w2];"
          f"[c]adelay=4,volume={tint}[c2];[d]volume={dry}[d2];"
          f"[d2][w2][c2]amix=inputs=3:normalize=0,highpass=f=110,equalizer=f=2800:t=q:w=1.2:g=3,lowpass=f=9500,deesser=i=0.3[out]")
    tmp = src.with_suffix(".fx.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(keep), "-filter_complex", fc, "-map", "[out]", "-ar", "48000", "-ac", "1", str(tmp)], check=True)
    x, sr = sf.read(keep)
    y, _ = sf.read(tmp)
    y = y[: len(x)] if len(y) >= len(x) else np.pad(y, (0, len(x) - len(y)))
    m = pyln.Meter(sr)
    lx, ly = m.integrated_loudness(x), m.integrated_loudness(y)
    y *= 10 ** ((lx - ly) / 20)
    sf.write(src, np.clip(y, -1, 1), sr)
    tmp.unlink()
    print(f"{line['id']} {line['speaker']:<8} dry {dry} double {wet} tint {tint}  {lx:.1f} LUFS")
