'use client'; 

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-logo">Profiles</Link>
      <div className="navbar-links">
        <Link 
          href="/" 
          className={`nav-link ${pathname === '/' ? 'active' : ''}`}
        >
          Home
        </Link>
        <Link 
          href="/about" 
          className={`nav-link ${pathname === '/about' ? 'active' : ''}`}
        >
          About
        </Link>
        <Link 
          href="/profiles/new" 
          className="btn-primary"
        >
          + New Profile
        </Link>
      </div>
    </nav>
  );
}
