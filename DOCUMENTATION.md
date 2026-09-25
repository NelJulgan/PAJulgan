# PAJULGAN — Technical Documentation (`DOCUMENTATION.md`)

Comprehensive technical and architectural specification for the PAJULGAN Architecture & Engineering digital platform.

---

## A. Project Overview & Architecture Blueprint

### 1. Objective & Concept Status
PAJULGAN is an original architectural and engineering digital concept platform and technical exploration study. The project is created strictly as an experimental design prototype and frontend engineering showcase—it is not an active commercial firm, practicing architectural studio, or client-commissioned commercial website.

The architectural objective is to deliver a visceral, tactile digital representation of physical craft, technical precision, and architectural permanence through high-performance vanilla web standards.

> **Important Concept Notice**:
> - **Strictly Conceptual**: PAJULGAN exists solely as an experimental design and frontend engineering prototype.
> - **Hypothetical Case Studies**: All projects (*The Courtyard House*, *The Common Ground*, *Framework / 03*), practice disciplines, and studio metrics are fictional concept studies developed to demonstrate typography, spatial layouts, and motion orchestration.
> - **Self-Contained & Private**: No analytics, commercial trackers, or server-side databases are implemented. The project inquiry brief generator functions entirely client-side.

### 2. Tech Stack
- **Structure**: Semantic Modern HTML5 with WCAG AA compliance.
- **Styling**: Modern CSS3 (CSS Custom Properties, Grid, Flexbox, SVG Masking, `@property`, `will-change`).
- **Scripting**: Modern ES6+ Vanilla JavaScript (Zero build step, zero frameworks, zero external bundlers).
- **Motion & Physics Engine**: Locally bundled GSAP 3.12+, ScrollTrigger 3.12+, and Lenis 1.0+ smooth momentum scroll engine.
- **Typography**: Custom `Codec Cold ExtraBold` for brand lockups, `DM Sans` for editorial narrative, and `IBM Plex Mono` for architectural metadata.

### 3. Complete Directory Tree
```text
PAJ2/
├── index.html                       # Primary entry point & semantic HTML5 document
├── styles.css                       # Root stylesheet gateway (imports css/main.css)
├── app.js                           # Root application bundle & zero-CORS fallback
├── ARCHITECTURE.md                  # System architecture blueprint
├── RULES.md                         # Engineering standards & mentorship instructions
├── README.md                        # Quickstart instructions
├── DOCUMENTATION.md                 # Complete technical documentation
├── assets/                          # Static media, vector assets & local libraries
│   ├── 1st.png                      # Phase 01 Process study graphic
│   ├── 2nd.png                      # Phase 02 Process study graphic
│   ├── 3rd.png                      # Phase 03 Process study graphic
│   ├── 4th.png                      # Phase 04 Process study graphic
│   ├── CodecCold-ExtraBold.woff     # Custom display wordmark typeface
│   ├── courtyard.jpg                # Architectural concept photography (The Courtyard House)
│   ├── pavilion.jpg                 # Architectural concept photography (The Common Ground)
│   ├── structure.jpg                # Architectural concept photography (Framework / 03)
│   ├── custom-hero-sketch.jpg       # Axonometric wireframe CAD drafting visual
│   ├── custom-hero-render.jpg       # Photorealistic architectural render
│   ├── logo-p.svg                   # Brand mark vector
│   ├── mark.svg                     # Favicon symbol
│   ├── sources.txt                  # Image attribution & reference citations
│   ├── gsap.min.js                  # Local GSAP core library
│   ├── ScrollTrigger.min.js         # Local ScrollTrigger plugin
│   └── lenis.min.js                 # Local Lenis smooth momentum scroll library
├── css/                             # Modular CSS architecture
│   ├── main.css                     # Master CSS aggregator (cascade orchestrator)
│   ├── variables.css                # Design tokens, font-faces & CSS custom properties
│   ├── reset.css                    # Box-sizing, typography resets, paper noise texture
│   ├── global.css                   # Typography utilities, scroll progress, link primitives
│   └── components/                  # Domain & section stylesheets
│       ├── intro.css                # Preloader curtain columns & typography
│       ├── header.css               # Architectural brand lockup & mobile drawer nav
│       ├── hero.css                 # Hero pinned liquid ink showcase & SVG filter
│       ├── studio.css               # Studio manifesto layout & kinetic text reveal
│       ├── work.css                 # Selected works pinned horizontal track & cards
│       ├── services.css             # Architectural disciplines & progressive accordion
│       ├── approach.css             # 4-Phase process split & sticky photo crossfade
│       ├── contact.css              # Direct engagement section & consultation CTA
│       ├── footer.css               # Liquid ink displacement mask & colophon
│       ├── dialogs.css              # Accessible HTML5 <dialog> modals & brief form
│       └── responsive.css           # Lenis optimizations, media queries (1600, 1024, 768, 600)
└── js/                              # Modular ES6+ JavaScript architecture
    ├── app.js                       # Master application bootstrap orchestrator
    ├── core/                        # Foundational infrastructure & engine utilities
    │   ├── dom.js                   # Centralized DOM query caching
    │   └── lenis.js                 # Lenis smooth scroll engine & GSAP ticker link
    ├── components/                  # Shared interactive UI components
    │   ├── navigation.js            # Mobile menu drawer & anchor link smooth scroller
    │   ├── dialogs.js               # Accessible modal dialog controller & Lenis lock
    │   └── brief.js                 # Client-side architectural brief file generator
    └── modules/                     # Cinematic motion & animation controllers
        ├── intro.js                 # Staggered column preloader entrance timeline
        └── animations.js            # GSAP & ScrollTrigger motion suite
```

