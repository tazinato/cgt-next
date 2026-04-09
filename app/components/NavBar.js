'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from "next-auth/react";

export default function NavBar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <header className="navbar">
      <nav className="navbar-inner">
        <Link href="/" className="navbar-logo">
          ProfilesApp
        </Link>
        <div className="navbar-links">
          <Link 
            href="/" 
            className={`nav-link ${pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            href="/profiles" 
            className={`nav-link ${pathname === '/profiles' ? 'active' : ''}`}
          >
            Profiles
          </Link>
          <Link 
            href="/profiles/new" 
            className="btn-primary"
          >
            New Profile
          </Link>
          <div className="auth-section">
            {status === "loading" ? (
              <span className="loading-auth">Loading...</span>
            ) : session ? (
              <>
                <span className="user-email">{session.user.email}</span>
                <button 
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="signout-btn"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/auth/signin" className="signin-link">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}