import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Is Steve Knight Mowing?",
    description: "Is Steve Knight Mowing?"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
