import { PriceListProps } from "./PriceList";

/*
 * One entry per price-list story. Each becomes a Still called `PriceList-<id>` (registered in Root.tsx).
 * Images are transparent cut-outs under public/ (official renders only, like the reels).
 * Optional header: `title` / `subtitle` under the logo. Price lists use `price`; availability lists use `stock`.
 */
export const PRICE_LISTS: Record<string, PriceListProps> = {
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
    ].map((p) => ({ ...p, condition: "neuf" as const })),
  },
};
