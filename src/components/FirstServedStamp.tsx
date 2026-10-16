import React from "react";
import { FONT } from "../brand";

/** Cover stamp for single-unit offers ("Premier arrivé, premier servi"). House rule: every reel whose script says
 * "premier arrivé, premier servi" puts this stamp on its cover, under the product, right of Citybot, above the
 * "متوفر عند CITY STORE" ribbon (default position: right 60, top 1300 on the 1080x1920 cover). */
export const FirstServedStamp: React.FC<{ right?: number; top?: number }> = ({ right = 60, top = 1300 }) => (
  <div style={{ position: "absolute", right, top, transform: "rotate(-5deg)", background: "linear-gradient(90deg,#FFB020,#FF7A1A)", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 58, lineHeight: 1.08, textAlign: "center", padding: "14px 34px 20px", borderRadius: 24, border: "6px solid #fff", boxShadow: "0 20px 50px rgba(80,30,0,0.45)", whiteSpace: "nowrap" }}>
    PREMIER ARRIVÉ,<br />PREMIER SERVI !
  </div>
);
