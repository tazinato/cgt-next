import Link from 'next/link';

export default function NavBar() {
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