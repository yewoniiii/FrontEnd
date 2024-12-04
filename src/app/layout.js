import ClientLayout from "@/app/ClientLayout";

export const metadata = {
  title: "댕댕플레이스",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}