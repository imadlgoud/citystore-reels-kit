import React from "react";
import { useLayout } from "../../layout";

/*
 * Hamza's living room (warm, soft palette): plaster wall, a zellige band (8-point stars), a floor lamp with a warm glow,
 * a rug, a leather pouf and a flat sofa. RoomBack sits behind Hamza; SofaFront (seat + arm rests) is drawn over his
 * lower body so he reads as sitting. Everything is laid out from the frame size (9:16 or 1:1).
 */
const Star: React.FC<{ x: number; y: number; r: number; fill: string }> = ({ x, y, r, fill }) => {
  const pts = Array.from({ length: 16 }, (_, i) => {
    const a = (Math.PI / 8) * i;
    const rr = i % 2 ? r * 0.62 : r;
    return `${x + Math.cos(a) * rr},${y + Math.sin(a) * rr}`;
  }).join(" ");
  return <polygon points={pts} fill={fill} />;
};

export const RoomBack: React.FC<{ sofaTop: number }> = ({ sofaTop }) => {
  const { w, h } = useLayout();
  const bandY = sofaTop - (h > w ? 330 : 230), bandH = h > w ? 120 : 90;
  const cell = bandH;
  return (
    <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="h2wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F6E3C3" />
          <stop offset="1" stopColor="#EBC995" />
        </linearGradient>
        <radialGradient id="h2lamp">
          <stop offset="0" stopColor="#FFE7A8" stopOpacity="0.85" />
          <stop offset="1" stopColor="#FFE7A8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={w} height={h} fill="url(#h2wall)" />
      {/* zellige band */}
      <rect x={0} y={bandY} width={w} height={bandH} fill="#1F7A72" />
      {Array.from({ length: Math.ceil(w / cell) + 1 }).map((_, i) => (
        <g key={i}>
          <Star x={i * cell + cell / 2} y={bandY + bandH / 2} r={bandH * 0.36} fill="#F3E4C8" />
          <Star x={i * cell + cell / 2} y={bandY + bandH / 2} r={bandH * 0.2} fill="#C9603F" />
          <circle cx={i * cell} cy={bandY + bandH / 2} r={bandH * 0.1} fill="#E9B44C" />
        </g>
      ))}
      <rect x={0} y={bandY - 8} width={w} height={8} fill="#B5833F" />
      <rect x={0} y={bandY + bandH} width={w} height={8} fill="#B5833F" />
      {/* floor lamp (right) */}
      <circle cx={w * 0.86} cy={sofaTop - (h > w ? 520 : 330)} r={h > w ? 260 : 190} fill="url(#h2lamp)" />
      <line x1={w * 0.86} y1={sofaTop - (h > w ? 470 : 300)} x2={w * 0.86} y2={sofaTop + 330} stroke="#5A3B26" strokeWidth={10} />
      <path d={`M${w * 0.86 - 80} ${sofaTop - (h > w ? 470 : 300)} L${w * 0.86 - 52} ${sofaTop - (h > w ? 590 : 390)} L${w * 0.86 + 52} ${sofaTop - (h > w ? 590 : 390)} L${w * 0.86 + 80} ${sofaTop - (h > w ? 470 : 300)} Z`} fill="#F2C76B" stroke="#5A3B26" strokeWidth={6} />
      {/* floor + rug */}
      <rect x={0} y={sofaTop + 300} width={w} height={h} fill="#B98458" />
      <ellipse cx={w / 2} cy={sofaTop + 420} rx={w * 0.46} ry={70} fill="#9B2F2B" />
      <ellipse cx={w / 2} cy={sofaTop + 420} rx={w * 0.4} ry={52} fill="none" stroke="#E9B44C" strokeWidth={6} strokeDasharray="18 12" />
      {/* sofa back */}
      <rect x={w * 0.08} y={sofaTop - 150} width={w * 0.84} height={260} rx={60} fill="#3F7E86" stroke="#24484D" strokeWidth={8} />
    </svg>
  );
};

export const SofaFront: React.FC<{ sofaTop: number }> = ({ sofaTop }) => {
  const { w, h } = useLayout();
  const P = h > w;
  return (
    <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
      <rect x={w * 0.1} y={sofaTop} width={w * 0.8} height={190} rx={40} fill="#4C949C" stroke="#24484D" strokeWidth={8} />
      <rect x={w * 0.04} y={sofaTop - 60} width={w * 0.14} height={270} rx={50} fill="#3F7E86" stroke="#24484D" strokeWidth={8} />
      <rect x={w * 0.82} y={sofaTop - 60} width={w * 0.14} height={270} rx={50} fill="#3F7E86" stroke="#24484D" strokeWidth={8} />
      <rect x={w * 0.14} y={sofaTop + 200} width={30} height={60} fill="#24484D" />
      <rect x={w * 0.84} y={sofaTop + 200} width={30} height={60} fill="#24484D" />
      {/* leather pouf (front left) */}
      <g transform={`translate(${w * 0.17} ${sofaTop + (P ? 330 : 240)})`}>
        <ellipse cx={0} cy={0} rx={P ? 120 : 95} ry={P ? 70 : 55} fill="#C47A3E" stroke="#6E3E1C" strokeWidth={7} />
        <ellipse cx={0} cy={-20} rx={P ? 112 : 88} ry={P ? 42 : 33} fill="#D8924F" stroke="#6E3E1C" strokeWidth={5} />
        <path d={`M-60 -20 L0 -48 L60 -20 L0 8 Z`} fill="none" stroke="#F3D9A0" strokeWidth={5} />
      </g>
    </svg>
  );
};
