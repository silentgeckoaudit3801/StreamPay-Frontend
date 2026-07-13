import type { Metadata } from "next";
import "./globals.css";
import SplashScreen from "./components/SplashScreen";
import { ToastProvider } from "./components/ToastProvider";
import { getThemeScript } from "./utils/theme-noflash";

export const metadata: Metadata = {
  title: "StreamPay - Payment Streaming",
  description: "Real-time payment streaming on Stellar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: getThemeScript() }}
          suppressHydrationWarning
        />
      </head>
      <body>
        <ToastProvider>
          <SplashScreen />
          <header className="sr-only">
            <p>StreamPay</p>
            <nav aria-label="Primary">
              <a href="#main-content">Skip to main content</a>
            </nav>
          </header>
          <main id="main-content">{children}</main>
          <footer className="sr-only">
            <p>StreamPay payment streaming dashboard</p>
          </footer>
        </ToastProvider>
      </body>
    </html>
  );
}
