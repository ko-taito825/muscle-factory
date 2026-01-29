import type { Metadata } from "next";
import "./globals.css";
import LayoutContent from "./_components/LayoutContent";

export const metadata: Metadata = {
  title: "Muscle Factory",
  description: "Start your workout journey",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true, // アプリとして動作
    statusBarStyle: "black-translucent",
    title: "Muscle Factory", // ホーム画面でのデフォルト名
  },
  icons: {
    apple: "/icon.png",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="bg-black text-white antialiased">
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}
