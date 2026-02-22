"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { Landmark } from "lucide-react";
import "./sterling-gate-kinetic-navigation.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
}

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/explorer", label: "Explorer" },
  { href: "/perspectives", label: "Perspectives" },
  { href: "/news", label: "News" },
  { href: "/forum", label: "Forum" },
  { href: "/action", label: "Action" },
  { href: "/assistant", label: "Assistant" },
];

export function Component() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    try {
      if (!gsap.parseEase("main")) {
        CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");
        gsap.defaults({ ease: "main", duration: 0.7 });
      }
    } catch {
      gsap.defaults({ ease: "power2.out", duration: 0.7 });
    }

    const ctx = gsap.context(() => {
      const menuItems = containerRef.current?.querySelectorAll(".menu-list-item[data-shape]");
      const shapesContainer = containerRef.current?.querySelector(".ambient-background-shapes");

      menuItems?.forEach((item) => {
        const shapeIndex = item.getAttribute("data-shape");
        const shape = shapesContainer?.querySelector(`.bg-shape-${shapeIndex}`);
        if (!shape) {
          return;
        }

        const shapeEls = shape.querySelectorAll(".shape-element");

        const onEnter = () => {
          shapesContainer?.querySelectorAll(".bg-shape").forEach((entry) => entry.classList.remove("active"));
          shape.classList.add("active");
          gsap.fromTo(
            shapeEls,
            { scale: 0.5, opacity: 0, rotation: -10 },
            {
              scale: 1,
              opacity: 1,
              rotation: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: "back.out(1.7)",
              overwrite: "auto",
            },
          );
        };

        const onLeave = () => {
          gsap.to(shapeEls, {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            overwrite: "auto",
            onComplete: () => shape.classList.remove("active"),
          });
        };

        item.addEventListener("mouseenter", onEnter);
        item.addEventListener("mouseleave", onLeave);

        (item as HTMLElement & { _cleanup?: () => void })._cleanup = () => {
          item.removeEventListener("mouseenter", onEnter);
          item.removeEventListener("mouseleave", onLeave);
        };
      });
    }, containerRef);

    return () => {
      ctx.revert();
      const items = containerRef.current?.querySelectorAll(".menu-list-item[data-shape]");
      items?.forEach((item) => {
        const typed = item as HTMLElement & { _cleanup?: () => void };
        typed._cleanup?.();
      });
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      const navWrap = containerRef.current?.querySelector(".nav-overlay-wrapper");
      const menu = containerRef.current?.querySelector(".menu-content");
      const overlay = containerRef.current?.querySelector(".overlay");
      const bgPanels = containerRef.current?.querySelectorAll(".backdrop-layer");
      const menuLinks = containerRef.current?.querySelectorAll(".nav-link");
      const menuButton = containerRef.current?.querySelector(".nav-close-btn");
      const menuButtonTexts = menuButton?.querySelectorAll("p");
      const menuButtonIcon = menuButton?.querySelector(".menu-button-icon");

      if (!navWrap || !menu || !overlay || !bgPanels || !menuLinks || !menuButtonTexts || !menuButtonIcon) {
        return;
      }

      const tl = gsap.timeline();

      if (isMenuOpen) {
        navWrap?.setAttribute("data-nav", "open");
        tl.set(navWrap, { display: "block" })
          .set(menu, { xPercent: 0 }, "<")
          .fromTo(menuButtonTexts, { yPercent: 0 }, { yPercent: -100, stagger: 0.2 })
          .fromTo(menuButtonIcon, { rotate: 0 }, { rotate: 315 }, "<")
          .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1 }, "<")
          .fromTo(bgPanels, { xPercent: 101 }, { xPercent: 0, stagger: 0.12, duration: 0.575 }, "<")
          .fromTo(menuLinks, { yPercent: 140, rotate: 10 }, { yPercent: 0, rotate: 0, stagger: 0.05 }, "<+=0.35");
      } else {
        navWrap?.setAttribute("data-nav", "closed");
        tl.to(overlay, { autoAlpha: 0 })
          .to(menu, { xPercent: 120 }, "<")
          .to(menuButtonTexts, { yPercent: 0 }, "<")
          .to(menuButtonIcon, { rotate: 0 }, "<")
          .set(navWrap, { display: "none" });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isMenuOpen]);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen((previous) => !previous);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div ref={containerRef} className="kinetic-nav-root">
      <div className="site-header-wrapper">
        <header className="header">
          <div className="container is--full">
            <nav className="nav-row">
              <Link href="/" aria-label="home" className="nav-logo-row w-inline-block">
                <Landmark className="h-5 w-5" />
                <span>America First</span>
              </Link>
              <div className="nav-row__right">
                <div className="nav-toggle-label" onClick={toggleMenu} style={{ cursor: "pointer", pointerEvents: "auto" }}>
                  <span className="toggle-text">Menu</span>
                </div>

                <button role="button" className="nav-close-btn" onClick={toggleMenu} style={{ pointerEvents: "auto" }}>
                  <div className="menu-button-text">
                    <p className="p-large">Menu</p>
                    <p className="p-large">Close</p>
                  </div>
                  <div className="icon-wrap">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 16 16" fill="none" className="menu-button-icon">
                      <path d="M7.33333 16L7.33333 -3.2055e-07L8.66667 -3.78832e-07L8.66667 16L7.33333 16Z" fill="currentColor"></path>
                      <path d="M16 8.66667L-2.62269e-07 8.66667L-3.78832e-07 7.33333L16 7.33333L16 8.66667Z" fill="currentColor"></path>
                    </svg>
                  </div>
                </button>
              </div>
            </nav>
          </div>
        </header>
      </div>

      <section className="fullscreen-menu-container">
        <div data-nav="closed" className="nav-overlay-wrapper">
          <div className="overlay" onClick={closeMenu}></div>
          <nav className="menu-content">
            <div className="menu-bg">
              <div className="backdrop-layer first"></div>
              <div className="backdrop-layer second"></div>
              <div className="backdrop-layer"></div>

              <div className="ambient-background-shapes">
                <svg className="bg-shape bg-shape-1" viewBox="0 0 400 400" fill="none">
                  <circle className="shape-element" cx="80" cy="120" r="40" fill="rgba(29,74,130,0.18)" />
                  <circle className="shape-element" cx="300" cy="80" r="60" fill="rgba(178,34,52,0.12)" />
                  <circle className="shape-element" cx="200" cy="300" r="80" fill="rgba(29,74,130,0.12)" />
                  <circle className="shape-element" cx="350" cy="280" r="30" fill="rgba(178,34,52,0.2)" />
                </svg>
                <svg className="bg-shape bg-shape-2" viewBox="0 0 400 400" fill="none">
                  <path className="shape-element" d="M0 200 Q100 100, 200 200 T 400 200" stroke="rgba(29,74,130,0.22)" strokeWidth="60" fill="none" />
                  <path className="shape-element" d="M0 280 Q100 180, 200 280 T 400 280" stroke="rgba(178,34,52,0.18)" strokeWidth="40" fill="none" />
                </svg>
                <svg className="bg-shape bg-shape-3" viewBox="0 0 400 400" fill="none">
                  <circle className="shape-element" cx="50" cy="50" r="8" fill="rgba(29,74,130,0.3)" />
                  <circle className="shape-element" cx="150" cy="50" r="8" fill="rgba(178,34,52,0.3)" />
                  <circle className="shape-element" cx="250" cy="50" r="8" fill="rgba(29,74,130,0.24)" />
                  <circle className="shape-element" cx="350" cy="50" r="8" fill="rgba(178,34,52,0.24)" />
                </svg>
                <svg className="bg-shape bg-shape-4" viewBox="0 0 400 400" fill="none">
                  <path className="shape-element" d="M100 100 Q150 50, 200 100 Q250 150, 200 200 Q150 250, 100 200 Q50 150, 100 100" fill="rgba(29,74,130,0.18)" />
                  <path className="shape-element" d="M250 200 Q300 150, 350 200 Q400 250, 350 300 Q300 350, 250 300 Q200 250, 250 200" fill="rgba(178,34,52,0.14)" />
                </svg>
                <svg className="bg-shape bg-shape-5" viewBox="0 0 400 400" fill="none">
                  <line className="shape-element" x1="0" y1="100" x2="300" y2="400" stroke="rgba(29,74,130,0.15)" strokeWidth="30" />
                  <line className="shape-element" x1="100" y1="0" x2="400" y2="300" stroke="rgba(178,34,52,0.16)" strokeWidth="25" />
                </svg>
              </div>
            </div>

            <div className="menu-content-wrapper">
              <ul className="menu-list">
                {navItems.map((item, idx) => (
                  <li key={item.href} className="menu-list-item" data-shape={String((idx % 5) + 1)}>
                    <Link href={item.href} className="nav-link w-inline-block" onClick={closeMenu}>
                      <p className="nav-link-text">{item.label}</p>
                      <div className="nav-link-hover-bg"></div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
}

export function SterlingGateKineticNavigation() {
  return <Component />;
}
