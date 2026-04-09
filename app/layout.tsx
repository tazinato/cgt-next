import './globals.css';
import type { ReactNode } from 'react';
import SessionProvider from './components/SessionProvider';  
import NavBar from './components/NavBar'; 

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
        <SessionProvider> 
          <NavBar /> 
          <main className="page-main">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}