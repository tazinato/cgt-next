import './globals.css';
import Link from 'next/link';
import type { ReactNode } from 'react';

function NavBar() {
  return (
    <header className="navbar">
      <nav className="navbar-inner">
        <Link href="/" className="navbar-logo">
          ProfilesApp
        </Link>
        <div className="navbar-links">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
        </div>
      </nav>
    </header>
  );
}

export const metadata = {
  title: 'Profiles App',
  description: 'A simple Next.js app created for the assignment.',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main className="page-main">{children}</main>
      </body>
    </html>
  );
}
