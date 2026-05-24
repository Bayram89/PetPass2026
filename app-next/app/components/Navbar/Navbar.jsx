"use client";

import Image from "next/image";
import Link from "next/link";
import { LogIn, Menu, PawPrint, UserRound, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import { withApiBase } from "@/lib/api-base";
import { withAuthHeaders } from "@/lib/auth-token";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthed = Boolean(user);
  const isAdmin = user?.role === "admin";
  const avatar = user?.photo || user?.image || "";
  const avatarInitial = (user?.name || user?.email || "P").slice(0, 1).toUpperCase();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { name: "Home", path: "/home" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: isAdmin ? "Dashboard" : "Pets", path: !isAuthed ? "/faq" : isAdmin ? "/profile/pets/all" : "/profile" },
  ];

  async function handleSignOut() {
    setShowProfileMenu(false);
    setMobileOpen(false);

    try {
      await fetch(withApiBase("/auth/logout"), { method: "POST", credentials: "include", headers: withAuthHeaders() });
    } catch {}

    await logout();
    router.push("/home");
  }

  function handleProfileClick() {
    setShowProfileMenu(false);
    setMobileOpen(false);
    router.push("/profile");
  }

  function handleLoginRedirect() {
    localStorage.setItem("returnTo", pathname || "/home");
    window.location.href = withApiBase("/auth/google");
  }

  return (
    <>
      <header className={styles.navbar}>
        <div className={`pageSection ${styles.navbar__shell}`}>
          <Link href="/home" className={styles.navbar__brand}>
            <Image src="/images/logo.png" alt="PetPass logo" width={52} height={52} className={styles.navbar__logo} priority />
            <div>
              <span className={styles.navbar__brandTitle}>PetPass</span>
              <span className={styles.navbar__brandTag}>Travel-ready records for pets</span>
            </div>
          </Link>

          <nav className={styles.navbar__desktop} aria-label="Primary">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} className={pathname === item.path ? styles.navbar__linkActive : styles.navbar__link}>
                {item.name}
              </Link>
            ))}
          </nav>

          <div className={styles.navbar__actions}>
            {loading ? (
              <div className={styles.navbar__loading} />
            ) : !isAuthed ? (
              <button type="button" className={styles.navbar__loginButton} onClick={() => setShowLoginModal(true)}>
                <LogIn size={18} />
                Sign in
              </button>
            ) : (
              <div ref={menuRef} className={styles.navbar__profile}>
                <button type="button" className={styles.navbar__avatarButton} onClick={() => setShowProfileMenu((value) => !value)} aria-label="Open account menu">
                  {avatar ? (
                    <Image src={avatar} alt="Profile" width={40} height={40} className={styles.navbar__avatarImage} />
                  ) : (
                    <span className={styles.navbar__avatarFallback}>{avatarInitial}</span>
                  )}
                </button>

                {showProfileMenu && (
                  <div className={styles.navbar__dropdown}>
                    <button type="button" onClick={handleProfileClick}>
                      My profile
                    </button>
                    <button type="button" onClick={handleSignOut}>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}

            <button type="button" className={styles.navbar__menuButton} onClick={() => setMobileOpen((value) => !value)} aria-label="Toggle navigation">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className={styles.navbar__mobilePanel}>
            <nav className={styles.navbar__mobileNav} aria-label="Mobile">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path} className={pathname === item.path ? styles.navbar__mobileLinkActive : styles.navbar__mobileLink} onClick={() => setMobileOpen(false)}>
                  {item.name}
                </Link>
              ))}
              {isAuthed ? (
                <>
                  <button type="button" className={styles.navbar__mobileButton} onClick={handleProfileClick}>
                    <UserRound size={18} />
                    Profile
                  </button>
                  <button type="button" className={styles.navbar__mobileButton} onClick={handleSignOut}>
                    <PawPrint size={18} />
                    Sign out
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className={styles.navbar__mobileButton}
                  onClick={() => {
                    setMobileOpen(false);
                    setShowLoginModal(true);
                  }}
                >
                  <LogIn size={18} />
                  Sign in
                </button>
              )}
            </nav>
          </div>
        )}
      </header>

      {showLoginModal && (
        <div className={styles.navbar__modal} role="presentation" onClick={() => setShowLoginModal(false)}>
          <div className={styles.navbar__modalCard} role="dialog" aria-modal="true" aria-labelledby="login-title" onClick={(event) => event.stopPropagation()}>
            <span className="eyebrow">Secure access</span>
            <h2 id="login-title">Continue with your Google account.</h2>
            <p>We use Google sign-in so your pet records stay tied to one reliable identity.</p>
            <button type="button" className={styles.navbar__googleButton} onClick={handleLoginRedirect}>
              <Image src="/icons/google.svg" width={20} height={20} alt="Google logo" />
              Continue with Google
            </button>
            <button type="button" className={styles.navbar__cancelButton} onClick={() => setShowLoginModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
