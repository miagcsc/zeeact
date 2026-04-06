// generate.jsx
import ReactPDF, {
  Document,
  Page,
  View,
  Text,
  Svg,
  Rect,
  Polygon,
  G,
  Font,
  StyleSheet,
  Link
} from "@react-pdf/renderer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { jsx, jsxs } from "react/jsx-runtime";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
Font.register({
  family: "Syne",
  fonts: [
    { src: join(__dirname, "fonts", "Syne-Bold.ttf"), fontWeight: 700 },
    { src: join(__dirname, "fonts", "Syne-ExtraBold.ttf"), fontWeight: 800 }
  ]
});
Font.register({
  family: "Outfit",
  fonts: [
    { src: join(__dirname, "fonts", "Outfit-Regular.ttf"), fontWeight: 400 },
    { src: join(__dirname, "fonts", "Outfit-Medium.ttf"), fontWeight: 500 },
    { src: join(__dirname, "fonts", "Outfit-SemiBold.ttf"), fontWeight: 600 }
  ]
});
var C = {
  crimson: "#E63950",
  crimson90: "#E94F62",
  crimson10: "#FBE8EB",
  crimson20: "#F7C5CC",
  crimson40: "#F09BAA",
  black: "#0A0A0F",
  black80: "#1F1F26",
  black60: "#3B3B44",
  black40: "#6B6B72",
  black20: "#9B9BA0",
  black10: "#C8C8CC",
  black05: "#EDEDF0",
  white: "#FFFFFF",
  offwhite: "#F7F7FA"
};
var ZeeActsLogo = ({ variant = "dark", scale = 1 }) => {
  const boxBg = variant === "dark" ? C.white : C.black;
  const zColor = variant === "dark" ? C.black : C.white;
  const zeeClr = variant === "dark" ? C.white : C.black;
  const s = scale;
  return /* @__PURE__ */ jsxs(View, { style: { flexDirection: "row", alignItems: "center", gap: 10 * s }, children: [
    /* @__PURE__ */ jsxs(View, { style: { width: 36 * s, height: 36 * s, backgroundColor: boxBg, position: "relative" }, children: [
      /* @__PURE__ */ jsx(Svg, { style: { position: "absolute", top: 0, left: 0, width: 36 * s, height: 36 * s }, children: /* @__PURE__ */ jsx(
        Polygon,
        {
          points: `${25 * s},${36 * s} ${36 * s},${36 * s} ${36 * s},${25 * s}`,
          fill: C.crimson
        }
      ) }),
      /* @__PURE__ */ jsx(Text, { style: {
        fontFamily: "Syne",
        fontWeight: 800,
        fontSize: 22 * s,
        color: zColor,
        position: "absolute",
        top: 2 * s,
        left: 0,
        right: 0,
        textAlign: "center"
      }, children: "Z" })
    ] }),
    /* @__PURE__ */ jsx(View, { style: { flexDirection: "column", gap: 3.5 * s }, children: [
      { w: 18 * s, op: 1 },
      { w: 13 * s, op: 0.6 },
      { w: 8 * s, op: 0.35 }
    ].map(({ w, op }, i) => /* @__PURE__ */ jsxs(View, { style: { flexDirection: "row", alignItems: "center", opacity: op }, children: [
      /* @__PURE__ */ jsx(View, { style: { width: w, height: 2.5 * s, backgroundColor: C.crimson, borderRadius: 1 } }),
      /* @__PURE__ */ jsx(Svg, { width: 6 * s, height: 7 * s, children: /* @__PURE__ */ jsx(Polygon, { points: `0,0 ${6 * s},${3.5 * s} 0,${7 * s}`, fill: C.crimson }) })
    ] }, i)) }),
    /* @__PURE__ */ jsxs(View, { style: { flexDirection: "row" }, children: [
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Syne", fontWeight: 800, fontSize: 20 * s, color: zeeClr, letterSpacing: -0.5 }, children: "Zee" }),
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Syne", fontWeight: 800, fontSize: 20 * s, color: C.crimson, letterSpacing: -0.5 }, children: "Acts" })
    ] })
  ] });
};
var M = 44;
var PageChrome = ({ children, bg = C.white, margin = M }) => /* @__PURE__ */ jsx(Page, { size: "A4", style: { backgroundColor: bg, padding: margin, fontFamily: "Outfit", fontWeight: 400 }, children });
var SectionLabel = ({ children, color = C.crimson }) => /* @__PURE__ */ jsxs(View, { style: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 }, children: [
  /* @__PURE__ */ jsx(View, { style: { width: 20, height: 2, backgroundColor: color } }),
  /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 8, color, letterSpacing: 4, textTransform: "uppercase" }, children })
] });
var PageTitle = ({ children, color = C.black }) => /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Syne", fontWeight: 800, fontSize: 32, color, letterSpacing: -1, lineHeight: 1.1, marginBottom: 6 }, children });
var BodyText = ({ children, style }) => /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 10, color: C.black60, lineHeight: 1.7, ...style }, children });
var Divider = ({ color = C.black05, mt = 16, mb = 16 }) => /* @__PURE__ */ jsx(View, { style: { height: 1, backgroundColor: color, marginTop: mt, marginBottom: mb } });
var PageFooter = ({ pageNum, variant = "dark" }) => {
  const clr = variant === "dark" ? C.black20 : "rgba(255,255,255,0.3)";
  return /* @__PURE__ */ jsxs(View, { style: { position: "absolute", bottom: 28, left: M, right: M, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, children: [
    /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 7.5, color: clr, letterSpacing: 1 }, children: "ZEEACTS BRAND GUIDELINES 2025" }),
    /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 7.5, color: clr }, children: pageNum })
  ] });
};
var CoverPage = () => /* @__PURE__ */ jsxs(Page, { size: "A4", style: { backgroundColor: C.crimson, padding: 0 }, children: [
  /* @__PURE__ */ jsx(View, { style: { position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: C.black } }),
  /* @__PURE__ */ jsx(View, { style: { position: "absolute", top: 60, right: 0, bottom: 0, left: 0, opacity: 0.06 }, children: Array.from({ length: 18 }).map((_, r) => /* @__PURE__ */ jsx(View, { style: { flexDirection: "row", gap: 28, marginBottom: 28, marginLeft: 60 }, children: Array.from({ length: 14 }).map((_2, c) => /* @__PURE__ */ jsx(View, { style: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: C.white } }, c)) }, r)) }),
  /* @__PURE__ */ jsx(View, { style: { position: "absolute", top: 48, left: M }, children: /* @__PURE__ */ jsx(ZeeActsLogo, { variant: "dark", scale: 1.05 }) }),
  /* @__PURE__ */ jsxs(View, { style: { position: "absolute", bottom: 100, left: M, right: M }, children: [
    /* @__PURE__ */ jsx(View, { style: { width: 40, height: 2, backgroundColor: "rgba(255,255,255,0.4)", marginBottom: 20 } }),
    /* @__PURE__ */ jsxs(Text, { style: { fontFamily: "Syne", fontWeight: 800, fontSize: 52, color: C.white, letterSpacing: -2, lineHeight: 1.05, marginBottom: 8 }, children: [
      "Brand",
      "\n",
      "Guidelines"
    ] }),
    /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 14, color: "rgba(255,255,255,0.75)", marginBottom: 32, lineHeight: 1.5 }, children: "Identity System \xB7 2025 Edition" }),
    /* @__PURE__ */ jsx(Divider, { color: "rgba(255,255,255,0.2)", mt: 0, mb: 24 }),
    /* @__PURE__ */ jsx(View, { style: { flexDirection: "row", gap: 40 }, children: [
      ["Colors", "Crimson \xB7 Black \xB7 White"],
      ["Typography", "Syne \xB7 Outfit"],
      ["Formats", "Stationery \xB7 Social \xB7 Ads"]
    ].map(([k, v]) => /* @__PURE__ */ jsxs(View, { children: [
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 8, color: "rgba(255,255,255,0.5)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 3 }, children: k }),
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 500, fontSize: 9.5, color: C.white }, children: v })
    ] }, k)) })
  ] })
] });
var PhilosophyPage = () => /* @__PURE__ */ jsxs(PageChrome, { children: [
  /* @__PURE__ */ jsx(SectionLabel, { children: "Brand Identity" }),
  /* @__PURE__ */ jsx(PageTitle, { children: "Who We Are" }),
  /* @__PURE__ */ jsx(BodyText, { style: { maxWidth: 380, marginBottom: 36 }, children: "ZeeActs is a premium IT solutions company building complaint management systems, HVAC field service platforms, custom ERP, and AI-powered automation \u2014 purpose-built for Pakistani businesses." }),
  /* @__PURE__ */ jsx(View, { style: { flexDirection: "row", gap: 16, marginBottom: 36 }, children: [
    { title: "Mission", text: "Turn chaos into clarity. Give Pakistani businesses the software infrastructure they deserve \u2014 fast, affordable, and built to last." },
    { title: "Vision", text: "Be the default technology partner for every serious Pakistani business \u2014 from HVAC companies to national enterprises." },
    { title: "Promise", text: "We ship in weeks, not months. We build for your industry, not for a generic market. We stay until it works." }
  ].map(({ title, text }) => /* @__PURE__ */ jsxs(View, { style: { flex: 1, borderTopWidth: 2, borderTopColor: C.crimson, paddingTop: 14 }, children: [
    /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Syne", fontWeight: 800, fontSize: 12, color: C.black, marginBottom: 8 }, children: title }),
    /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 9, color: C.black60, lineHeight: 1.7 }, children: text })
  ] }, title)) }),
  /* @__PURE__ */ jsx(Divider, {}),
  /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Syne", fontWeight: 800, fontSize: 16, color: C.black, marginBottom: 16 }, children: "Brand Personality" }),
  /* @__PURE__ */ jsx(View, { style: { flexDirection: "row", flexWrap: "wrap", gap: 8 }, children: ["Confident", "Precise", "Direct", "Bold", "Reliable", "Human", "Fast", "Expert"].map((trait) => /* @__PURE__ */ jsx(View, { style: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 4, borderWidth: 1, borderColor: C.black10, backgroundColor: C.offwhite }, children: /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 9, color: C.black }, children: trait }) }, trait)) }),
  /* @__PURE__ */ jsx(Divider, {}),
  /* @__PURE__ */ jsxs(View, { style: { backgroundColor: C.black, borderRadius: 10, padding: 28 }, children: [
    /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 8, color: "rgba(255,255,255,0.4)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }, children: "Tagline" }),
    /* @__PURE__ */ jsxs(Text, { style: { fontFamily: "Syne", fontWeight: 800, fontSize: 22, color: C.white, letterSpacing: -0.5, lineHeight: 1.15 }, children: [
      "Software That Builds.",
      "\n",
      /* @__PURE__ */ jsx(Text, { style: { color: C.crimson }, children: "AI That Scales." })
    ] })
  ] }),
  /* @__PURE__ */ jsx(PageFooter, { pageNum: "02" })
] });
var LogoPage = () => /* @__PURE__ */ jsxs(PageChrome, { children: [
  /* @__PURE__ */ jsx(SectionLabel, { children: "Identity System" }),
  /* @__PURE__ */ jsx(PageTitle, { children: "Logo System" }),
  /* @__PURE__ */ jsx(BodyText, { style: { marginBottom: 28 }, children: "The ZeeActs mark is built from three elements: the Z-box, the velocity arrows, and the wordmark. Never alter, distort, or recolour any element." }),
  /* @__PURE__ */ jsxs(View, { style: { marginBottom: 20 }, children: [
    /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 8, color: C.black40, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }, children: "On Light Background" }),
    /* @__PURE__ */ jsx(View, { style: { backgroundColor: C.offwhite, borderRadius: 8, padding: 32, borderWidth: 1, borderColor: C.black05, alignItems: "center" }, children: /* @__PURE__ */ jsx(ZeeActsLogo, { variant: "light", scale: 1.4 }) })
  ] }),
  /* @__PURE__ */ jsxs(View, { style: { marginBottom: 20 }, children: [
    /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 8, color: C.black40, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }, children: "On Dark Background" }),
    /* @__PURE__ */ jsx(View, { style: { backgroundColor: C.black, borderRadius: 8, padding: 32, alignItems: "center" }, children: /* @__PURE__ */ jsx(ZeeActsLogo, { variant: "dark", scale: 1.4 }) })
  ] }),
  /* @__PURE__ */ jsxs(View, { style: { marginBottom: 24 }, children: [
    /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 8, color: C.black40, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }, children: "On Brand Crimson" }),
    /* @__PURE__ */ jsx(View, { style: { backgroundColor: C.crimson, borderRadius: 8, padding: 32, alignItems: "center" }, children: /* @__PURE__ */ jsx(ZeeActsLogo, { variant: "dark", scale: 1.4 }) })
  ] }),
  /* @__PURE__ */ jsxs(View, { style: { backgroundColor: C.offwhite, borderRadius: 8, padding: 16, flexDirection: "row", gap: 20 }, children: [
    /* @__PURE__ */ jsxs(View, { style: { flex: 1 }, children: [
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Syne", fontWeight: 800, fontSize: 9, color: C.black, marginBottom: 4 }, children: "Minimum Size" }),
      /* @__PURE__ */ jsxs(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 8, color: C.black60, lineHeight: 1.6 }, children: [
        "Digital: 80px wide minimum",
        "\n",
        "Print: 22mm wide minimum",
        "\n",
        "Never reduce below these sizes."
      ] })
    ] }),
    /* @__PURE__ */ jsxs(View, { style: { flex: 1 }, children: [
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Syne", fontWeight: 800, fontSize: 9, color: C.black, marginBottom: 4 }, children: "Clear Space" }),
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 8, color: C.black60, lineHeight: 1.6 }, children: "Maintain clear space equal to the height of the Z-box on all four sides of the logo." })
    ] }),
    /* @__PURE__ */ jsxs(View, { style: { flex: 1 }, children: [
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Syne", fontWeight: 800, fontSize: 9, color: C.black, marginBottom: 4 }, children: "Monochrome" }),
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 8, color: C.black60, lineHeight: 1.6 }, children: "For single-colour use, render the entire logo in black (#0A0A0F) on white, or white on black." })
    ] })
  ] }),
  /* @__PURE__ */ jsx(PageFooter, { pageNum: "03" })
] });
var ColorSwatch = ({ hex, name, okl, sub, textLight = false }) => /* @__PURE__ */ jsxs(View, { style: { flex: 1, borderRadius: 8, overflow: "hidden", borderWidth: 1, borderColor: C.black05 }, children: [
  /* @__PURE__ */ jsx(View, { style: { height: 80, backgroundColor: hex, justifyContent: "flex-end", padding: 10 }, children: sub && /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 500, fontSize: 7.5, color: textLight ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.4)", marginBottom: 2 }, children: sub }) }),
  /* @__PURE__ */ jsxs(View, { style: { backgroundColor: C.white, padding: 10 }, children: [
    /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Syne", fontWeight: 800, fontSize: 10, color: C.black, marginBottom: 2 }, children: name }),
    /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 500, fontSize: 8, color: C.black40, marginBottom: 1 }, children: hex }),
    /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 7.5, color: C.black20 }, children: okl })
  ] })
] });
var ColorPage = () => /* @__PURE__ */ jsxs(PageChrome, { children: [
  /* @__PURE__ */ jsx(SectionLabel, { children: "Colour System" }),
  /* @__PURE__ */ jsx(PageTitle, { children: "Brand Colours" }),
  /* @__PURE__ */ jsx(BodyText, { style: { marginBottom: 24 }, children: "ZeeActs uses a bold two-tone palette anchored by Crimson and Deep Black. These are the only two brand colours \u2014 all other tones are tints and shades derived from them." }),
  /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 8, color: C.black40, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }, children: "Primary Palette" }),
  /* @__PURE__ */ jsxs(View, { style: { flexDirection: "row", gap: 10, marginBottom: 20 }, children: [
    /* @__PURE__ */ jsx(ColorSwatch, { hex: C.crimson, name: "Crimson", okl: "oklch(58% 0.21 15)", sub: "Primary Brand", textLight: true }),
    /* @__PURE__ */ jsx(ColorSwatch, { hex: C.black, name: "Deep Black", okl: "oklch(5% 0.01 280)", sub: "Primary Text", textLight: true }),
    /* @__PURE__ */ jsx(ColorSwatch, { hex: C.white, name: "Pure White", okl: "oklch(100% 0 0)", sub: "Base Background" })
  ] }),
  /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 8, color: C.black40, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }, children: "Crimson Scale" }),
  /* @__PURE__ */ jsx(View, { style: { flexDirection: "row", gap: 6, marginBottom: 20 }, children: [
    ["#FBE8EB", "50"],
    ["#F7C5CC", "100"],
    ["#F09BAA", "200"],
    ["#E96875", "300"],
    ["#E63950", "400"],
    ["#CF2F44", "500"],
    ["#B52639", "600"],
    ["#8A1C2B", "700"]
  ].map(([hex, n]) => /* @__PURE__ */ jsxs(View, { style: { flex: 1 }, children: [
    /* @__PURE__ */ jsx(View, { style: { height: 32, backgroundColor: hex, borderRadius: 4, marginBottom: 4 } }),
    /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 500, fontSize: 7, color: C.black60, textAlign: "center" }, children: n }),
    /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 6.5, color: C.black20, textAlign: "center" }, children: hex })
  ] }, n)) }),
  /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 8, color: C.black40, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }, children: "Neutral Scale" }),
  /* @__PURE__ */ jsx(View, { style: { flexDirection: "row", gap: 6, marginBottom: 24 }, children: [
    ["#F7F7FA", "50"],
    ["#EDEDF0", "100"],
    ["#C8C8CC", "300"],
    ["#9B9BA0", "500"],
    ["#6B6B72", "600"],
    ["#3B3B44", "700"],
    ["#1F1F26", "800"],
    ["#0A0A0F", "900"]
  ].map(([hex, n]) => /* @__PURE__ */ jsxs(View, { style: { flex: 1 }, children: [
    /* @__PURE__ */ jsx(View, { style: { height: 32, backgroundColor: hex, borderRadius: 4, marginBottom: 4, borderWidth: n === "50" ? 1 : 0, borderColor: C.black05 } }),
    /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 500, fontSize: 7, color: C.black60, textAlign: "center" }, children: n }),
    /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 6.5, color: C.black20, textAlign: "center" }, children: hex })
  ] }, n)) }),
  /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 8, color: C.black40, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }, children: "Contrast Ratios (WCAG 2.2)" }),
  /* @__PURE__ */ jsx(View, { style: { borderRadius: 8, borderWidth: 1, borderColor: C.black05, overflow: "hidden" }, children: [
    ["Crimson on White", "#E63950 / #FFF", "3.8:1", "AA Large \u2713"],
    ["White on Crimson", "#FFF / #E63950", "3.8:1", "AA Large \u2713"],
    ["Black on White", "#0A0A0F / #FFF", "20.7:1", "AAA \u2713"],
    ["White on Black", "#FFF / #0A0A0F", "20.7:1", "AAA \u2713"],
    ["Black on Crimson 10", "#0A0A0F / #FBE8EB", "18.4:1", "AAA \u2713"]
  ].map(([pair, vals, ratio, level], i) => /* @__PURE__ */ jsxs(View, { style: { flexDirection: "row", padding: 9, backgroundColor: i % 2 === 0 ? C.offwhite : C.white }, children: [
    /* @__PURE__ */ jsx(Text, { style: { flex: 2, fontFamily: "Outfit", fontWeight: 500, fontSize: 8.5, color: C.black }, children: pair }),
    /* @__PURE__ */ jsx(Text, { style: { flex: 2, fontFamily: "Outfit", fontWeight: 400, fontSize: 8.5, color: C.black60 }, children: vals }),
    /* @__PURE__ */ jsx(Text, { style: { flex: 1, fontFamily: "Outfit", fontWeight: 600, fontSize: 8.5, color: C.black40 }, children: ratio }),
    /* @__PURE__ */ jsx(Text, { style: { flex: 1.5, fontFamily: "Outfit", fontWeight: 600, fontSize: 8.5, color: C.crimson }, children: level })
  ] }, i)) }),
  /* @__PURE__ */ jsx(PageFooter, { pageNum: "04" })
] });
var TypoPage = () => /* @__PURE__ */ jsxs(PageChrome, { children: [
  /* @__PURE__ */ jsx(SectionLabel, { children: "Typography System" }),
  /* @__PURE__ */ jsx(PageTitle, { children: "Type Scale" }),
  /* @__PURE__ */ jsxs(View, { style: { marginBottom: 24 }, children: [
    /* @__PURE__ */ jsxs(View, { style: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12, alignItems: "flex-end" }, children: [
      /* @__PURE__ */ jsxs(View, { children: [
        /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Syne", fontWeight: 800, fontSize: 11, color: C.crimson, letterSpacing: 2 }, children: "SYNE EXTRABOLD 800" }),
        /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 8.5, color: C.black40, marginTop: 2 }, children: "Display / Headline font \xB7 Google Fonts" })
      ] }),
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 8, color: C.black20 }, children: "Use for all headings" })
    ] }),
    /* @__PURE__ */ jsxs(View, { style: { backgroundColor: C.black, borderRadius: 10, padding: 28 }, children: [
      /* @__PURE__ */ jsxs(Text, { style: { fontFamily: "Syne", fontWeight: 800, fontSize: 42, color: C.white, letterSpacing: -1.5, lineHeight: 1.05, marginBottom: 8 }, children: [
        "Software",
        "\n",
        /* @__PURE__ */ jsx(Text, { style: { color: C.crimson }, children: "That Builds." })
      ] }),
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Syne", fontWeight: 800, fontSize: 18, color: "rgba(255,255,255,0.5)", letterSpacing: -0.3 }, children: "Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm" })
    ] })
  ] }),
  /* @__PURE__ */ jsxs(View, { style: { marginBottom: 24 }, children: [
    /* @__PURE__ */ jsxs(View, { style: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12, alignItems: "flex-end" }, children: [
      /* @__PURE__ */ jsxs(View, { children: [
        /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Syne", fontWeight: 800, fontSize: 11, color: C.crimson, letterSpacing: 2 }, children: "OUTFIT 400 / 500 / 600" }),
        /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 8.5, color: C.black40, marginTop: 2 }, children: "Body / UI font \xB7 Google Fonts" })
      ] }),
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 8, color: C.black20 }, children: "Use for all body text" })
    ] }),
    /* @__PURE__ */ jsxs(View, { style: { backgroundColor: C.offwhite, borderRadius: 10, padding: 24, borderWidth: 1, borderColor: C.black05 }, children: [
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 15, color: C.black, marginBottom: 6 }, children: "SemiBold 600 \u2014 UI Labels & Buttons" }),
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 500, fontSize: 13, color: C.black60, marginBottom: 6 }, children: "Medium 500 \u2014 Subheadings & Captions" }),
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 11, color: C.black60, lineHeight: 1.7 }, children: "Regular 400 \u2014 Body text. ZeeActs builds complaint management systems, HVAC field service software, custom ERP, and AI-powered automation for Pakistani businesses. Deployed in weeks." })
    ] })
  ] }),
  /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 8, color: C.black40, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }, children: "Type Scale" }),
  /* @__PURE__ */ jsx(View, { style: { borderRadius: 8, borderWidth: 1, borderColor: C.black05, overflow: "hidden" }, children: [
    ["Hero / H1", "56\u201372px / 3.5\u20134.5rem", "Syne 800", "-2px", "1.03"],
    ["Section / H2", "36\u201352px / 2.25\u20133.25rem", "Syne 800", "-1.5px", "1.07"],
    ["Card / H3", "20\u201328px / 1.25\u20131.75rem", "Syne 700", "-0.5px", "1.15"],
    ["UI Label", "14\u201316px / 0.875\u20131rem", "Outfit 600", "0", "1.25"],
    ["Body", "14\u201316px / 0.875\u20131rem", "Outfit 400", "0", "1.7"],
    ["Caption", "10\u201312px / 0.625\u20130.75rem", "Outfit 500", "1px", "1.5"],
    ["Mono tag", "10px / 0.625rem", "Outfit 600", "4px", "1"]
  ].map(([role, size, font, ls, lh], i) => /* @__PURE__ */ jsxs(View, { style: { flexDirection: "row", padding: 8, backgroundColor: i % 2 === 0 ? C.offwhite : C.white }, children: [
    /* @__PURE__ */ jsx(Text, { style: { flex: 1.5, fontFamily: "Outfit", fontWeight: 600, fontSize: 8.5, color: C.black }, children: role }),
    /* @__PURE__ */ jsx(Text, { style: { flex: 2, fontFamily: "Outfit", fontWeight: 400, fontSize: 8.5, color: C.black60 }, children: size }),
    /* @__PURE__ */ jsx(Text, { style: { flex: 1.5, fontFamily: "Outfit", fontWeight: 400, fontSize: 8.5, color: C.black60 }, children: font }),
    /* @__PURE__ */ jsx(Text, { style: { flex: 0.8, fontFamily: "Outfit", fontWeight: 400, fontSize: 8.5, color: C.black40 }, children: ls }),
    /* @__PURE__ */ jsx(Text, { style: { flex: 0.5, fontFamily: "Outfit", fontWeight: 400, fontSize: 8.5, color: C.black40 }, children: lh })
  ] }, i)) }),
  /* @__PURE__ */ jsx(PageFooter, { pageNum: "05" })
] });
var VoicePage = () => /* @__PURE__ */ jsxs(PageChrome, { children: [
  /* @__PURE__ */ jsx(SectionLabel, { children: "Brand Voice" }),
  /* @__PURE__ */ jsx(PageTitle, { children: "Voice & Tone" }),
  /* @__PURE__ */ jsx(BodyText, { style: { marginBottom: 28 }, children: "ZeeActs speaks like a trusted technical expert \u2014 confident without arrogance, precise without being cold. We are direct, human, and results-focused." }),
  /* @__PURE__ */ jsx(View, { style: { flexDirection: "row", gap: 16, marginBottom: 28 }, children: [
    { trait: "Confident", desc: `We state facts, not opinions. We don't hedge with "maybe" or "could potentially".` },
    { trait: "Direct", desc: "Short sentences. Active voice. No corporate jargon. If it takes more than 10 words, cut it." },
    { trait: "Expert", desc: "We know our industry. We speak with domain authority \u2014 HVAC, ERP, AI, and field service." },
    { trait: "Human", desc: "We talk like a smart friend who happens to be a software engineer \u2014 relatable, not robotic." }
  ].map(({ trait, desc }) => /* @__PURE__ */ jsxs(View, { style: { flex: 1, borderLeftWidth: 2, borderLeftColor: C.crimson, paddingLeft: 12 }, children: [
    /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Syne", fontWeight: 800, fontSize: 10, color: C.black, marginBottom: 5 }, children: trait }),
    /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 8.5, color: C.black60, lineHeight: 1.65 }, children: desc })
  ] }, trait)) }),
  /* @__PURE__ */ jsx(Divider, {}),
  /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Syne", fontWeight: 800, fontSize: 14, color: C.black, marginBottom: 14 }, children: "Headline Formulas" }),
  /* @__PURE__ */ jsx(View, { style: { flexDirection: "row", gap: 12, marginBottom: 24 }, children: [
    { label: "Problem \u2192 Solution", ex: '"Stop Losing Jobs to WhatsApp Chaos"' },
    { label: "Outcome-first", ex: '"60% Fewer Callbacks. Starting Day One."' },
    { label: "Identity statement", ex: '"Built for Pakistani HVAC. By people who know HVAC."' }
  ].map(({ label, ex }) => /* @__PURE__ */ jsxs(View, { style: { flex: 1, backgroundColor: C.black, borderRadius: 8, padding: 16 }, children: [
    /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 7.5, color: C.crimson, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }, children: label }),
    /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Syne", fontWeight: 800, fontSize: 11, color: C.white, lineHeight: 1.4 }, children: ex })
  ] }, label)) }),
  /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Syne", fontWeight: 800, fontSize: 14, color: C.black, marginBottom: 12 }, children: "Do / Don't" }),
  /* @__PURE__ */ jsxs(View, { style: { flexDirection: "row", gap: 12 }, children: [
    /* @__PURE__ */ jsx(View, { style: { flex: 1 }, children: [
      ["\u2713", 'Use active voice: "We deploy in 2 weeks"'],
      ["\u2713", "Name the customer problem directly"],
      ["\u2713", "Use industry-specific language (HVAC, ERP)"],
      ["\u2713", 'Be specific: "127 projects shipped" not "many"']
    ].map(([ico, txt]) => /* @__PURE__ */ jsxs(View, { style: { flexDirection: "row", gap: 8, marginBottom: 8, alignItems: "flex-start" }, children: [
      /* @__PURE__ */ jsx(View, { style: { width: 16, height: 16, borderRadius: 8, backgroundColor: C.crimson, alignItems: "center", justifyContent: "center", marginTop: 0.5 }, children: /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 700, fontSize: 8, color: C.white }, children: ico }) }),
      /* @__PURE__ */ jsx(Text, { style: { flex: 1, fontFamily: "Outfit", fontWeight: 400, fontSize: 9, color: C.black60, lineHeight: 1.6 }, children: txt })
    ] }, txt)) }),
    /* @__PURE__ */ jsx(View, { style: { flex: 1 }, children: [
      ["\u2717", 'Passive voice: "Solutions are delivered by us"'],
      ["\u2717", 'Hedging: "We might be able to help you with..."'],
      ["\u2717", 'Generic claims: "Best-in-class solution"'],
      ["\u2717", 'Buzzwords without substance: "Synergize", "leverage"']
    ].map(([ico, txt]) => /* @__PURE__ */ jsxs(View, { style: { flexDirection: "row", gap: 8, marginBottom: 8, alignItems: "flex-start" }, children: [
      /* @__PURE__ */ jsx(View, { style: { width: 16, height: 16, borderRadius: 8, backgroundColor: C.black05, alignItems: "center", justifyContent: "center", marginTop: 0.5 }, children: /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 700, fontSize: 8, color: C.black40 }, children: ico }) }),
      /* @__PURE__ */ jsx(Text, { style: { flex: 1, fontFamily: "Outfit", fontWeight: 400, fontSize: 9, color: C.black60, lineHeight: 1.6 }, children: txt })
    ] }, txt)) })
  ] }),
  /* @__PURE__ */ jsx(PageFooter, { pageNum: "06" })
] });
var BusinessCardPage = () => {
  const cardW = 240, cardH = 136;
  const CardFront = () => /* @__PURE__ */ jsxs(View, { style: { width: cardW, height: cardH, backgroundColor: C.black, borderRadius: 8, padding: 18, justifyContent: "space-between" }, children: [
    /* @__PURE__ */ jsx(ZeeActsLogo, { variant: "dark", scale: 0.72 }),
    /* @__PURE__ */ jsxs(View, { children: [
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Syne", fontWeight: 800, fontSize: 11, color: C.white, marginBottom: 2 }, children: "Muhammad Z. Founder" }),
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 8, color: "rgba(255,255,255,0.5)" }, children: "CEO \xB7 ZeeActs Technologies" }),
      /* @__PURE__ */ jsx(View, { style: { width: 30, height: 1.5, backgroundColor: C.crimson, marginTop: 8 } })
    ] }),
    /* @__PURE__ */ jsx(Svg, { style: { position: "absolute", bottom: 0, right: 0, width: cardW, height: cardH }, children: /* @__PURE__ */ jsx(Polygon, { points: `${cardW * 0.65},${cardH} ${cardW},${cardH} ${cardW},${cardH * 0.45}`, fill: C.crimson, opacity: 0.15 }) })
  ] });
  const CardBack = () => /* @__PURE__ */ jsxs(View, { style: { width: cardW, height: cardH, backgroundColor: C.crimson, borderRadius: 8, padding: 18, justifyContent: "space-between" }, children: [
    /* @__PURE__ */ jsx(View, { style: { position: "absolute", top: 20, right: 18, flexDirection: "column", gap: 5 }, children: [{ w: 50, op: 0.25 }, { w: 36, op: 0.18 }, { w: 22, op: 0.12 }].map(({ w, op }, i) => /* @__PURE__ */ jsxs(View, { style: { flexDirection: "row", alignItems: "center", opacity: op }, children: [
      /* @__PURE__ */ jsx(View, { style: { width: w, height: 3, backgroundColor: C.white } }),
      /* @__PURE__ */ jsx(Svg, { width: 8, height: 9, children: /* @__PURE__ */ jsx(Polygon, { points: "0,0 8,4.5 0,9", fill: C.white }) })
    ] }, i)) }),
    /* @__PURE__ */ jsxs(View, { children: [
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 8, color: "rgba(255,255,255,0.6)", marginBottom: 4 }, children: "zeeacts.com" }),
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 8, color: "rgba(255,255,255,0.6)", marginBottom: 4 }, children: "info@zeeacts.com" }),
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 8, color: "rgba(255,255,255,0.6)" }, children: "+92 300 000 0000" })
    ] }),
    /* @__PURE__ */ jsxs(Text, { style: { fontFamily: "Syne", fontWeight: 800, fontSize: 10, color: "rgba(255,255,255,0.9)", letterSpacing: -0.3 }, children: [
      "Software That Builds.",
      "\n",
      "AI That Scales."
    ] })
  ] });
  return /* @__PURE__ */ jsxs(PageChrome, { children: [
    /* @__PURE__ */ jsx(SectionLabel, { children: "Stationery" }),
    /* @__PURE__ */ jsx(PageTitle, { children: "Business Card" }),
    /* @__PURE__ */ jsx(BodyText, { style: { marginBottom: 28 }, children: "Standard format: 85 \xD7 48 mm. Front: black background with logo and name. Back: crimson with contact details and tagline. Print on 400gsm silk with spot UV on the logo." }),
    /* @__PURE__ */ jsxs(View, { style: { flexDirection: "row", gap: 24, justifyContent: "center", marginBottom: 28 }, children: [
      /* @__PURE__ */ jsxs(View, { style: { alignItems: "center", gap: 8 }, children: [
        /* @__PURE__ */ jsx(CardFront, {}),
        /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 7.5, color: C.black40, letterSpacing: 1.5, textTransform: "uppercase" }, children: "Front" })
      ] }),
      /* @__PURE__ */ jsxs(View, { style: { alignItems: "center", gap: 8 }, children: [
        /* @__PURE__ */ jsx(CardBack, {}),
        /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 7.5, color: C.black40, letterSpacing: 1.5, textTransform: "uppercase" }, children: "Back" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Divider, {}),
    /* @__PURE__ */ jsx(View, { style: { flexDirection: "row", gap: 12 }, children: [
      { label: "Size", value: "85 \xD7 48 mm (standard)" },
      { label: "Stock", value: "400gsm Silk Coated" },
      { label: "Finish", value: "Spot UV on Z-box + Logo" },
      { label: "Bleed", value: "3mm all sides" }
    ].map(({ label, value }) => /* @__PURE__ */ jsxs(View, { style: { flex: 1, backgroundColor: C.offwhite, borderRadius: 6, padding: 12 }, children: [
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 7.5, color: C.black40, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }, children: label }),
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 500, fontSize: 9, color: C.black }, children: value })
    ] }, label)) }),
    /* @__PURE__ */ jsx(PageFooter, { pageNum: "07" })
  ] });
};
var LetterheadPage = () => /* @__PURE__ */ jsxs(Page, { size: "A4", style: { backgroundColor: C.white, fontFamily: "Outfit", fontWeight: 400 }, children: [
  /* @__PURE__ */ jsxs(View, { style: { backgroundColor: C.black, paddingHorizontal: M, paddingVertical: 22, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, children: [
    /* @__PURE__ */ jsx(ZeeActsLogo, { variant: "dark", scale: 1 }),
    /* @__PURE__ */ jsxs(View, { style: { alignItems: "flex-end" }, children: [
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 8, color: "rgba(255,255,255,0.5)" }, children: "zeeacts.com \xB7 info@zeeacts.com" }),
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 8, color: "rgba(255,255,255,0.5)", marginTop: 2 }, children: "Lahore, Pakistan" })
    ] })
  ] }),
  /* @__PURE__ */ jsx(View, { style: { height: 3, backgroundColor: C.crimson } }),
  /* @__PURE__ */ jsxs(View, { style: { flex: 1, padding: M, paddingTop: 36 }, children: [
    /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 9.5, color: C.black40, marginBottom: 24 }, children: "6 April 2025" }),
    /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 500, fontSize: 10, color: C.black, marginBottom: 4 }, children: "Client Name" }),
    /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 10, color: C.black60, marginBottom: 24 }, children: "Company Name \xB7 City, Pakistan" }),
    /* @__PURE__ */ jsxs(View, { style: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 20 }, children: [
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 10, color: C.black }, children: "Subject:" }),
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 10, color: C.black60 }, children: "Proposal for Field Service Management Platform" })
    ] }),
    ["Dear [Name],", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.", "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."].map((para, i) => /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 10, color: C.black60, lineHeight: 1.8, marginBottom: 14 }, children: para }, i)),
    /* @__PURE__ */ jsxs(View, { style: { marginTop: 36 }, children: [
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 10, color: C.black60, marginBottom: 32 }, children: "Warm regards," }),
      /* @__PURE__ */ jsx(View, { style: { width: 80, height: 1, backgroundColor: C.black20, marginBottom: 6 } }),
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Syne", fontWeight: 800, fontSize: 11, color: C.black }, children: "Muhammad Zeeshan" }),
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 9.5, color: C.black40 }, children: "CEO, ZeeActs Technologies" })
    ] })
  ] }),
  /* @__PURE__ */ jsxs(View, { style: { height: 36, backgroundColor: C.black05, paddingHorizontal: M, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, children: [
    /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 7.5, color: C.black40 }, children: "ZeeActs Technologies \xB7 Lahore, Pakistan" }),
    /* @__PURE__ */ jsxs(View, { style: { flexDirection: "row", alignItems: "center", gap: 8 }, children: [
      /* @__PURE__ */ jsx(View, { style: { width: 12, height: 1.5, backgroundColor: C.crimson } }),
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 7.5, color: C.crimson }, children: "zeeacts.com" })
    ] })
  ] })
] });
var SocialPostPage = () => {
  const postW = 240;
  const postH = postW * (5 / 4);
  const PostTemplate1 = ({ bg, headColor, tagColor, textColor }) => /* @__PURE__ */ jsxs(View, { style: { width: postW, height: postH, backgroundColor: bg, borderRadius: 8, padding: 24, justifyContent: "space-between" }, children: [
    /* @__PURE__ */ jsx(ZeeActsLogo, { variant: bg === C.black ? "dark" : "light", scale: 0.62 }),
    /* @__PURE__ */ jsxs(View, { children: [
      /* @__PURE__ */ jsx(View, { style: { paddingHorizontal: 8, paddingVertical: 4, backgroundColor: tagColor, borderRadius: 3, alignSelf: "flex-start", marginBottom: 12 }, children: /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 7, color: bg === C.crimson ? C.white : C.crimson, letterSpacing: 2, textTransform: "uppercase" }, children: "HVAC \xB7 FIELD SERVICE" }) }),
      /* @__PURE__ */ jsxs(Text, { style: { fontFamily: "Syne", fontWeight: 800, fontSize: 22, color: headColor, letterSpacing: -0.8, lineHeight: 1.1, marginBottom: 12 }, children: [
        "Stop Losing",
        "\n",
        "Jobs to",
        "\n",
        "WhatsApp Chaos."
      ] }),
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 9, color: textColor, lineHeight: 1.65 }, children: "AeroSoft OS tracks every complaint, dispatches your best technician, and sends WhatsApp updates \u2014 automatically." })
    ] }),
    /* @__PURE__ */ jsxs(View, { style: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, children: [
      /* @__PURE__ */ jsx(View, { style: { backgroundColor: C.crimson, borderRadius: 5, paddingHorizontal: 14, paddingVertical: 7 }, children: /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 8.5, color: C.white }, children: "Book a Free Demo \u2192" }) }),
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 7.5, color: textColor }, children: "zeeacts.com" })
    ] })
  ] });
  const PostTemplate2 = () => /* @__PURE__ */ jsxs(View, { style: { width: postW, height: postH, backgroundColor: C.crimson, borderRadius: 8, padding: 24, justifyContent: "space-between" }, children: [
    /* @__PURE__ */ jsx(ZeeActsLogo, { variant: "dark", scale: 0.62 }),
    /* @__PURE__ */ jsxs(View, { children: [
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Syne", fontWeight: 800, fontSize: 64, color: C.white, letterSpacing: -3, lineHeight: 1 }, children: "60%" }),
      /* @__PURE__ */ jsx(View, { style: { width: 36, height: 2.5, backgroundColor: "rgba(255,255,255,0.4)", marginVertical: 10 } }),
      /* @__PURE__ */ jsxs(Text, { style: { fontFamily: "Syne", fontWeight: 700, fontSize: 14, color: C.white, lineHeight: 1.3 }, children: [
        "Fewer customer",
        "\n",
        "callbacks after switching",
        "\n",
        "to AeroSoft OS."
      ] }),
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 8.5, color: "rgba(255,255,255,0.65)", marginTop: 10, lineHeight: 1.6 }, children: "Based on avg. across 50+ HVAC clients." })
    ] }),
    /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 500, fontSize: 8, color: "rgba(255,255,255,0.6)" }, children: "@zeeacts \xB7 zeeacts.com" })
  ] });
  const PostTemplate3 = () => /* @__PURE__ */ jsxs(View, { style: { width: postW, height: postH, backgroundColor: C.offwhite, borderRadius: 8, padding: 24, justifyContent: "space-between", borderWidth: 1, borderColor: C.black05 }, children: [
    /* @__PURE__ */ jsx(ZeeActsLogo, { variant: "light", scale: 0.62 }),
    /* @__PURE__ */ jsxs(View, { children: [
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 7.5, color: C.black40, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }, children: "WHY ZEEACTS" }),
      ["Deployed in weeks, not months", "Built for Pakistani business needs", "AI automation included \u2014 no extra cost", "WhatsApp + web integration out of box"].map((point, i) => /* @__PURE__ */ jsxs(View, { style: { flexDirection: "row", gap: 8, marginBottom: 9, alignItems: "flex-start" }, children: [
        /* @__PURE__ */ jsx(View, { style: { width: 14, height: 14, borderRadius: 7, backgroundColor: C.crimson, alignItems: "center", justifyContent: "center", marginTop: 0.5 }, children: /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 700, fontSize: 7, color: C.white }, children: "\u2713" }) }),
        /* @__PURE__ */ jsx(Text, { style: { flex: 1, fontFamily: "Outfit", fontWeight: 500, fontSize: 9, color: C.black, lineHeight: 1.55 }, children: point })
      ] }, i))
    ] }),
    /* @__PURE__ */ jsxs(View, { style: { borderTopWidth: 1, borderTopColor: C.black10, paddingTop: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, children: [
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Syne", fontWeight: 800, fontSize: 10, color: C.black }, children: "Software That Builds." }),
      /* @__PURE__ */ jsx(View, { style: { backgroundColor: C.crimson, borderRadius: 4, paddingHorizontal: 10, paddingVertical: 5 }, children: /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 7.5, color: C.white }, children: "Learn more \u2192" }) })
    ] })
  ] });
  return /* @__PURE__ */ jsxs(PageChrome, { children: [
    /* @__PURE__ */ jsx(SectionLabel, { children: "Social Media" }),
    /* @__PURE__ */ jsx(PageTitle, { children: "Social Posts  \u2014  4:5 (1080 \xD7 1350 px)" }),
    /* @__PURE__ */ jsx(BodyText, { style: { marginBottom: 20 }, children: "Three production-ready post templates. Export each at 1080 \xD7 1350 px for Instagram, Facebook, and LinkedIn feed. Maintain 60px safe zone on all sides." }),
    /* @__PURE__ */ jsxs(View, { style: { flexDirection: "row", gap: 14, justifyContent: "center" }, children: [
      /* @__PURE__ */ jsxs(View, { style: { alignItems: "center", gap: 7 }, children: [
        /* @__PURE__ */ jsx(PostTemplate1, { bg: C.black, headColor: C.white, tagColor: "rgba(230,57,80,0.15)", textColor: "rgba(255,255,255,0.55)" }),
        /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 7.5, color: C.black40, letterSpacing: 1, textTransform: "uppercase" }, children: "Pain Point" })
      ] }),
      /* @__PURE__ */ jsxs(View, { style: { alignItems: "center", gap: 7 }, children: [
        /* @__PURE__ */ jsx(PostTemplate2, {}),
        /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 7.5, color: C.black40, letterSpacing: 1, textTransform: "uppercase" }, children: "Stat / Proof" })
      ] }),
      /* @__PURE__ */ jsxs(View, { style: { alignItems: "center", gap: 7 }, children: [
        /* @__PURE__ */ jsx(PostTemplate3, {}),
        /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 7.5, color: C.black40, letterSpacing: 1, textTransform: "uppercase" }, children: "Value Prop" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(PageFooter, { pageNum: "09" })
  ] });
};
var AdsPage = () => {
  const adW = 240;
  const adH = adW * (5 / 4);
  const Ad1 = () => /* @__PURE__ */ jsxs(View, { style: { width: adW, height: adH, backgroundColor: C.black, borderRadius: 8, overflow: "hidden" }, children: [
    /* @__PURE__ */ jsx(Svg, { style: { position: "absolute", top: 0, left: 0, width: adW, height: adH }, children: /* @__PURE__ */ jsx(Polygon, { points: `0,${adH * 0.45} ${adW * 0.7},0 ${adW},0 ${adW},0.01`, fill: C.crimson, opacity: 0.08 }) }),
    /* @__PURE__ */ jsxs(View, { style: { flex: 1, padding: 22, justifyContent: "space-between" }, children: [
      /* @__PURE__ */ jsx(ZeeActsLogo, { variant: "dark", scale: 0.62 }),
      /* @__PURE__ */ jsxs(View, { children: [
        /* @__PURE__ */ jsx(View, { style: { backgroundColor: "rgba(230,57,80,0.15)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 3, alignSelf: "flex-start", marginBottom: 12, borderLeftWidth: 2, borderLeftColor: C.crimson }, children: /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 7, color: C.crimson, letterSpacing: 2, textTransform: "uppercase" }, children: "HVAC SOFTWARE \xB7 META AD" }) }),
        /* @__PURE__ */ jsxs(Text, { style: { fontFamily: "Syne", fontWeight: 800, fontSize: 24, color: C.white, letterSpacing: -1, lineHeight: 1.08, marginBottom: 14 }, children: [
          "Your competitors",
          "\n",
          "are already using",
          "\n",
          /* @__PURE__ */ jsx(Text, { style: { color: C.crimson }, children: "AeroSoft OS." })
        ] }),
        /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 9, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, marginBottom: 20 }, children: "Manage complaints, dispatch techs, and track every job from one dashboard. WhatsApp updates included." }),
        /* @__PURE__ */ jsx(View, { style: { backgroundColor: C.crimson, borderRadius: 6, paddingVertical: 10, alignItems: "center" }, children: /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 10, color: C.white }, children: "Get a Free Demo Today \u2192" }) })
      ] }),
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 7.5, color: "rgba(255,255,255,0.3)" }, children: "zeeacts.com/solutions/hvac" })
    ] })
  ] });
  const Ad2 = () => /* @__PURE__ */ jsxs(View, { style: { width: adW, height: adH, backgroundColor: C.crimson, borderRadius: 8, padding: 22, justifyContent: "space-between" }, children: [
    /* @__PURE__ */ jsx(Svg, { style: { position: "absolute", top: 0, left: 0, width: adW, height: adH }, children: Array.from({ length: 6 }).map(
      (_, r) => Array.from({ length: 5 }).map((_2, c) => /* @__PURE__ */ jsx(Rect, { x: c * 50 + 12, y: r * 50 + 80, width: 3, height: 3, rx: 1.5, fill: "white", opacity: 0.1 }, `${r}-${c}`))
    ) }),
    /* @__PURE__ */ jsx(ZeeActsLogo, { variant: "dark", scale: 0.62 }),
    /* @__PURE__ */ jsxs(View, { children: [
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Syne", fontWeight: 800, fontSize: 48, color: C.white, letterSpacing: -2, lineHeight: 1, marginBottom: 4 }, children: "3\xD7" }),
      /* @__PURE__ */ jsxs(Text, { style: { fontFamily: "Syne", fontWeight: 800, fontSize: 18, color: C.white, letterSpacing: -0.5, lineHeight: 1.2, marginBottom: 12 }, children: [
        "Faster job dispatch.",
        "\n",
        "Same team. Same day."
      ] }),
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 9, color: "rgba(255,255,255,0.75)", lineHeight: 1.65, marginBottom: 20 }, children: "Stop the phone tag. Auto-dispatch your nearest available technician in seconds." }),
      /* @__PURE__ */ jsx(View, { style: { backgroundColor: C.black, borderRadius: 6, paddingVertical: 10, alignItems: "center" }, children: /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 10, color: C.white }, children: "Book Demo \u2014 It's Free \u2192" }) })
    ] }),
    /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 7.5, color: "rgba(255,255,255,0.5)" }, children: "@zeeacts \xB7 zeeacts.com" })
  ] });
  const Ad3 = () => /* @__PURE__ */ jsxs(View, { style: { width: adW, height: adH, backgroundColor: C.white, borderRadius: 8, padding: 22, justifyContent: "space-between", borderWidth: 1, borderColor: C.black05 }, children: [
    /* @__PURE__ */ jsx(ZeeActsLogo, { variant: "light", scale: 0.62 }),
    /* @__PURE__ */ jsxs(View, { children: [
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 7.5, color: C.black40, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }, children: "BUILT FOR HVAC COMPANIES" }),
      /* @__PURE__ */ jsxs(Text, { style: { fontFamily: "Syne", fontWeight: 800, fontSize: 20, color: C.black, letterSpacing: -0.8, lineHeight: 1.1, marginBottom: 14 }, children: [
        "From complaint",
        "\n",
        "to",
        /* @__PURE__ */ jsx(Text, { style: { color: C.crimson }, children: " resolved" }),
        "\n",
        "in 2 taps."
      ] }),
      ["No more WhatsApp chaos", "Real-time technician tracking", "Automated customer updates", "Rs 0 setup cost"].map((feat, i) => /* @__PURE__ */ jsxs(View, { style: { flexDirection: "row", gap: 7, marginBottom: 7 }, children: [
        /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 700, fontSize: 9, color: C.crimson }, children: "\u2192" }),
        /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 9, color: C.black60 }, children: feat })
      ] }, i)),
      /* @__PURE__ */ jsx(View, { style: { marginTop: 14, backgroundColor: C.crimson, borderRadius: 6, paddingVertical: 10, alignItems: "center" }, children: /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 10, color: C.white }, children: "See It in Action \u2192" }) })
    ] }),
    /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 7.5, color: C.black40 }, children: "zeeacts.com/solutions/hvac" })
  ] });
  return /* @__PURE__ */ jsxs(PageChrome, { children: [
    /* @__PURE__ */ jsx(SectionLabel, { children: "Advertising" }),
    /* @__PURE__ */ jsx(PageTitle, { children: "Ad Creatives  \u2014  4:5 (1080 \xD7 1350 px)" }),
    /* @__PURE__ */ jsx(BodyText, { style: { marginBottom: 20 }, children: "Three ad angles: Identity (Fear of Missing Out), Outcome (3\xD7 faster), and Feature-proof (specific benefits). Use on Meta, LinkedIn, and Google Display. Always A/B test the headline." }),
    /* @__PURE__ */ jsxs(View, { style: { flexDirection: "row", gap: 14, justifyContent: "center" }, children: [
      /* @__PURE__ */ jsxs(View, { style: { alignItems: "center", gap: 7 }, children: [
        /* @__PURE__ */ jsx(Ad1, {}),
        /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 7.5, color: C.black40, letterSpacing: 1, textTransform: "uppercase" }, children: "FOMO / Identity" })
      ] }),
      /* @__PURE__ */ jsxs(View, { style: { alignItems: "center", gap: 7 }, children: [
        /* @__PURE__ */ jsx(Ad2, {}),
        /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 7.5, color: C.black40, letterSpacing: 1, textTransform: "uppercase" }, children: "Outcome / Stat" })
      ] }),
      /* @__PURE__ */ jsxs(View, { style: { alignItems: "center", gap: 7 }, children: [
        /* @__PURE__ */ jsx(Ad3, {}),
        /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 7.5, color: C.black40, letterSpacing: 1, textTransform: "uppercase" }, children: "Feature Proof" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(PageFooter, { pageNum: "10" })
  ] });
};
var LinkedInPage = () => {
  const coverW = 467;
  const coverH = coverW / 4;
  return /* @__PURE__ */ jsxs(PageChrome, { children: [
    /* @__PURE__ */ jsx(SectionLabel, { children: "LinkedIn" }),
    /* @__PURE__ */ jsx(PageTitle, { children: "LinkedIn Cover  \u2014  1584 \xD7 396 px" }),
    /* @__PURE__ */ jsx(BodyText, { style: { marginBottom: 28 }, children: "Company page banner. Design uses the full brand palette with the logo left-anchored and the tagline right-anchored. Exports at 1584 \xD7 396 px." }),
    /* @__PURE__ */ jsxs(View, { style: { marginBottom: 28, borderRadius: 10, overflow: "hidden", borderWidth: 1, borderColor: C.black10 }, children: [
      /* @__PURE__ */ jsx(View, { style: { height: 22, backgroundColor: "#0A66C2", flexDirection: "row", alignItems: "center", paddingHorizontal: 10 }, children: /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 8, color: C.white }, children: "linkedin.com/company/zeeacts" }) }),
      /* @__PURE__ */ jsxs(View, { style: { width: coverW + 2, height: coverH, backgroundColor: C.black, position: "relative", overflow: "hidden" }, children: [
        /* @__PURE__ */ jsxs(Svg, { style: { position: "absolute", top: 0, left: 0, width: coverW, height: coverH }, children: [
          /* @__PURE__ */ jsx(Polygon, { points: `0,0 ${coverW * 0.3},0 0,${coverH}`, fill: C.crimson, opacity: 0.9 }),
          /* @__PURE__ */ jsx(Polygon, { points: `${coverW},0 ${coverW},${coverH} ${coverW * 0.55},${coverH}`, fill: C.crimson, opacity: 0.06 })
        ] }),
        /* @__PURE__ */ jsxs(View, { style: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, flexDirection: "row", alignItems: "center", paddingHorizontal: 28, justifyContent: "space-between" }, children: [
          /* @__PURE__ */ jsx(ZeeActsLogo, { variant: "dark", scale: 0.8 }),
          /* @__PURE__ */ jsxs(View, { style: { alignItems: "flex-end" }, children: [
            /* @__PURE__ */ jsxs(Text, { style: { fontFamily: "Syne", fontWeight: 800, fontSize: 15, color: C.white, letterSpacing: -0.4, lineHeight: 1.15, textAlign: "right" }, children: [
              "Software That Builds.",
              "\n",
              /* @__PURE__ */ jsx(Text, { style: { color: C.crimson }, children: "AI That Scales." })
            ] }),
            /* @__PURE__ */ jsx(View, { style: { flexDirection: "row", gap: 6, marginTop: 8 }, children: ["Custom Software", "AI Automation", "Field Service"].map((tag) => /* @__PURE__ */ jsx(View, { style: { backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 3, paddingHorizontal: 6, paddingVertical: 2 }, children: /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 500, fontSize: 6.5, color: "rgba(255,255,255,0.7)" }, children: tag }) }, tag)) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(View, { style: { height: 30, backgroundColor: C.white, flexDirection: "row", alignItems: "center", paddingHorizontal: 12, gap: 10, borderTopWidth: 1, borderTopColor: C.black05 }, children: [
        /* @__PURE__ */ jsx(View, { style: { width: 28, height: 28, borderRadius: 14, backgroundColor: C.black, justifyContent: "center", alignItems: "center", marginTop: -14, borderWidth: 2, borderColor: C.white }, children: /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Syne", fontWeight: 800, fontSize: 10, color: C.white }, children: "Z" }) }),
        /* @__PURE__ */ jsxs(View, { children: [
          /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 8, color: C.black }, children: "ZeeActs Technologies" }),
          /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 7, color: C.black40 }, children: "IT Solutions Company \xB7 Lahore, Pakistan" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(View, { style: { flexDirection: "row", gap: 12 }, children: [
      { label: "Dimensions", value: "1584 \xD7 396 px" },
      { label: "Aspect Ratio", value: "4:1" },
      { label: "Safe Zone", value: "Logo: left 160px\nText: right 320px" },
      { label: "Format", value: "PNG at 72 DPI\nUnder 8MB" }
    ].map(({ label, value }) => /* @__PURE__ */ jsxs(View, { style: { flex: 1, backgroundColor: C.offwhite, borderRadius: 6, padding: 12 }, children: [
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 600, fontSize: 7.5, color: C.black40, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }, children: label }),
      /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 500, fontSize: 9, color: C.black, lineHeight: 1.6 }, children: value })
    ] }, label)) }),
    /* @__PURE__ */ jsx(PageFooter, { pageNum: "11" })
  ] });
};
var BrandRulesPage = () => /* @__PURE__ */ jsxs(PageChrome, { children: [
  /* @__PURE__ */ jsx(SectionLabel, { children: "Usage Rules" }),
  /* @__PURE__ */ jsx(PageTitle, { children: "Brand Do's & Don'ts" }),
  /* @__PURE__ */ jsxs(View, { style: { flexDirection: "row", gap: 16, marginBottom: 24 }, children: [
    /* @__PURE__ */ jsxs(View, { style: { flex: 1 }, children: [
      /* @__PURE__ */ jsxs(View, { style: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 }, children: [
        /* @__PURE__ */ jsx(View, { style: { width: 18, height: 18, borderRadius: 9, backgroundColor: "#22c55e", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 700, fontSize: 9, color: C.white }, children: "\u2713" }) }),
        /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Syne", fontWeight: 800, fontSize: 12, color: C.black }, children: "Do" })
      ] }),
      [
        "Use the logo on black, white, or crimson backgrounds only",
        "Keep minimum 36px clear space around the logo",
        "Use Syne ExtraBold (800) for all display headlines",
        "Use Outfit Regular/Medium for all body and UI text",
        "Use #E63950 Crimson as the primary action colour",
        "Maintain the exact logo proportions \u2014 never stretch or squash",
        "Use the velocity arrows motif as a supporting graphic element"
      ].map((rule, i) => /* @__PURE__ */ jsxs(View, { style: { flexDirection: "row", gap: 7, marginBottom: 7, alignItems: "flex-start" }, children: [
        /* @__PURE__ */ jsx(View, { style: { width: 4, height: 4, borderRadius: 2, backgroundColor: "#22c55e", marginTop: 4 } }),
        /* @__PURE__ */ jsx(Text, { style: { flex: 1, fontFamily: "Outfit", fontWeight: 400, fontSize: 9, color: C.black60, lineHeight: 1.6 }, children: rule })
      ] }, i))
    ] }),
    /* @__PURE__ */ jsxs(View, { style: { flex: 1 }, children: [
      /* @__PURE__ */ jsxs(View, { style: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 }, children: [
        /* @__PURE__ */ jsx(View, { style: { width: 18, height: 18, borderRadius: 9, backgroundColor: C.crimson, alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 700, fontSize: 9, color: C.white }, children: "\u2717" }) }),
        /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Syne", fontWeight: 800, fontSize: 12, color: C.black }, children: "Don't" })
      ] }),
      [
        "Rearrange or separate logo elements (Z-box, arrows, wordmark)",
        "Use the logo on any background colour other than black, white, or crimson",
        "Apply transparency or drop shadows to the logo",
        "Use any font other than Syne (headlines) and Outfit (body)",
        "Alter the crimson or black brand colours \u2014 even slightly",
        "Use the logo at below 80px width on screen or 22mm in print",
        'Substitute "ZeeActs" with abbreviations like "ZA" in formal materials'
      ].map((rule, i) => /* @__PURE__ */ jsxs(View, { style: { flexDirection: "row", gap: 7, marginBottom: 7, alignItems: "flex-start" }, children: [
        /* @__PURE__ */ jsx(View, { style: { width: 4, height: 4, borderRadius: 2, backgroundColor: C.crimson, marginTop: 4 } }),
        /* @__PURE__ */ jsx(Text, { style: { flex: 1, fontFamily: "Outfit", fontWeight: 400, fontSize: 9, color: C.black60, lineHeight: 1.6 }, children: rule })
      ] }, i))
    ] })
  ] }),
  /* @__PURE__ */ jsx(Divider, {}),
  /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Syne", fontWeight: 800, fontSize: 14, color: C.black, marginBottom: 14 }, children: "Email Signature" }),
  /* @__PURE__ */ jsxs(View, { style: { borderRadius: 8, borderWidth: 1, borderColor: C.black10, overflow: "hidden" }, children: [
    /* @__PURE__ */ jsxs(View, { style: { backgroundColor: C.offwhite, padding: 20, flexDirection: "row", gap: 16, alignItems: "center" }, children: [
      /* @__PURE__ */ jsx(View, { style: { width: 3, backgroundColor: C.crimson, alignSelf: "stretch", borderRadius: 2 } }),
      /* @__PURE__ */ jsxs(View, { children: [
        /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Syne", fontWeight: 800, fontSize: 13, color: C.black }, children: "Muhammad Zeeshan" }),
        /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 500, fontSize: 9.5, color: C.black60, marginBottom: 8 }, children: "CEO \xB7 ZeeActs Technologies" }),
        /* @__PURE__ */ jsxs(View, { style: { flexDirection: "row", gap: 16 }, children: [
          /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 8.5, color: C.black40 }, children: "\u{1F4E7} info@zeeacts.com" }),
          /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 8.5, color: C.black40 }, children: "\u{1F310} zeeacts.com" }),
          /* @__PURE__ */ jsx(Text, { style: { fontFamily: "Outfit", fontWeight: 400, fontSize: 8.5, color: C.black40 }, children: "\u{1F4F1} +92 300 000 0000" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(View, { style: { marginLeft: "auto" }, children: /* @__PURE__ */ jsx(ZeeActsLogo, { variant: "light", scale: 0.65 }) })
    ] }),
    /* @__PURE__ */ jsx(View, { style: { backgroundColor: C.crimson, height: 3 } })
  ] }),
  /* @__PURE__ */ jsx(PageFooter, { pageNum: "12" })
] });
var BrandGuidelinesDoc = () => /* @__PURE__ */ jsxs(Document, { title: "ZeeActs Brand Guidelines 2025", author: "ZeeActs Technologies", children: [
  /* @__PURE__ */ jsx(CoverPage, {}),
  /* @__PURE__ */ jsx(PhilosophyPage, {}),
  /* @__PURE__ */ jsx(LogoPage, {}),
  /* @__PURE__ */ jsx(ColorPage, {}),
  /* @__PURE__ */ jsx(TypoPage, {}),
  /* @__PURE__ */ jsx(VoicePage, {}),
  /* @__PURE__ */ jsx(BusinessCardPage, {}),
  /* @__PURE__ */ jsx(LetterheadPage, {}),
  /* @__PURE__ */ jsx(SocialPostPage, {}),
  /* @__PURE__ */ jsx(AdsPage, {}),
  /* @__PURE__ */ jsx(LinkedInPage, {}),
  /* @__PURE__ */ jsx(BrandRulesPage, {})
] });
var outPath = join(process.cwd(), "..", "..", "exports", "zeeacts-brand-guidelines.pdf");
console.log("Generating brand guidelines PDF\u2026");
await ReactPDF.renderToFile(/* @__PURE__ */ jsx(BrandGuidelinesDoc, {}), outPath);
console.log(`\u2705  Saved: ${outPath}`);
