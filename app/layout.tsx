import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/ui/Reveal";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingContacts from "@/components/layout/FloatingContacts";
import ConsultChat from "@/components/layout/ConsultChat";
import { SITE } from "@/lib/site";

const roboto = Roboto({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://noithatphome.net"),
  title: {
    default: "Nội thất P-Home – Uy tín, tận tâm",
    template: "%s | Nội thất P-Home",
  },
  description:
    "Nội thất P-Home: thiết kế, sản xuất và thi công nội thất trọn gói – kệ sắt trang trí, tủ áo, tủ bếp, giường ngủ, tủ giày tại TP. HCM. Hotline " +
    SITE.phone,
  icons: { icon: "/images/favicon.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={roboto.variable}>
      <body>
        <MotionProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <FloatingContacts />
          <ConsultChat />
        </MotionProvider>
      </body>
    </html>
  );
}
