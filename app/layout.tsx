import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SKINBRO DEMO — виртуальное открытие кейсов",
  description: "Демо-платформа с виртуальными монетами и игровыми предметами. Без реальных платежей и вывода средств.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
