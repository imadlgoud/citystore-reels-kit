import { PriceListProps } from "./PriceList";

/*
 * One entry per price-list story. Each becomes a Still called `PriceList-<id>` (registered in Root.tsx).
 * Images are transparent cut-outs under public/ (official renders only, like the reels).
 * Prices "0000 DH" are placeholders: replace them before posting.
 */
export const PRICE_LISTS: Record<string, PriceListProps> = {
  smartphones: {
    title: "SMARTPHONES",
    subtitle: "الأثمنة ديال هاد السيمانة",
    items: [
      { name: "Redmi Note 15 5G", img: "redmi/products/note15.png", price: "0000 DH", condition: "neuf" },
      { name: "Redmi Note 14 Pro+ 5G", img: "redmi/products/proplus.png", price: "0000 DH", condition: "neuf" },
      { name: "Galaxy A16", img: "a16/products/pair.png", price: "0000 DH", condition: "neuf", spec: "4 Go · 128 Go" },
      { name: "Galaxy A07", img: "a07/products/black.png", price: "0000 DH", condition: "neuf", spec: "4 Go · 64 Go" },
    ],
  },
  selection: {
    title: "SÉLECTION CITY STORE",
    subtitle: "Neuf · Occasion",
    items: [
      { name: "Apple Watch Series 11", img: "watch11/products/trio.png", price: "0000 DH", condition: "neuf" },
      { name: "Apple Watch Ultra 3", img: "ultra3/products/front.png", price: "0000 DH", condition: "neuf" },
      { name: "WHOOP 5.0", img: "whoop/products/duo.png", price: "0000 DH", condition: "neuf" },
      { name: "Galaxy A07", img: "a07/products/green.png", price: "0000 DH", condition: "occasion", spec: "4 Go · 64 Go" },
      { name: "Redmi Note 14 5G", img: "redmi/products/note14.png", price: "0000 DH", condition: "occasion" },
      { name: "Galaxy A16", img: "a16/products/back.png", price: "0000 DH", condition: "neuf", spec: "4 Go · 128 Go" },
    ],
  },
  airpods: {
    items: [
      { name: "AirPods Pro 2", img: "pricelist/airpods/pro2.png", price: "2100 DH", condition: "neuf", spec: "Boîtier USB-C" },
      { name: "AirPods 2", img: "pricelist/airpods/airpods2.png", price: "1100 DH", condition: "neuf" },
      // AirPods 4 and 4 ANC look the same: the two renders from the AirPods reel (open / buds in) tell them apart
      { name: "AirPods 4", img: "airpods5b/products/open.png", price: "1450 DH", condition: "neuf" },
      { name: "AirPods 4 ANC", img: "airpods5b/products/case.png", price: "1850 DH", condition: "neuf", spec: "Réduction de bruit active", scale: 0.82 },
    ],
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
      ].map((p) => ({ ...p, price: "DISPONIBLE", condition: "neuf" as const })),
    ],
  },
};
