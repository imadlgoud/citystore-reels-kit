import React from "react";

/*
 * Generic, invented football match (flat vector): striped pitch, white lines, two invented kits (orange vs teal),
 * a plain white ball. No real clubs, leagues, crests, broadcaster graphics or sponsors.
 * Pure SVG <g> drawn in a w x h box; `ballR` sets how big the ball reads; `t` (seconds) drives the play.
 * `ant` (0..1) walks a cartoon ant across the pitch next to the ball (the L1 joke).
 */
export const MatchG: React.FC<{ w: number; h: number; t: number; ballR: number; ant?: number; playerR?: number; antU?: number }> = ({ w, h, t, ballR, ant = -1, playerR, antU }) => {
  const pr = playerR ?? Math.min(w, h) * 0.035;
  const ball = { x: w * (0.5 + 0.28 * Math.sin(t * 1.3)), y: h * (0.5 + 0.22 * Math.sin(t * 0.9 + 1)) };
  const team = (k: number, side: number) => {
    const bx = w * (0.5 + side * (0.12 + 0.11 * (k % 3))) + Math.sin(t * 1.7 + k * 2) * w * 0.05;
    const by = h * (0.18 + 0.16 * k) + Math.cos(t * 1.4 + k) * h * 0.04;
    // drift a little toward the ball
    return { x: bx + (ball.x - bx) * 0.12, y: by + (ball.y - by) * 0.12 };
  };
  const stripes = 8;
  const u = antU ?? ballR; // ant drawing unit (the ant can be drawn much bigger than the ball)
  const antX = ball.x + w * 0.42 - ant * w * 0.36, antY = ball.y + u * 0.6;
  return (
    <g>
      {Array.from({ length: stripes }).map((_, i) => (
        <rect key={i} x={(w / stripes) * i} y={0} width={w / stripes + 1} height={h} fill={i % 2 ? "#3FA455" : "#4BB563"} />
      ))}
      <g fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={Math.max(1.5, w * 0.006)}>
        <rect x={w * 0.04} y={h * 0.05} width={w * 0.92} height={h * 0.9} />
        <line x1={w / 2} y1={h * 0.05} x2={w / 2} y2={h * 0.95} />
        <circle cx={w / 2} cy={h / 2} r={Math.min(w, h) * 0.13} />
        <rect x={w * 0.04} y={h * 0.3} width={w * 0.12} height={h * 0.4} />
        <rect x={w * 0.84} y={h * 0.3} width={w * 0.12} height={h * 0.4} />
      </g>
      {[0, 1, 2, 3, 4].map((k) => {
        const a = team(k, -1), b = team(k, 1);
        return (
          <g key={k}>
            <circle cx={a.x} cy={a.y} r={pr} fill="#FF8A1F" stroke="#7A3A00" strokeWidth={pr * 0.25} />
            <circle cx={b.x} cy={b.y} r={pr} fill="#16C2C2" stroke="#06585A" strokeWidth={pr * 0.25} />
          </g>
        );
      })}
      <circle cx={ball.x} cy={ball.y} r={ballR} fill="#fff" stroke="rgba(0,0,0,0.35)" strokeWidth={Math.max(0.4, ballR * 0.18)} />
      {ant >= 0 && (
        <g transform={`translate(${antX} ${antY})`}>
          {/* cartoon ant, ~3x the ball, legs wiggling */}
          {[-1, 0, 1].map((i) => (
            <g key={i} stroke="#1B1B1B" strokeWidth={u * 0.35} strokeLinecap="round">
              <line x1={i * u * 1.1} y1={0} x2={i * u * 1.1 - u * 0.9} y2={u * (1.2 + 0.3 * Math.sin(t * 30 + i))} />
              <line x1={i * u * 1.1} y1={0} x2={i * u * 1.1 + u * 0.9} y2={u * (1.2 + 0.3 * Math.sin(t * 30 + i + 2))} />
            </g>
          ))}
          <ellipse cx={-u * 1.6} cy={-u * 0.2} rx={u * 0.9} ry={u * 0.8} fill="#1B1B1B" />
          <ellipse cx={0} cy={-u * 0.3} rx={u * 0.8} ry={u * 0.65} fill="#1B1B1B" />
          <ellipse cx={u * 1.5} cy={-u * 0.5} rx={u * 0.75} ry={u * 0.7} fill="#1B1B1B" />
          <path d={`M${u * 1.8} ${-u} q${u * 0.4} ${-u} ${u} ${-u * 1.1}`} stroke="#1B1B1B" strokeWidth={u * 0.25} fill="none" />
        </g>
      )}
    </g>
  );
};

/** standalone <svg> wrapper */
export const Match: React.FC<{ w: number; h: number; t: number; ballR: number; ant?: number; playerR?: number; antU?: number; style?: React.CSSProperties }> = ({ w, h, style, ...p }) => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block", ...style }}>
    <MatchG w={w} h={h} {...p} />
  </svg>
);
