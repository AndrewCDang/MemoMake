import type { Metadata } from "next";
import { Poppins, Outfit, Caveat } from "next/font/google";
import "./styles/globals.scss";
import AuthForm from "./(auth)/authForm";
import Nav from "./(nav)/nav";
import Toast from "./(toast)/toast";
import GlobalModals from "./styles/globalModals";

const poppins = Poppins({
    subsets: ["latin"],
    variable: "--font-poppins",
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
const caveat = Caveat({
    subsets: ["latin"],
    variable: "--font-caveat",
    weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
    weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
    title: "Flashmu",
    description:
        "Flashmu is a free and easy-to-use flashcards app built with Next.js by Andrew Dang",
    // viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${poppins.variable} ${outfit.variable} ${caveat.variable}`}
            >
                <Nav />
                {children}
                <GlobalModals />
                <AuthForm />
                <Toast />
            </body>
        </html>
    );
}
