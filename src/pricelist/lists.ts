import { PriceListProps } from "./PriceList";

/*
 * One entry per price-list story. Each becomes a Still called `PriceList-<id>` (registered in Root.tsx).
 * Images are transparent cut-outs under public/ (official renders only, like the reels).
 * Optional header: `title` / `subtitle` under the logo. Price lists use `price`; availability lists use `stock`.
 */
export const PRICE_LISTS: Record<string, PriceListProps> = {
  airpods: {
    // newest to oldest; each card: the small green "✓ DISPONIBLE" chip (stock [""]), like the other stories
    items: [
      { name: "AirPods 5", spec: "Boîtier de charge sans fil", img: "pricelist/airpods/airpods5.png" },
      { name: "AirPods 5", img: "pricelist/airpods/airpods5.png" },
      { name: "AirPods Pro 3", img: "pricelist/airpods/pro3.png" },
      // AirPods 4 and 4 ANC look the same: the two renders from the AirPods reel (open / buds in) tell them apart
      { name: "AirPods 4 ANC", spec: "Réduction de bruit active", img: "airpods5b/products/case.png", scale: 0.82 },
      { name: "AirPods 4", img: "airpods5b/products/open.png" },
      { name: "AirPods Pro 2", spec: "Boîtier USB-C", img: "pricelist/airpods/pro2.png" },
      { name: "AirPods 3e génération", img: "pricelist/airpods/airpods3.png" },
      { name: "AirPods 2", img: "pricelist/airpods/airpods2.png" },
    ].map((p) => ({ ...p, condition: "neuf" as const, stock: [""] })),
  },

  iphones: {
    items: [
      ...[
        { name: "iPhone Duo", img: "pricelist/iphones/duo.png", stock: ["128 GB", "256 GB", "512 GB", "1 TB"] },
        { name: "iPhone 18 Pro Max", img: "pricelist/iphones/18promax.png", stock: ["128 GB", "256 GB", "512 GB", "1 TB"] },
        { name: "iPhone 18 Pro", img: "pricelist/iphones/18pro.png", stock: ["128 GB", "256 GB", "512 GB", "1 TB"] },
        // 17 Pro / 17 Pro Max / Air start at 256 GB
        { name: "iPhone 17 Pro Max", img: "pricelist/iphones/17promax.png", stock: ["256 GB", "512 GB", "1 TB"] },
        { name: "iPhone 17 Pro", img: "pricelist/iphones/17pro.png", stock: ["256 GB", "512 GB", "1 TB"] },
        { name: "iPhone Air", img: "pricelist/iphones/air.png", stock: ["256 GB", "512 GB", "1 TB"] },
      ].map((p) => ({ ...p, condition: "neuf" as const })),
    ],
  },
  ipads: {
    items: [
      { name: 'iPad Pro M5 13"', spec: "Wi-Fi + 5G", img: "pricelist/ipads/13.png", condition: "neuf", stock: ["256 GB", "512 GB", "1 TB", "2 TB"] },
      { name: 'iPad Pro M5 13"', spec: "Wi-Fi", img: "pricelist/ipads/13.png", condition: "neuf", stock: ["256 GB", "512 GB"] },
      { name: 'iPad Pro M5 11"', spec: "Wi-Fi", img: "pricelist/ipads/11.png", condition: "neuf", stock: ["256 GB", "2 TB"] },
      { name: "iPad A16", spec: "Wi-Fi", img: "pricelist/ipads/a16.png", condition: "neuf", stock: ["128 GB"] },
    ],
  },
  watches: {
    items: [
      { name: "Apple Watch Ultra 4", img: "pricelist/watches/ultra4.png", stock: ["49 mm"] },
      { name: "Apple Watch Ultra 3", img: "ultra3/products/angle.png", stock: ["49 mm"] },
      { name: "Apple Watch Ultra 2", img: "pricelist/watches/ultra2_single.png", stock: ["49 mm"] },
      { name: "Apple Watch Series 11", img: "pricelist/watches/series11.png", stock: ["46 mm"] },
      { name: "Apple Watch Series 10", img: "pricelist/watches/series10.png", stock: ["42 mm"] },
      { name: "Apple Watch SE 3", img: "pricelist/watches/se3.png", stock: ["44 mm"] },
    ].map((p) => ({ ...p, condition: "neuf" as const })),
  },
  macbooks: {
    photoCenter: true,
    items: [
      { name: 'MacBook Pro M5 14"', img: "pricelist/macbooks/pro14.png", stock: ["16 GB · 1 TB", "16 GB · 512 GB"] },
      { name: 'MacBook Pro M4 14"', img: "pricelist/macbooks/pro14.png", stock: ["16 GB · 1 TB", "16 GB · 512 GB"] },
      { name: 'MacBook Air M4 13,6"', img: "pricelist/macbooks/air13.png", stock: ["16 GB · 512 GB"] },
      { name: 'MacBook Air M4 15"', img: "pricelist/macbooks/air15.png", stock: ["16 GB · 512 GB"] },
      { name: 'MacBook Air M3 15"', img: "pricelist/macbooks/air15_m3.png", stock: ["16 GB · 256 GB", "16 GB · 512 GB"] },
      { name: "MacBook Neo", img: "pricelist/macbooks/neo.png", stock: ["8 GB · 512 GB"] },
    ].map((p) => ({ ...p, condition: "neuf" as const })),
  },
  samsung: {
    photoCenter: true,
    items: [
      { name: "Galaxy S26 Ultra", img: "pricelist/samsung/s26ultra.png", stock: ["12 GB · 256 GB", "12 GB · 512 GB"] },
      { name: "Galaxy S25 Ultra", img: "pricelist/samsung/s25ultra.png", stock: ["12 GB · 256 GB", "12 GB · 512 GB"] },
      { name: "Galaxy S26", img: "pricelist/samsung/s26.png", stock: ["12 GB · 256 GB", "12 GB · 512 GB"] },
      { name: "Galaxy A57", img: "pricelist/samsung/a57.png", stock: ["12 GB · 256 GB"] },
      { name: "Galaxy A56", img: "pricelist/samsung/a56.png", stock: ["12 GB · 256 GB"] },
      { name: "Galaxy A36", img: "pricelist/samsung/a36.png", stock: ["12 GB · 256 GB"] },
    ].map((p) => ({ ...p, condition: "neuf" as const })),
  },
  garmin: {
    items: [
      { name: "Garmin Venu 4", img: "pricelist/garmin/venu4.png", stock: ["45 mm"] },
      { name: "Garmin Venu 3", img: "pricelist/garmin/venu3.png", stock: [""] },
      { name: "Garmin Vivoactive 6", img: "pricelist/garmin/vivoactive6.png", stock: [""] },
      { name: "Garmin Vivoactive 5", img: "pricelist/garmin/vivoactive5.png", stock: [""] },
      // empty slot (Venu 3S removed; product to come)
      { name: "", img: "", empty: true },
      { name: "Garmin Forerunner 165", img: "pricelist/garmin/forerunner165.png", stock: [""] },
      { name: "Garmin Fēnix 8", img: "pricelist/garmin/fenix8.png", stock: ["47 mm"] },
      { name: "Garmin Forerunner 55", img: "pricelist/garmin/forerunner55.png", stock: [""] },
    ].map((p) => ({ ...p, condition: "neuf" as const })),
  },
  rayban: {
    photoCenter: true,
    items: [
      { name: "Ray-Ban Meta Wayfarer", spec: "Gen 2 · Matte Black", img: "pricelist/rayban/gen2_wayfarer_matte_black.png", stock: [""] },
      { name: "Ray-Ban Meta Headliner", spec: "Gen 2 · Shiny Black", img: "pricelist/rayban/gen2_headliner_shiny_black.png", stock: [""] },
      { name: "Ray-Ban Meta Aviator", spec: "Gen 3 · Shiny Black", img: "pricelist/rayban/gen3_aviator_shiny_black.png", stock: [""] },
      { name: "Ray-Ban Meta Wayfarer", spec: "Gen 3 · Matte Black · Transitions", img: "pricelist/rayban/gen3_wayfarer_matte_black_transitions.png", stock: [""] },
    ].map((p) => ({ ...p, condition: "neuf" as const })),
  },
  readers: {
    items: [
      { name: "Kindle Scribe", spec: "Avec stylet", img: "pricelist/readers/kindle_scribe_pen.png", stock: ["16 GB"] },
      { name: "Kindle Colorsoft", img: "pricelist/readers/kindle_colorsoft.png", stock: ["16 GB"] },
      { name: "Kindle 11e génération", img: "pricelist/readers/kindle11.png", stock: ["16 GB"] },
      { name: "Kobo Libra Colour", spec: "Noir", img: "pricelist/readers/kobo_libra_colour_black.png", stock: [""] },
    ].map((p) => ({ ...p, condition: "neuf" as const })),
  },
  djimic: {
    photoCenter: true,
    items: [
      { name: "DJI Mic Mini 2", img: "pricelist/djimic/mic_mini2.png", stock: [""] },
      { name: "DJI Mic Mini 2", spec: "Camera", img: "pricelist/djimic/mic_mini2_camera.png", stock: [""] },
      { name: "DJI Mic Mini 2", spec: "Boîtier de charge · 1 TX + 1 Mobile RX", img: "pricelist/djimic/mic_mini2_case_1tx_mobile_rx.png", stock: [""] },
      { name: "DJI Mic Mini 2", spec: "1 TX + 1 RX", img: "pricelist/djimic/mic_mini2_1tx_1rx.png", stock: [""] },
    ].map((p) => ({ ...p, condition: "neuf" as const })),
  },
  pencils: {
    photoCenter: true,
    items: [
      { name: "Apple Pencil Pro", img: "pricelist/pencils/pencil_pro.png", stock: [""] },
      { name: "Apple Pencil", spec: "USB-C", img: "pricelist/pencils/pencil_usbc.png", stock: [""] },
      { name: "Apple Pencil", spec: "2e génération", img: "pricelist/pencils/pencil_2nd_gen.png", stock: [""] },
      { name: "Apple Pencil", spec: "1re génération · USB-C", img: "pricelist/pencils/pencil_1st_gen_usbc.png", stock: [""] },
    ].map((p) => ({ ...p, condition: "neuf" as const })),
  },
};

