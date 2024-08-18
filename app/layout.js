import {
  ClerkProvider,
  SignInButton,
  UserButton,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs'; 
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FlashCard SAAS",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <title>{metadata.title}</title>
          <meta name="description" content={metadata.description} />
        </head>
        <body className={inter.className}> {/* Apply the Inter font directly here */}
         
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
