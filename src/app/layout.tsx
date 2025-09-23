import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/organisms/BottomNav";
import Header from "@/components/organisms/Header";
import { ToastProvider } from "@/components/atoms/ToastProvider";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "Baseball Diary",
  description: "직관 기록",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`antialiased md:bg-neutral-100 dark:md:bg-neutral-900`}>
        {/* 데스크톱: 모바일 에뮬레이터처럼 고정 크기 프레임을 중앙에 배치 */}
        <div className="md:flex md:min-h-screen md:items-center md:justify-center">
          <div className="md:relative md:w-[430px] md:h-[932px] md:rounded-3xl md:border md:border-black/10 md:shadow-xl md:bg-white dark:md:bg-black md:flex md:flex-col overflow-hidden">
            <ToastProvider>
              <Header />
              <main className="min-h-dvh w-full px-4 py-4 pb-14 md:flex-1 md:min-h-0 md:overflow-y-auto">
                {children}
              </main>
              <BottomNav />
            </ToastProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
