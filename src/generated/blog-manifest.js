export const blogManifest = [
  {
    "slug": "motion-ownership-in-static-sites",
    "title": "Motion Ownership in Static Sites",
    "excerpt": "How to keep GSAP, Anime.js, and WebGL responsibilities clean when a premium frontend still needs to ship like a static product.",
    "description": "A practical write-up on motion ownership, performance boundaries, and static delivery in premium frontend systems.",
    "publishedAt": "2026-03-04",
    "updatedAt": null,
    "tags": [
      "GSAP",
      "Architecture",
      "Performance"
    ],
    "featured": true,
    "accent": "amethyst",
    "draft": false,
    "cover": null,
    "readingTime": 2,
    "html": "<p>Static sites break down when every animation system starts behaving like it owns the whole page.</p>\n<blockquote>\n<p>Motion feels premium only when its ownership is obvious in the code.</p>\n</blockquote>\n<h2>The real problem</h2>\n<p>When a page uses <strong>GSAP</strong>, <strong>Anime.js</strong>, and <strong>Three.js</strong> together, the first failure usually is not visual. It is architectural. Two libraries begin touching the same node, transforms start stacking in ways nobody intended, and performance tuning becomes guesswork.</p>\n<p>The fix is not to remove motion. The fix is to define boundaries:</p>\n<ul>\n<li>GSAP owns section-scale choreography</li>\n<li>Anime.js owns tactile micro-interactions</li>\n<li>WebGL owns the atmosphere layer and nothing else</li>\n</ul>\n<h2>A practical rule</h2>\n<p>If a node participates in layout staging, it should not also be the node that receives hover-scale or drag transforms from a second library.</p>\n<pre><code class=\"language-js\">const card = document.querySelector('[data-card]')\n\n// Good: one owner per concern\ngsap.from(card, { y: 24, opacity: 0, duration: 0.7 })\n</code></pre>\n<p>That sounds obvious, but it removes most of the &quot;mysterious&quot; UI drift that appears later.</p>\n<h2>Why static-first teams should care</h2>\n<p>Static delivery does not mean dead interfaces. It means:</p>\n<ol>\n<li>content is available immediately</li>\n<li>enhancement layers are optional</li>\n<li>the page can degrade without collapsing</li>\n</ol>\n<p>That only works when motion is layered on top of content instead of fused into it.</p>\n<h2>The constraint worth keeping</h2>\n<p>Every time you add a new animation, ask one question:</p>\n<p>Who owns this element after the first paint?</p>\n<p>If the answer is not precise, the implementation is not ready.</p>\n",
    "href": "/blog/motion-ownership-in-static-sites/"
  },
  {
    "slug": "building-premium-static-portfolios",
    "title": "Building Premium Static Portfolios",
    "excerpt": "A premium portfolio does not need a heavy app shell. It needs a sharp visual system, disciplined content structure, and clear performance budgets.",
    "description": "How to build a premium static portfolio with intentional motion, editorial hierarchy, and deploy-safe architecture.",
    "publishedAt": "2026-02-16",
    "updatedAt": null,
    "tags": [
      "Portfolio",
      "Static Sites",
      "Design Systems"
    ],
    "featured": true,
    "accent": "topaz",
    "draft": false,
    "cover": null,
    "readingTime": 1,
    "html": "<p>Too many portfolios are overbuilt in the wrong places and underdesigned in the places visitors actually notice.</p>\n<h2>What matters first</h2>\n<p>The hierarchy should be obvious within a few seconds:</p>\n<ul>\n<li>what you do</li>\n<li>what kind of work you want</li>\n<li>where the proof lives</li>\n<li>how to contact you</li>\n</ul>\n<p>Everything else is support material.</p>\n<h2>Premium does not mean loud</h2>\n<p>Premium interfaces usually have fewer decisions visible at once. The page feels composed because spacing, typography, and motion are all pulling in the same direction.</p>\n<h3>A better rule of thumb</h3>\n<p>If a section cannot justify its presence in one sentence, it probably should not exist.</p>\n<p>This matters even more in portfolios because the visitor is not trying to &quot;use&quot; the product. They are evaluating taste, judgment, and technical discipline.</p>\n<h2>Static is an advantage</h2>\n<p>For portfolio work, static delivery is often the stronger default:</p>\n<ol>\n<li>fewer runtime risks</li>\n<li>cleaner hosting options</li>\n<li>better resilience on slow networks</li>\n<li>easier long-term maintenance</li>\n</ol>\n<h2>Where complexity should live</h2>\n<p>Complexity belongs in the craft, not in the navigation model.</p>\n<p>Use it in:</p>\n<ul>\n<li>motion timing</li>\n<li>art direction</li>\n<li>copy rhythm</li>\n<li>rendering boundaries</li>\n</ul>\n<p>Do not spend that budget on app behavior the visitor never asked for.</p>\n",
    "href": "/blog/building-premium-static-portfolios/"
  },
  {
    "slug": "why-progressive-motion-matters",
    "title": "Why Progressive Motion Matters",
    "excerpt": "The best motion systems feel expensive when they are present and invisible when they are absent.",
    "description": "A note on reduced motion, graceful degradation, and why premium interfaces still need calm fallback states.",
    "publishedAt": "2026-01-28",
    "updatedAt": null,
    "tags": [
      "Accessibility",
      "Motion",
      "UX"
    ],
    "featured": false,
    "accent": "mist",
    "draft": false,
    "cover": null,
    "readingTime": 1,
    "html": "<p>Motion should improve orientation, emphasis, and emotional tone. It should never become a dependency for understanding the page.</p>\n<h2>Progressive enhancement is not optional</h2>\n<p>When motion is treated as essential content, the interface becomes fragile. A GPU issue, a browser quirk, or a reduced-motion preference can suddenly remove the only thing giving the page clarity.</p>\n<h2>What a strong fallback looks like</h2>\n<p>A good fallback keeps:</p>\n<ul>\n<li>hierarchy</li>\n<li>spacing</li>\n<li>content order</li>\n<li>interaction affordance</li>\n</ul>\n<p>What it loses is spectacle, not comprehension.</p>\n<h2>Reduced motion is a design constraint</h2>\n<p>It is easy to treat <code>prefers-reduced-motion</code> like a checkbox. That misses the point.</p>\n<p>The real goal is to design a page that still feels intentional when animation is trimmed down to almost nothing.</p>\n<pre><code class=\"language-js\">const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches\n\nif (reducedMotion) {\n  document.documentElement.classList.add('motion-reduced')\n}\n</code></pre>\n<p>That logic is small. The design responsibility behind it is not.</p>\n<h2>Premium without dependence</h2>\n<p>The strongest motion systems do two things well:</p>\n<ol>\n<li>they add atmosphere when conditions allow</li>\n<li>they disappear cleanly when conditions do not</li>\n</ol>\n<p>That balance is what keeps an interface premium instead of merely animated.</p>\n",
    "href": "/blog/why-progressive-motion-matters/"
  }
]