/*
 * 1:1 square posts: the 4 newest models of each story (Stills `PriceListSq-<id>`, 1080x1080).
 * Picked by name from PRICE_LISTS so the cards stay in sync with the stories.
 */
const pick = (id: string, idx: number[]): PriceListProps => ({ ...PRICE_LISTS[id], items: idx.map((i) => PRICE_LISTS[id].items[i]) });
export const SQUARE_LISTS: Record<string, PriceListProps> = {
  airpods: pick("airpods", [0, 1, 2, 3]), // AirPods 5 (sans fil), AirPods 5, Pro 3, 4 ANC
  iphones: pick("iphones", [0, 1, 2, 3]), // Duo, 18 Pro Max, 18 Pro, 17 Pro Max
  ipads: pick("ipads", [0, 1, 2, 3]), // all four
  watches: pick("watches", [0, 3, 1, 5]), // Ultra 4, Series 11, Ultra 3, SE 3 (Ultra 2 and Series 10 left out)
  macbooks: pick("macbooks", [0, 1, 2, 3]), // Pro M5 14, Pro M4 14, Air M4 13.6, Air M4 15 (Air M3 and Neo left out)
  samsung: pick("samsung", [0, 2, 3, 4]), // S26 Ultra, S26, A57, A56 (S25 Ultra and A36 left out)
  garmin: pick("garmin", [0, 1, 2, 3]), // Venu 4, Venu 3, Vivoactive 6, Vivoactive 5
  rayban: pick("rayban", [0, 1, 2, 3]), // all four
  readers: pick("readers", [0, 1, 2, 3]), // all four
  djimic: pick("djimic", [0, 1, 2, 3]), // all four
  pencils: pick("pencils", [0, 1, 2, 3]), // all four
  garmin2: pick("garmin", [4, 5, 6, 7]), // (empty slot), Forerunner 165, Fēnix 8, Forerunner 55
};