---

## B. Section-by-Section HTML5 Structure

### 1. Document `<head>` & Script Strategy
- **File**: [index.html](file:///c:/Users/jnagl/Documents/ChatGPT/PAJ2/index.html#L1-L18)
- **Viewport & SEO**: Canonical `theme-color` (`#eeeae1`), descriptive meta tag, SVG favicon.
- **Resource Loading**: Stylesheet gateway `<link rel="stylesheet" href="styles.css" />` loads synchronously.
- **Script Hierarchy**: Scripts are deferred in exact dependency order:
  1. `assets/gsap.min.js` (Core tweening library)
  2. `assets/ScrollTrigger.min.js` (Viewport tracking plugin)
  3. `assets/lenis.min.js` (Momentum scroll engine)
  4. `app.js` (Application bootstrap)

### 2. Preloader Curtain (`.intro`)
- **Structure**: 5 vertical columns (`.intro > div`) and central brand title with sub-note (`THINK. DRAW. BUILD.`).
- **Accessibility**: Marked with `aria-hidden="true"`. Removed entirely from DOM via `.remove()` upon animation completion.

### 3. Global Scroll Progress (`.scroll-progress`)
- Fixed top 2px bar with `transform-origin: left` scaling from `scaleX(0)` to `scaleX(1)` based on scroll position.

### 4. Hero Pinned Container (`#heroPinWrapper`)
- Wraps the `<header class="header">` and `<section class="hero" id="home">`.
- **Brand Lockup**: Wordmark with stroked wireframe capital `P` (`<span class="stroke-p">P</span> JULGAN`) rendered in `Codec Cold ExtraBold`.
- **Navigation**: Accessible anchor links with superscript chapter numbers (`<sup>01</sup>`, `<sup>02</sup>`, `<sup>03</sup>`).
- **Hero Grid**: 2-column layout pairing editorial headline with `.hero-ink-showcase` holding the SVG liquid ink mask that reveals the photorealistic architectural render beneath the CAD drafting sketch.

### 5. Studio Manifesto (`#studio`)
- Split editorial layout with section tag (`01 / THE STUDIO`).
- Contains `.word-reveal` paragraphs with kinetic character-by-character opacity lighting.

### 6. Selected Work Gallery (`#work`)
- Viewport pinned track (`.project-track`) housing 3 core conceptual studies:
  - **PG—001**: The Courtyard House
  - **PG—002**: The Common Ground
  - **PG—003**: Framework / 03
- Dynamic progress bar indicating horizontal translation percentage.

### 7. Services & Disciplines (`#services`)
- Progressive disclosure accordion built with semantic `<details>` and `<summary>` elements.
- Animated with GPU-accelerated height expansion on 72vh viewport contact.

### 8. Approach & Methodology (`#approach`)
- Split container pairing sticky left visual (`.process-visual`) with 4 sequential methodology steps (`.process-step`).
- Dynamic index counter (`01` through `04`) and synchronized image crossfades.

### 9. Project Consultation & Contact (`#contact`)
- Direct contact details and the primary CTA trigger `#brief-open` launching the project brief modal.

### 10. Centered Interactive Footer (`footer`)
- Colophon metadata, copyright year script target `#year`.
- Interactive SVG displacement mask on the large centered wordmark `P JULGAN` reacting to pointer coordinates with expanding liquid ink circles.

### 11. Accessible Dialog Modals (`#project-dialog`, `#brief-dialog`)
- Native HTML5 `<dialog>` elements with backdrop click dismissal, Escape key support, and automatic Lenis scroll locking.

---

## C. CSS Architecture & Section-by-Section Stylesheet Breakdown

The CSS is organized into modular layers imported in cascade priority:

### 1. `css/variables.css`
Defines font-face declarations and root design tokens:
- `--paper`: `#eeeae1` (warm tactile architectural drafting paper)
- `--ink`: `#292b25` (deep archival carbon ink)
- `--muted`: `#74756c` (structural graphite tone)
- `--line`: `#c8c6bb` (technical gridline rule)
- `--red`: `#ba452e` (draftsman annotation red)

### 2. `css/reset.css`
Box-sizing normalization, tap highlight elimination, custom focus outlines, selection highlight colors, and subtle procedural fractal noise overlay on `body::after`.

### 3. `css/global.css`
Shared typography classes (`.mono`, `.eyebrow`), skip link accessibility, and top scroll progress line.

### 4. Component Stylesheets (`css/components/`)
- `intro.css`: Preloader curtain sizing, z-index layering (100), and column distribution.
- `header.css`: Fixed header layout, backdrop blur, stroked mark CSS, and mobile drawer transitions.
- `hero.css`: Axonometric container, SVG mask clipping coordinates, and liquid ink filter styles.
- `studio.css`: Grid spacing, column splits, and `.word-reveal` character styling.
- `work.css`: Horizontal overflow hiding, project card sizing, metadata typography.
- `services.css`: Native accordion reset, arrow transitions, and `.service-body` clipping.
- `approach.css`: Sticky positioning (`position: sticky; top: 120px`), image stack crossfading.
- `contact.css`: Architectural contact section layouts.
- `footer.css`: Liquid ink mask sizing, SVG viewBox scaling, pointer interaction styles.
- `dialogs.css`: Native `<dialog>` styling, backdrop blur, form control focus styling.
- `responsive.css`: Breakpoint overrides for desktop (1600px+), tablet (1024px, 768px), and mobile (600px).

---

## D. JavaScript Architecture & Functional Code Breakdown

### 1. `js/core/dom.js`
Caches all query selectors once at startup, eliminating layout reflows during scroll loops.

### 2. `js/core/lenis.js`
Initializes the Lenis smooth momentum engine with custom exponential easing (`1.001 - Math.pow(2, -10 * t)`). Connects directly to GSAP's `ticker` to eliminate multi-frame drift.

### 3. `js/components/navigation.js`
Handles mobile menu toggles, keyboard dismissal, background momentum scroll locking via `lenis.stop()` and `body.nav-open`, and calculates target anchor scroll offsets via `lenis.scrollTo(target, { offset: -40 })`.

### 4. `js/components/dialogs.js`
Manages native `<dialog>` modals. Calls `lenis.stop()` on open to prevent page scrolling behind the backdrop, and restores with `lenis.start()` on close.

### 5. `js/components/brief.js`
Interprets brief form submission, compiles a formatted project specification string, generates an in-memory `Blob`, and triggers an immediate local file download.

### 6. `js/modules/intro.js`
Orchestrates the 5-column preloader timeline using GSAP's `power4.inOut` easing and unmounts the intro element upon completion.

### 7. `js/modules/animations.js`
Houses all ScrollTrigger implementations:
- **Hero Ink Scrub**: On desktop (`min-width: 601px`), pins `#heroPinWrapper` for 850px of scroll runway while morphing the SVG bezier path; on mobile (`max-width: 600px`), hero is unpinned (`pin: false`) for natural fluid document scrolling.
- **Kinetic Text**: Maps scroll progress across `.word-reveal .char` nodes.
- **Horizontal Gallery**: Uses `gsap.matchMedia('(min-width: 601px)')` to translate `.project-track` by `scrollWidth - innerWidth`.
- **Progressive Accordions**: Auto-expands service disciplines at 72vh and calls `ScrollTrigger.refresh()`.
- **Sticky & Pinned Process**: On desktop, 2-column sticky visual layout; on mobile, pinned top visual container with scrolling 70vh step runway and bidirectional image crossfade synchronization (`onEnter`, `onEnterBack`, `onLeaveBack`).
- **Footer Ink Displacement**: Dual-circle SVG mask reacting dynamically to mouse moves with projected coordinate geometry.

---

## E. Verification & Quality Checklist

- [x] **Zero Build Dependencies**: Validated natively in modern browsers with zero transpilers.
- [x] **Modular Architecture**: All CSS files cleanly separated under `css/` and JS modules under `js/`.
- [x] **Backwards Compatibility**: Root `styles.css` and `app.js` maintain 100% gateway support.
- [x] **Responsive Verification**:
  - Desktop (>1440px / 1920x1080): Horizontal pinned gallery and full liquid ink scrub.
  - Tablet (768px - 1024px): Scaled grid layouts with adaptive typography.
  - Mobile (<600px): Hero unpinned for natural scroll; 100vh full-screen navigation overlay animating smoothly (`opacity`, `translateY`, `cubic-bezier`) with vertically centered, staggered link reveals and scrollbars removed; pinned approach visual with scrolling process-steps and synchronized image switching; graceful vertical stack for project cards.
- [x] **Accessibility**:
  - Skip to content link operational.
  - WCAG focus-visible indicators on all interactive elements.
  - Native `<dialog>` accessibility with inert background handling and focus traps.
