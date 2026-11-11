import "./globals.css";
import { AppProvider } from "@/components/providers/app-provider";
export const metadata = {
  title: {
    default: "SalesFlow — Ruang kerja penjualan",
    template: "%s | SalesFlow",
  },
  description:
    "Kelola lead, data pembiayaan, dan survei dalam satu ruang kerja. Demo SalesFlow triple X.",
  applicationName: "SalesFlow",
  appleWebApp: {
    capable: true,
    title: "SalesFlow",
    statusBarStyle: "default",
  },
  icons: {
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  formatDetection: { telephone: false },
  other: { "apple-mobile-web-app-capable": "yes" },
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#101b3d",
};
export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
