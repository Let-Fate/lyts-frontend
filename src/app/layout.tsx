import "./globals.css";
import Header from "@/components/Header";
import BottomNavBar from "@/components/BottomNavBar";
import { Toaster } from "@/components/ui/toaster";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "灵钥通枢 | 跨时代玄学平台",
  description: "灵钥通枢,一个AI聊天助手,可以辅助解卦,塔罗占卜,八字命理",
  keywords: "塔罗牌,梅花易数,六爻,小六壬,AI占卜,AI塔罗,AI梅花易数,八字,AI八字,Diviner,Diviner Fun"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <head>
        <link rel='stylesheet' href='https://chinese-fonts-cdn.deno.dev/packages/lywkpmydb/dist/LXGWWenKaiMonoScreen/result.css' />
      </head>
      <body
        
      >
        <Header></Header>
        {children}
        <Toaster></Toaster>
        <BottomNavBar></BottomNavBar>
      </body>
    </html>
  );
}
