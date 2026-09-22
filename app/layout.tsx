import type { Metadata } from "next";
import { sans, serif } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://elevation.com.br"),
  title: {
    default: "Elevation — Mulheres que vão mais alto",
    template: "%s | Elevation",
  },
  description:
    "Movimento feminino que conecta mulheres que desejam crescer com propósito. Conexão, propósito, crescimento e impacto.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Elevation",
    images: ["/og.png"],
  },
};

const RootLayout = ({ children }: LayoutProps<"/">) => (
  <html lang="pt-BR" className={`${serif.variable} ${sans.variable} h-full antialiased`}>
    <body className="flex min-h-full flex-col">
      <main className="flex-1">{children}</main>
    </body>
  </html>
);

export default RootLayout;
