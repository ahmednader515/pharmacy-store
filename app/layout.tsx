import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/shared/client-providers";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import data from "@/lib/data";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export async function generateMetadata() {
  const {
    site: { slogan, name, description, url },
  } = data.settings[0];
  return {
    title: {
      template: `%s | ${name}`,
      default: `${name}. ${slogan}`,
    },
    description: description,
    metadataBase: new URL(url),
  };
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const setting = data.settings[0];
  const currencyCookie = (await cookies()).get("currency");
  const currency = currencyCookie ? currencyCookie.value : "USD";
  
  let session;
  try {
    session = await auth();
  } catch (error) {
    console.error('Auth error:', error);
    session = null;
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`min-h-screen ${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ClientProviders session={session}>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
