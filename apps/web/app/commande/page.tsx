import type { Metadata } from "next";
import Checkout from "./Checkout";
export const metadata: Metadata = { title: "Commande", robots: { index: false } };
export default function Commande() { return <Checkout />; }
