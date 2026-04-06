import ReactPDF, {
  Document, Page, View, Text, Svg, Rect, Polygon, G,
  Font, StyleSheet, Link,
} from '@react-pdf/renderer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─────────────────────────────────────────────────────────────────────────────
// FONTS
// ─────────────────────────────────────────────────────────────────────────────
Font.register({
  family: 'Syne',
  fonts: [
    { src: join(__dirname, 'fonts', 'Syne-Bold.ttf'), fontWeight: 700 },
    { src: join(__dirname, 'fonts', 'Syne-ExtraBold.ttf'), fontWeight: 800 },
  ],
});
Font.register({
  family: 'Outfit',
  fonts: [
    { src: join(__dirname, 'fonts', 'Outfit-Regular.ttf'), fontWeight: 400 },
    { src: join(__dirname, 'fonts', 'Outfit-Medium.ttf'), fontWeight: 500 },
    { src: join(__dirname, 'fonts', 'Outfit-SemiBold.ttf'), fontWeight: 600 },
  ],
});

// ─────────────────────────────────────────────────────────────────────────────
// BRAND TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  crimson:      '#E63950',
  crimson90:    '#E94F62',
  crimson10:    '#FBE8EB',
  crimson20:    '#F7C5CC',
  crimson40:    '#F09BAA',
  black:        '#0A0A0F',
  black80:      '#1F1F26',
  black60:      '#3B3B44',
  black40:      '#6B6B72',
  black20:      '#9B9BA0',
  black10:      '#C8C8CC',
  black05:      '#EDEDF0',
  white:        '#FFFFFF',
  offwhite:     '#F7F7FA',
};

// ─────────────────────────────────────────────────────────────────────────────
// LOGO COMPONENT  (pure react-pdf primitives)
// ─────────────────────────────────────────────────────────────────────────────
const ZeeActsLogo = ({ variant = 'dark', scale = 1 }) => {
  const boxBg   = variant === 'dark' ? C.white  : C.black;
  const zColor  = variant === 'dark' ? C.black  : C.white;
  const zeeClr  = variant === 'dark' ? C.white  : C.black;
  const s = scale;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 * s }}>
      {/* ── Box ── */}
      <View style={{ width: 36 * s, height: 36 * s, backgroundColor: boxBg, position: 'relative' }}>
        <Svg style={{ position: 'absolute', top: 0, left: 0, width: 36 * s, height: 36 * s }}>
          <Polygon
            points={`${25 * s},${36 * s} ${36 * s},${36 * s} ${36 * s},${25 * s}`}
            fill={C.crimson}
          />
        </Svg>
        <Text style={{
          fontFamily: 'Syne', fontWeight: 800,
          fontSize: 22 * s, color: zColor,
          position: 'absolute', top: 2 * s, left: 0, right: 0,
          textAlign: 'center',
        }}>Z</Text>
      </View>

      {/* ── Arrows ── */}
      <View style={{ flexDirection: 'column', gap: 3.5 * s }}>
        {[
          { w: 18 * s, op: 1.0 },
          { w: 13 * s, op: 0.6 },
          { w:  8 * s, op: 0.35 },
        ].map(({ w, op }, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', opacity: op }}>
            <View style={{ width: w, height: 2.5 * s, backgroundColor: C.crimson, borderRadius: 1 }} />
            <Svg width={6 * s} height={7 * s}>
              <Polygon points={`0,0 ${6 * s},${3.5 * s} 0,${7 * s}`} fill={C.crimson} />
            </Svg>
          </View>
        ))}
      </View>

      {/* ── Wordmark ── */}
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20 * s, color: zeeClr, letterSpacing: -0.5 }}>Zee</Text>
        <Text style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20 * s, color: C.crimson, letterSpacing: -0.5 }}>Acts</Text>
      </View>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SHARED LAYOUT HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const M = 44; // page margin
const A4 = { size: 'A4' };

const PageChrome = ({ children, bg = C.white, margin = M }) => (
  <Page size="A4" style={{ backgroundColor: bg, padding: margin, fontFamily: 'Outfit', fontWeight: 400 }}>
    {children}
  </Page>
);

const SectionLabel = ({ children, color = C.crimson }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
    <View style={{ width: 20, height: 2, backgroundColor: color }} />
    <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 8, color, letterSpacing: 4, textTransform: 'uppercase' }}>{children}</Text>
  </View>
);

const PageTitle = ({ children, color = C.black }) => (
  <Text style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 32, color, letterSpacing: -1, lineHeight: 1.1, marginBottom: 6 }}>{children}</Text>
);

const BodyText = ({ children, style }) => (
  <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 10, color: C.black60, lineHeight: 1.7, ...style }}>{children}</Text>
);

const Divider = ({ color = C.black05, mt = 16, mb = 16 }) => (
  <View style={{ height: 1, backgroundColor: color, marginTop: mt, marginBottom: mb }} />
);

const PageFooter = ({ pageNum, variant = 'dark' }) => {
  const clr = variant === 'dark' ? C.black20 : 'rgba(255,255,255,0.3)';
  return (
    <View style={{ position: 'absolute', bottom: 28, left: M, right: M, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 7.5, color: clr, letterSpacing: 1 }}>ZEEACTS BRAND GUIDELINES 2025</Text>
      <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 7.5, color: clr }}>{pageNum}</Text>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 1 — COVER
// ─────────────────────────────────────────────────────────────────────────────
const CoverPage = () => (
  <Page size="A4" style={{ backgroundColor: C.crimson, padding: 0 }}>
    {/* Top stripe */}
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, backgroundColor: C.black }} />
    {/* Grid texture dots */}
    <View style={{ position: 'absolute', top: 60, right: 0, bottom: 0, left: 0, opacity: 0.06 }}>
      {Array.from({ length: 18 }).map((_, r) => (
        <View key={r} style={{ flexDirection: 'row', gap: 28, marginBottom: 28, marginLeft: 60 }}>
          {Array.from({ length: 14 }).map((_, c) => (
            <View key={c} style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: C.white }} />
          ))}
        </View>
      ))}
    </View>

    {/* Logo top-left */}
    <View style={{ position: 'absolute', top: 48, left: M }}>
      <ZeeActsLogo variant="dark" scale={1.05} />
    </View>

    {/* Main content — bottom half */}
    <View style={{ position: 'absolute', bottom: 100, left: M, right: M }}>
      <View style={{ width: 40, height: 2, backgroundColor: 'rgba(255,255,255,0.4)', marginBottom: 20 }} />
      <Text style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 52, color: C.white, letterSpacing: -2, lineHeight: 1.05, marginBottom: 8 }}>
        Brand{'\n'}Guidelines
      </Text>
      <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 14, color: 'rgba(255,255,255,0.75)', marginBottom: 32, lineHeight: 1.5 }}>
        Identity System · 2025 Edition
      </Text>

      <Divider color="rgba(255,255,255,0.2)" mt={0} mb={24} />

      <View style={{ flexDirection: 'row', gap: 40 }}>
        {[
          ['Colors', 'Crimson · Black · White'],
          ['Typography', 'Syne · Outfit'],
          ['Formats', 'Stationery · Social · Ads'],
        ].map(([k, v]) => (
          <View key={k}>
            <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 8, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 3 }}>{k}</Text>
            <Text style={{ fontFamily: 'Outfit', fontWeight: 500, fontSize: 9.5, color: C.white }}>{v}</Text>
          </View>
        ))}
      </View>
    </View>
  </Page>
);

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 2 — BRAND PHILOSOPHY
// ─────────────────────────────────────────────────────────────────────────────
const PhilosophyPage = () => (
  <PageChrome>
    <SectionLabel>Brand Identity</SectionLabel>
    <PageTitle>Who We Are</PageTitle>
    <BodyText style={{ maxWidth: 380, marginBottom: 36 }}>
      ZeeActs is a premium IT solutions company building complaint management systems, HVAC field service platforms, custom ERP, and AI-powered automation — purpose-built for Pakistani businesses.
    </BodyText>

    <View style={{ flexDirection: 'row', gap: 16, marginBottom: 36 }}>
      {[
        { title: 'Mission', text: 'Turn chaos into clarity. Give Pakistani businesses the software infrastructure they deserve — fast, affordable, and built to last.' },
        { title: 'Vision',  text: 'Be the default technology partner for every serious Pakistani business — from HVAC companies to national enterprises.' },
        { title: 'Promise', text: 'We ship in weeks, not months. We build for your industry, not for a generic market. We stay until it works.' },
      ].map(({ title, text }) => (
        <View key={title} style={{ flex: 1, borderTopWidth: 2, borderTopColor: C.crimson, paddingTop: 14 }}>
          <Text style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 12, color: C.black, marginBottom: 8 }}>{title}</Text>
          <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 9, color: C.black60, lineHeight: 1.7 }}>{text}</Text>
        </View>
      ))}
    </View>

    <Divider />

    <Text style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 16, color: C.black, marginBottom: 16 }}>Brand Personality</Text>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {['Confident', 'Precise', 'Direct', 'Bold', 'Reliable', 'Human', 'Fast', 'Expert'].map(trait => (
        <View key={trait} style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 4, borderWidth: 1, borderColor: C.black10, backgroundColor: C.offwhite }}>
          <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 9, color: C.black }}>{trait}</Text>
        </View>
      ))}
    </View>

    <Divider />

    <View style={{ backgroundColor: C.black, borderRadius: 10, padding: 28 }}>
      <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 8, color: 'rgba(255,255,255,0.4)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Tagline</Text>
      <Text style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 22, color: C.white, letterSpacing: -0.5, lineHeight: 1.15 }}>
        Software That Builds.{'\n'}
        <Text style={{ color: C.crimson }}>AI That Scales.</Text>
      </Text>
    </View>
    <PageFooter pageNum="02" />
  </PageChrome>
);

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 3 — LOGO SYSTEM
// ─────────────────────────────────────────────────────────────────────────────
const LogoPage = () => (
  <PageChrome>
    <SectionLabel>Identity System</SectionLabel>
    <PageTitle>Logo System</PageTitle>
    <BodyText style={{ marginBottom: 28 }}>The ZeeActs mark is built from three elements: the Z-box, the velocity arrows, and the wordmark. Never alter, distort, or recolour any element.</BodyText>

    {/* Primary logo on white */}
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 8, color: C.black40, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>On Light Background</Text>
      <View style={{ backgroundColor: C.offwhite, borderRadius: 8, padding: 32, borderWidth: 1, borderColor: C.black05, alignItems: 'center' }}>
        <ZeeActsLogo variant="light" scale={1.4} />
      </View>
    </View>

    {/* Primary logo on dark */}
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 8, color: C.black40, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>On Dark Background</Text>
      <View style={{ backgroundColor: C.black, borderRadius: 8, padding: 32, alignItems: 'center' }}>
        <ZeeActsLogo variant="dark" scale={1.4} />
      </View>
    </View>

    {/* Primary logo on crimson */}
    <View style={{ marginBottom: 24 }}>
      <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 8, color: C.black40, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>On Brand Crimson</Text>
      <View style={{ backgroundColor: C.crimson, borderRadius: 8, padding: 32, alignItems: 'center' }}>
        <ZeeActsLogo variant="dark" scale={1.4} />
      </View>
    </View>

    {/* Size guidance */}
    <View style={{ backgroundColor: C.offwhite, borderRadius: 8, padding: 16, flexDirection: 'row', gap: 20 }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 9, color: C.black, marginBottom: 4 }}>Minimum Size</Text>
        <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 8, color: C.black60, lineHeight: 1.6 }}>Digital: 80px wide minimum{'\n'}Print: 22mm wide minimum{'\n'}Never reduce below these sizes.</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 9, color: C.black, marginBottom: 4 }}>Clear Space</Text>
        <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 8, color: C.black60, lineHeight: 1.6 }}>Maintain clear space equal to the height of the Z-box on all four sides of the logo.</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 9, color: C.black, marginBottom: 4 }}>Monochrome</Text>
        <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 8, color: C.black60, lineHeight: 1.6 }}>For single-colour use, render the entire logo in black (#0A0A0F) on white, or white on black.</Text>
      </View>
    </View>

    <PageFooter pageNum="03" />
  </PageChrome>
);

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 4 — COLOR PALETTE
// ─────────────────────────────────────────────────────────────────────────────
const ColorSwatch = ({ hex, name, okl, sub, textLight = false }) => (
  <View style={{ flex: 1, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: C.black05 }}>
    <View style={{ height: 80, backgroundColor: hex, justifyContent: 'flex-end', padding: 10 }}>
      {sub && <Text style={{ fontFamily: 'Outfit', fontWeight: 500, fontSize: 7.5, color: textLight ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)', marginBottom: 2 }}>{sub}</Text>}
    </View>
    <View style={{ backgroundColor: C.white, padding: 10 }}>
      <Text style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 10, color: C.black, marginBottom: 2 }}>{name}</Text>
      <Text style={{ fontFamily: 'Outfit', fontWeight: 500, fontSize: 8, color: C.black40, marginBottom: 1 }}>{hex}</Text>
      <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 7.5, color: C.black20 }}>{okl}</Text>
    </View>
  </View>
);

const ColorPage = () => (
  <PageChrome>
    <SectionLabel>Colour System</SectionLabel>
    <PageTitle>Brand Colours</PageTitle>
    <BodyText style={{ marginBottom: 24 }}>ZeeActs uses a bold two-tone palette anchored by Crimson and Deep Black. These are the only two brand colours — all other tones are tints and shades derived from them.</BodyText>

    {/* Primary colours */}
    <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 8, color: C.black40, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Primary Palette</Text>
    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
      <ColorSwatch hex={C.crimson} name="Crimson" okl="oklch(58% 0.21 15)" sub="Primary Brand" textLight />
      <ColorSwatch hex={C.black}   name="Deep Black" okl="oklch(5% 0.01 280)" sub="Primary Text" textLight />
      <ColorSwatch hex={C.white}   name="Pure White" okl="oklch(100% 0 0)" sub="Base Background" />
    </View>

    {/* Crimson tints */}
    <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 8, color: C.black40, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Crimson Scale</Text>
    <View style={{ flexDirection: 'row', gap: 6, marginBottom: 20 }}>
      {[
        ['#FBE8EB','50'],['#F7C5CC','100'],['#F09BAA','200'],['#E96875','300'],
        ['#E63950','400'],['#CF2F44','500'],['#B52639','600'],['#8A1C2B','700'],
      ].map(([hex, n]) => (
        <View key={n} style={{ flex: 1 }}>
          <View style={{ height: 32, backgroundColor: hex, borderRadius: 4, marginBottom: 4 }} />
          <Text style={{ fontFamily: 'Outfit', fontWeight: 500, fontSize: 7, color: C.black60, textAlign: 'center' }}>{n}</Text>
          <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 6.5, color: C.black20, textAlign: 'center' }}>{hex}</Text>
        </View>
      ))}
    </View>

    {/* Neutral scale */}
    <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 8, color: C.black40, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Neutral Scale</Text>
    <View style={{ flexDirection: 'row', gap: 6, marginBottom: 24 }}>
      {[
        ['#F7F7FA','50'],['#EDEDF0','100'],['#C8C8CC','300'],
        ['#9B9BA0','500'],['#6B6B72','600'],['#3B3B44','700'],['#1F1F26','800'],['#0A0A0F','900'],
      ].map(([hex, n]) => (
        <View key={n} style={{ flex: 1 }}>
          <View style={{ height: 32, backgroundColor: hex, borderRadius: 4, marginBottom: 4, borderWidth: n === '50' ? 1 : 0, borderColor: C.black05 }} />
          <Text style={{ fontFamily: 'Outfit', fontWeight: 500, fontSize: 7, color: C.black60, textAlign: 'center' }}>{n}</Text>
          <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 6.5, color: C.black20, textAlign: 'center' }}>{hex}</Text>
        </View>
      ))}
    </View>

    {/* Contrast table */}
    <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 8, color: C.black40, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Contrast Ratios (WCAG 2.2)</Text>
    <View style={{ borderRadius: 8, borderWidth: 1, borderColor: C.black05, overflow: 'hidden' }}>
      {[
        ['Crimson on White','#E63950 / #FFF','3.8:1','AA Large ✓'],
        ['White on Crimson','#FFF / #E63950','3.8:1','AA Large ✓'],
        ['Black on White','#0A0A0F / #FFF','20.7:1','AAA ✓'],
        ['White on Black','#FFF / #0A0A0F','20.7:1','AAA ✓'],
        ['Black on Crimson 10','#0A0A0F / #FBE8EB','18.4:1','AAA ✓'],
      ].map(([pair, vals, ratio, level], i) => (
        <View key={i} style={{ flexDirection: 'row', padding: 9, backgroundColor: i % 2 === 0 ? C.offwhite : C.white }}>
          <Text style={{ flex: 2, fontFamily: 'Outfit', fontWeight: 500, fontSize: 8.5, color: C.black }}>{pair}</Text>
          <Text style={{ flex: 2, fontFamily: 'Outfit', fontWeight: 400, fontSize: 8.5, color: C.black60 }}>{vals}</Text>
          <Text style={{ flex: 1, fontFamily: 'Outfit', fontWeight: 600, fontSize: 8.5, color: C.black40 }}>{ratio}</Text>
          <Text style={{ flex: 1.5, fontFamily: 'Outfit', fontWeight: 600, fontSize: 8.5, color: C.crimson }}>{level}</Text>
        </View>
      ))}
    </View>

    <PageFooter pageNum="04" />
  </PageChrome>
);

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 5 — TYPOGRAPHY
// ─────────────────────────────────────────────────────────────────────────────
const TypoPage = () => (
  <PageChrome>
    <SectionLabel>Typography System</SectionLabel>
    <PageTitle>Type Scale</PageTitle>

    {/* Syne specimen */}
    <View style={{ marginBottom: 24 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, alignItems: 'flex-end' }}>
        <View>
          <Text style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 11, color: C.crimson, letterSpacing: 2 }}>SYNE EXTRABOLD 800</Text>
          <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 8.5, color: C.black40, marginTop: 2 }}>Display / Headline font · Google Fonts</Text>
        </View>
        <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 8, color: C.black20 }}>Use for all headings</Text>
      </View>
      <View style={{ backgroundColor: C.black, borderRadius: 10, padding: 28 }}>
        <Text style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 42, color: C.white, letterSpacing: -1.5, lineHeight: 1.05, marginBottom: 8 }}>Software{'\n'}
          <Text style={{ color: C.crimson }}>That Builds.</Text>
        </Text>
        <Text style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 18, color: 'rgba(255,255,255,0.5)', letterSpacing: -0.3 }}>
          Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm
        </Text>
      </View>
    </View>

    {/* Outfit specimen */}
    <View style={{ marginBottom: 24 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, alignItems: 'flex-end' }}>
        <View>
          <Text style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 11, color: C.crimson, letterSpacing: 2 }}>OUTFIT 400 / 500 / 600</Text>
          <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 8.5, color: C.black40, marginTop: 2 }}>Body / UI font · Google Fonts</Text>
        </View>
        <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 8, color: C.black20 }}>Use for all body text</Text>
      </View>
      <View style={{ backgroundColor: C.offwhite, borderRadius: 10, padding: 24, borderWidth: 1, borderColor: C.black05 }}>
        <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 15, color: C.black, marginBottom: 6 }}>SemiBold 600 — UI Labels & Buttons</Text>
        <Text style={{ fontFamily: 'Outfit', fontWeight: 500, fontSize: 13, color: C.black60, marginBottom: 6 }}>Medium 500 — Subheadings & Captions</Text>
        <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 11, color: C.black60, lineHeight: 1.7 }}>
          Regular 400 — Body text. ZeeActs builds complaint management systems, HVAC field service software, custom ERP, and AI-powered automation for Pakistani businesses. Deployed in weeks.
        </Text>
      </View>
    </View>

    {/* Type scale table */}
    <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 8, color: C.black40, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Type Scale</Text>
    <View style={{ borderRadius: 8, borderWidth: 1, borderColor: C.black05, overflow: 'hidden' }}>
      {[
        ['Hero / H1',    '56–72px / 3.5–4.5rem', 'Syne 800', '-2px', '1.03'],
        ['Section / H2', '36–52px / 2.25–3.25rem','Syne 800', '-1.5px','1.07'],
        ['Card / H3',    '20–28px / 1.25–1.75rem','Syne 700', '-0.5px','1.15'],
        ['UI Label',     '14–16px / 0.875–1rem',  'Outfit 600','0',   '1.25'],
        ['Body',         '14–16px / 0.875–1rem',  'Outfit 400','0',   '1.7'],
        ['Caption',      '10–12px / 0.625–0.75rem','Outfit 500','1px', '1.5'],
        ['Mono tag',     '10px / 0.625rem',        'Outfit 600','4px', '1'],
      ].map(([role, size, font, ls, lh], i) => (
        <View key={i} style={{ flexDirection: 'row', padding: 8, backgroundColor: i % 2 === 0 ? C.offwhite : C.white }}>
          <Text style={{ flex: 1.5, fontFamily: 'Outfit', fontWeight: 600, fontSize: 8.5, color: C.black }}>{role}</Text>
          <Text style={{ flex: 2, fontFamily: 'Outfit', fontWeight: 400, fontSize: 8.5, color: C.black60 }}>{size}</Text>
          <Text style={{ flex: 1.5, fontFamily: 'Outfit', fontWeight: 400, fontSize: 8.5, color: C.black60 }}>{font}</Text>
          <Text style={{ flex: 0.8, fontFamily: 'Outfit', fontWeight: 400, fontSize: 8.5, color: C.black40 }}>{ls}</Text>
          <Text style={{ flex: 0.5, fontFamily: 'Outfit', fontWeight: 400, fontSize: 8.5, color: C.black40 }}>{lh}</Text>
        </View>
      ))}
    </View>

    <PageFooter pageNum="05" />
  </PageChrome>
);

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 6 — VOICE & TONE
// ─────────────────────────────────────────────────────────────────────────────
const VoicePage = () => (
  <PageChrome>
    <SectionLabel>Brand Voice</SectionLabel>
    <PageTitle>Voice & Tone</PageTitle>
    <BodyText style={{ marginBottom: 28 }}>ZeeActs speaks like a trusted technical expert — confident without arrogance, precise without being cold. We are direct, human, and results-focused.</BodyText>

    <View style={{ flexDirection: 'row', gap: 16, marginBottom: 28 }}>
      {[
        { trait: 'Confident', desc: `We state facts, not opinions. We don't hedge with "maybe" or "could potentially".` },
        { trait: 'Direct',    desc: 'Short sentences. Active voice. No corporate jargon. If it takes more than 10 words, cut it.' },
        { trait: 'Expert',    desc: 'We know our industry. We speak with domain authority — HVAC, ERP, AI, and field service.' },
        { trait: 'Human',     desc: 'We talk like a smart friend who happens to be a software engineer — relatable, not robotic.' },
      ].map(({ trait, desc }) => (
        <View key={trait} style={{ flex: 1, borderLeftWidth: 2, borderLeftColor: C.crimson, paddingLeft: 12 }}>
          <Text style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 10, color: C.black, marginBottom: 5 }}>{trait}</Text>
          <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 8.5, color: C.black60, lineHeight: 1.65 }}>{desc}</Text>
        </View>
      ))}
    </View>

    <Divider />

    <Text style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 14, color: C.black, marginBottom: 14 }}>Headline Formulas</Text>
    <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
      {[
        { label: 'Problem → Solution', ex: '"Stop Losing Jobs to WhatsApp Chaos"' },
        { label: 'Outcome-first',       ex: '"60% Fewer Callbacks. Starting Day One."' },
        { label: 'Identity statement',  ex: '"Built for Pakistani HVAC. By people who know HVAC."' },
      ].map(({ label, ex }) => (
        <View key={label} style={{ flex: 1, backgroundColor: C.black, borderRadius: 8, padding: 16 }}>
          <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 7.5, color: C.crimson, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>{label}</Text>
          <Text style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 11, color: C.white, lineHeight: 1.4 }}>{ex}</Text>
        </View>
      ))}
    </View>

    {/* Do / Don't */}
    <Text style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 14, color: C.black, marginBottom: 12 }}>Do / Don't</Text>
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <View style={{ flex: 1 }}>
        {[
          ['✓','Use active voice: "We deploy in 2 weeks"'],
          ['✓','Name the customer problem directly'],
          ['✓','Use industry-specific language (HVAC, ERP)'],
          ['✓','Be specific: "127 projects shipped" not "many"'],
        ].map(([ico, txt]) => (
          <View key={txt} style={{ flexDirection: 'row', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
            <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: C.crimson, alignItems: 'center', justifyContent: 'center', marginTop: 0.5 }}>
              <Text style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 8, color: C.white }}>{ico}</Text>
            </View>
            <Text style={{ flex: 1, fontFamily: 'Outfit', fontWeight: 400, fontSize: 9, color: C.black60, lineHeight: 1.6 }}>{txt}</Text>
          </View>
        ))}
      </View>
      <View style={{ flex: 1 }}>
        {[
          ['✗','Passive voice: "Solutions are delivered by us"'],
          ['✗','Hedging: "We might be able to help you with..."'],
          ['✗','Generic claims: "Best-in-class solution"'],
          ['✗','Buzzwords without substance: "Synergize", "leverage"'],
        ].map(([ico, txt]) => (
          <View key={txt} style={{ flexDirection: 'row', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
            <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: C.black05, alignItems: 'center', justifyContent: 'center', marginTop: 0.5 }}>
              <Text style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 8, color: C.black40 }}>{ico}</Text>
            </View>
            <Text style={{ flex: 1, fontFamily: 'Outfit', fontWeight: 400, fontSize: 9, color: C.black60, lineHeight: 1.6 }}>{txt}</Text>
          </View>
        ))}
      </View>
    </View>

    <PageFooter pageNum="06" />
  </PageChrome>
);

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 7 — BUSINESS CARD
// ─────────────────────────────────────────────────────────────────────────────
const BusinessCardPage = () => {
  const cardW = 240, cardH = 136; // 85mm × 48mm proportional in points

  const CardFront = () => (
    <View style={{ width: cardW, height: cardH, backgroundColor: C.black, borderRadius: 8, padding: 18, justifyContent: 'space-between' }}>
      <ZeeActsLogo variant="dark" scale={0.72} />
      <View>
        <Text style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 11, color: C.white, marginBottom: 2 }}>Muhammad Z. Founder</Text>
        <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 8, color: 'rgba(255,255,255,0.5)' }}>CEO · ZeeActs Technologies</Text>
        <View style={{ width: 30, height: 1.5, backgroundColor: C.crimson, marginTop: 8 }} />
      </View>
      {/* Crimson corner accent */}
      <Svg style={{ position: 'absolute', bottom: 0, right: 0, width: cardW, height: cardH }}>
        <Polygon points={`${cardW * 0.65},${cardH} ${cardW},${cardH} ${cardW},${cardH * 0.45}`} fill={C.crimson} opacity={0.15} />
      </Svg>
    </View>
  );

  const CardBack = () => (
    <View style={{ width: cardW, height: cardH, backgroundColor: C.crimson, borderRadius: 8, padding: 18, justifyContent: 'space-between' }}>
      {/* Three velocity arrows (large, decorative) */}
      <View style={{ position: 'absolute', top: 20, right: 18, flexDirection: 'column', gap: 5 }}>
        {[{ w: 50, op: 0.25 }, { w: 36, op: 0.18 }, { w: 22, op: 0.12 }].map(({ w, op }, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', opacity: op }}>
            <View style={{ width: w, height: 3, backgroundColor: C.white }} />
            <Svg width={8} height={9}><Polygon points="0,0 8,4.5 0,9" fill={C.white} /></Svg>
          </View>
        ))}
      </View>
      <View>
        <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 8, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>zeeacts.com</Text>
        <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 8, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>info@zeeacts.com</Text>
        <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 8, color: 'rgba(255,255,255,0.6)' }}>+92 300 000 0000</Text>
      </View>
      <Text style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 10, color: 'rgba(255,255,255,0.9)', letterSpacing: -0.3 }}>
        Software That Builds.{'\n'}AI That Scales.
      </Text>
    </View>
  );

  return (
    <PageChrome>
      <SectionLabel>Stationery</SectionLabel>
      <PageTitle>Business Card</PageTitle>
      <BodyText style={{ marginBottom: 28 }}>Standard format: 85 × 48 mm. Front: black background with logo and name. Back: crimson with contact details and tagline. Print on 400gsm silk with spot UV on the logo.</BodyText>

      <View style={{ flexDirection: 'row', gap: 24, justifyContent: 'center', marginBottom: 28 }}>
        <View style={{ alignItems: 'center', gap: 8 }}>
          <CardFront />
          <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 7.5, color: C.black40, letterSpacing: 1.5, textTransform: 'uppercase' }}>Front</Text>
        </View>
        <View style={{ alignItems: 'center', gap: 8 }}>
          <CardBack />
          <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 7.5, color: C.black40, letterSpacing: 1.5, textTransform: 'uppercase' }}>Back</Text>
        </View>
      </View>

      {/* Specs */}
      <Divider />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {[
          { label: 'Size', value: '85 × 48 mm (standard)' },
          { label: 'Stock', value: '400gsm Silk Coated' },
          { label: 'Finish', value: 'Spot UV on Z-box + Logo' },
          { label: 'Bleed', value: '3mm all sides' },
        ].map(({ label, value }) => (
          <View key={label} style={{ flex: 1, backgroundColor: C.offwhite, borderRadius: 6, padding: 12 }}>
            <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 7.5, color: C.black40, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{label}</Text>
            <Text style={{ fontFamily: 'Outfit', fontWeight: 500, fontSize: 9, color: C.black }}>{value}</Text>
          </View>
        ))}
      </View>

      <PageFooter pageNum="07" />
    </PageChrome>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 8 — LETTERHEAD
// ─────────────────────────────────────────────────────────────────────────────
const LetterheadPage = () => (
  <Page size="A4" style={{ backgroundColor: C.white, fontFamily: 'Outfit', fontWeight: 400 }}>
    {/* Header bar */}
    <View style={{ backgroundColor: C.black, paddingHorizontal: M, paddingVertical: 22, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <ZeeActsLogo variant="dark" scale={1} />
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 8, color: 'rgba(255,255,255,0.5)' }}>zeeacts.com · info@zeeacts.com</Text>
        <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 8, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>Lahore, Pakistan</Text>
      </View>
    </View>
    {/* Crimson rule */}
    <View style={{ height: 3, backgroundColor: C.crimson }} />

    {/* Body */}
    <View style={{ flex: 1, padding: M, paddingTop: 36 }}>
      {/* Date */}
      <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 9.5, color: C.black40, marginBottom: 24 }}>6 April 2025</Text>

      {/* Recipient */}
      <Text style={{ fontFamily: 'Outfit', fontWeight: 500, fontSize: 10, color: C.black, marginBottom: 4 }}>Client Name</Text>
      <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 10, color: C.black60, marginBottom: 24 }}>Company Name · City, Pakistan</Text>

      {/* Subject */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 10, color: C.black }}>Subject:</Text>
        <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 10, color: C.black60 }}>Proposal for Field Service Management Platform</Text>
      </View>

      {/* Body text placeholder */}
      {['Dear [Name],', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.', 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'].map((para, i) => (
        <Text key={i} style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 10, color: C.black60, lineHeight: 1.8, marginBottom: 14 }}>{para}</Text>
      ))}

      {/* Signature */}
      <View style={{ marginTop: 36 }}>
        <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 10, color: C.black60, marginBottom: 32 }}>Warm regards,</Text>
        <View style={{ width: 80, height: 1, backgroundColor: C.black20, marginBottom: 6 }} />
        <Text style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 11, color: C.black }}>Muhammad Zeeshan</Text>
        <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 9.5, color: C.black40 }}>CEO, ZeeActs Technologies</Text>
      </View>
    </View>

    {/* Footer */}
    <View style={{ height: 36, backgroundColor: C.black05, paddingHorizontal: M, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 7.5, color: C.black40 }}>ZeeActs Technologies · Lahore, Pakistan</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{ width: 12, height: 1.5, backgroundColor: C.crimson }} />
        <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 7.5, color: C.crimson }}>zeeacts.com</Text>
      </View>
    </View>
  </Page>
);

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 9 — SOCIAL POST 4:5 (1080×1350)
// ─────────────────────────────────────────────────────────────────────────────
const SocialPostPage = () => {
  // 4:5 ratio preview scaled to fit A4 content area
  const postW = 240;
  const postH = postW * (5 / 4); // = 300

  const PostTemplate1 = ({ bg, headColor, tagColor, textColor }) => (
    <View style={{ width: postW, height: postH, backgroundColor: bg, borderRadius: 8, padding: 24, justifyContent: 'space-between' }}>
      {/* Logo */}
      <ZeeActsLogo variant={bg === C.black ? 'dark' : 'light'} scale={0.62} />
      {/* Content */}
      <View>
        <View style={{ paddingHorizontal: 8, paddingVertical: 4, backgroundColor: tagColor, borderRadius: 3, alignSelf: 'flex-start', marginBottom: 12 }}>
          <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 7, color: bg === C.crimson ? C.white : C.crimson, letterSpacing: 2, textTransform: 'uppercase' }}>HVAC · FIELD SERVICE</Text>
        </View>
        <Text style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 22, color: headColor, letterSpacing: -0.8, lineHeight: 1.1, marginBottom: 12 }}>
          Stop Losing{'\n'}Jobs to{'\n'}WhatsApp Chaos.
        </Text>
        <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 9, color: textColor, lineHeight: 1.65 }}>
          AeroSoft OS tracks every complaint, dispatches your best technician, and sends WhatsApp updates — automatically.
        </Text>
      </View>
      {/* CTA */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ backgroundColor: C.crimson, borderRadius: 5, paddingHorizontal: 14, paddingVertical: 7 }}>
          <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 8.5, color: C.white }}>Book a Free Demo →</Text>
        </View>
        <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 7.5, color: textColor }}>zeeacts.com</Text>
      </View>
    </View>
  );

  const PostTemplate2 = () => (
    <View style={{ width: postW, height: postH, backgroundColor: C.crimson, borderRadius: 8, padding: 24, justifyContent: 'space-between' }}>
      <ZeeActsLogo variant="dark" scale={0.62} />
      {/* Big stat */}
      <View>
        <Text style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 64, color: C.white, letterSpacing: -3, lineHeight: 1 }}>60%</Text>
        <View style={{ width: 36, height: 2.5, backgroundColor: 'rgba(255,255,255,0.4)', marginVertical: 10 }} />
        <Text style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: C.white, lineHeight: 1.3 }}>Fewer customer{'\n'}callbacks after switching{'\n'}to AeroSoft OS.</Text>
        <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 8.5, color: 'rgba(255,255,255,0.65)', marginTop: 10, lineHeight: 1.6 }}>
          Based on avg. across 50+ HVAC clients.
        </Text>
      </View>
      <Text style={{ fontFamily: 'Outfit', fontWeight: 500, fontSize: 8, color: 'rgba(255,255,255,0.6)' }}>@zeeacts · zeeacts.com</Text>
    </View>
  );

  const PostTemplate3 = () => (
    <View style={{ width: postW, height: postH, backgroundColor: C.offwhite, borderRadius: 8, padding: 24, justifyContent: 'space-between', borderWidth: 1, borderColor: C.black05 }}>
      <ZeeActsLogo variant="light" scale={0.62} />
      <View>
        <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 7.5, color: C.black40, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>WHY ZEEACTS</Text>
        {['Deployed in weeks, not months', 'Built for Pakistani business needs', 'AI automation included — no extra cost', 'WhatsApp + web integration out of box'].map((point, i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 8, marginBottom: 9, alignItems: 'flex-start' }}>
            <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: C.crimson, alignItems: 'center', justifyContent: 'center', marginTop: 0.5 }}>
              <Text style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 7, color: C.white }}>✓</Text>
            </View>
            <Text style={{ flex: 1, fontFamily: 'Outfit', fontWeight: 500, fontSize: 9, color: C.black, lineHeight: 1.55 }}>{point}</Text>
          </View>
        ))}
      </View>
      <View style={{ borderTopWidth: 1, borderTopColor: C.black10, paddingTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 10, color: C.black }}>Software That Builds.</Text>
        <View style={{ backgroundColor: C.crimson, borderRadius: 4, paddingHorizontal: 10, paddingVertical: 5 }}>
          <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 7.5, color: C.white }}>Learn more →</Text>
        </View>
      </View>
    </View>
  );

  return (
    <PageChrome>
      <SectionLabel>Social Media</SectionLabel>
      <PageTitle>Social Posts  —  4:5 (1080 × 1350 px)</PageTitle>
      <BodyText style={{ marginBottom: 20 }}>Three production-ready post templates. Export each at 1080 × 1350 px for Instagram, Facebook, and LinkedIn feed. Maintain 60px safe zone on all sides.</BodyText>

      <View style={{ flexDirection: 'row', gap: 14, justifyContent: 'center' }}>
        <View style={{ alignItems: 'center', gap: 7 }}>
          <PostTemplate1 bg={C.black} headColor={C.white} tagColor="rgba(230,57,80,0.15)" textColor="rgba(255,255,255,0.55)" />
          <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 7.5, color: C.black40, letterSpacing: 1, textTransform: 'uppercase' }}>Pain Point</Text>
        </View>
        <View style={{ alignItems: 'center', gap: 7 }}>
          <PostTemplate2 />
          <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 7.5, color: C.black40, letterSpacing: 1, textTransform: 'uppercase' }}>Stat / Proof</Text>
        </View>
        <View style={{ alignItems: 'center', gap: 7 }}>
          <PostTemplate3 />
          <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 7.5, color: C.black40, letterSpacing: 1, textTransform: 'uppercase' }}>Value Prop</Text>
        </View>
      </View>

      <PageFooter pageNum="09" />
    </PageChrome>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 10 — AD CREATIVES 4:5
// ─────────────────────────────────────────────────────────────────────────────
const AdsPage = () => {
  const adW = 240;
  const adH = adW * (5 / 4);

  const Ad1 = () => (
    <View style={{ width: adW, height: adH, backgroundColor: C.black, borderRadius: 8, overflow: 'hidden' }}>
      {/* Red slash accent */}
      <Svg style={{ position: 'absolute', top: 0, left: 0, width: adW, height: adH }}>
        <Polygon points={`0,${adH * 0.45} ${adW * 0.7},0 ${adW},0 ${adW},0.01`} fill={C.crimson} opacity={0.08} />
      </Svg>
      <View style={{ flex: 1, padding: 22, justifyContent: 'space-between' }}>
        <ZeeActsLogo variant="dark" scale={0.62} />
        <View>
          <View style={{ backgroundColor: 'rgba(230,57,80,0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 3, alignSelf: 'flex-start', marginBottom: 12, borderLeftWidth: 2, borderLeftColor: C.crimson }}>
            <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 7, color: C.crimson, letterSpacing: 2, textTransform: 'uppercase' }}>HVAC SOFTWARE · META AD</Text>
          </View>
          <Text style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 24, color: C.white, letterSpacing: -1, lineHeight: 1.08, marginBottom: 14 }}>
            Your competitors{'\n'}are already using{'\n'}
            <Text style={{ color: C.crimson }}>AeroSoft OS.</Text>
          </Text>
          <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 9, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, marginBottom: 20 }}>
            Manage complaints, dispatch techs, and track every job from one dashboard. WhatsApp updates included.
          </Text>
          <View style={{ backgroundColor: C.crimson, borderRadius: 6, paddingVertical: 10, alignItems: 'center' }}>
            <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 10, color: C.white }}>Get a Free Demo Today →</Text>
          </View>
        </View>
        <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 7.5, color: 'rgba(255,255,255,0.3)' }}>zeeacts.com/solutions/hvac</Text>
      </View>
    </View>
  );

  const Ad2 = () => (
    <View style={{ width: adW, height: adH, backgroundColor: C.crimson, borderRadius: 8, padding: 22, justifyContent: 'space-between' }}>
      {/* Decorative grid */}
      <Svg style={{ position: 'absolute', top: 0, left: 0, width: adW, height: adH }}>
        {Array.from({ length: 6 }).map((_, r) =>
          Array.from({ length: 5 }).map((_, c) => (
            <Rect key={`${r}-${c}`} x={c * 50 + 12} y={r * 50 + 80} width={3} height={3} rx={1.5} fill="white" opacity={0.1} />
          ))
        )}
      </Svg>
      <ZeeActsLogo variant="dark" scale={0.62} />
      <View>
        <Text style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 48, color: C.white, letterSpacing: -2, lineHeight: 1, marginBottom: 4 }}>3×</Text>
        <Text style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 18, color: C.white, letterSpacing: -0.5, lineHeight: 1.2, marginBottom: 12 }}>
          Faster job dispatch.{'\n'}Same team. Same day.
        </Text>
        <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 9, color: 'rgba(255,255,255,0.75)', lineHeight: 1.65, marginBottom: 20 }}>
          Stop the phone tag. Auto-dispatch your nearest available technician in seconds.
        </Text>
        <View style={{ backgroundColor: C.black, borderRadius: 6, paddingVertical: 10, alignItems: 'center' }}>
          <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 10, color: C.white }}>Book Demo — It's Free →</Text>
        </View>
      </View>
      <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 7.5, color: 'rgba(255,255,255,0.5)' }}>@zeeacts · zeeacts.com</Text>
    </View>
  );

  const Ad3 = () => (
    <View style={{ width: adW, height: adH, backgroundColor: C.white, borderRadius: 8, padding: 22, justifyContent: 'space-between', borderWidth: 1, borderColor: C.black05 }}>
      <ZeeActsLogo variant="light" scale={0.62} />
      <View>
        <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 7.5, color: C.black40, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>BUILT FOR HVAC COMPANIES</Text>
        <Text style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20, color: C.black, letterSpacing: -0.8, lineHeight: 1.1, marginBottom: 14 }}>
          From complaint{'\n'}to
          <Text style={{ color: C.crimson }}> resolved</Text>{'\n'}in 2 taps.
        </Text>
        {['No more WhatsApp chaos', 'Real-time technician tracking', 'Automated customer updates', 'Rs 0 setup cost'].map((feat, i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 7, marginBottom: 7 }}>
            <Text style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 9, color: C.crimson }}>→</Text>
            <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 9, color: C.black60 }}>{feat}</Text>
          </View>
        ))}
        <View style={{ marginTop: 14, backgroundColor: C.crimson, borderRadius: 6, paddingVertical: 10, alignItems: 'center' }}>
          <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 10, color: C.white }}>See It in Action →</Text>
        </View>
      </View>
      <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 7.5, color: C.black40 }}>zeeacts.com/solutions/hvac</Text>
    </View>
  );

  return (
    <PageChrome>
      <SectionLabel>Advertising</SectionLabel>
      <PageTitle>Ad Creatives  —  4:5 (1080 × 1350 px)</PageTitle>
      <BodyText style={{ marginBottom: 20 }}>Three ad angles: Identity (Fear of Missing Out), Outcome (3× faster), and Feature-proof (specific benefits). Use on Meta, LinkedIn, and Google Display. Always A/B test the headline.</BodyText>

      <View style={{ flexDirection: 'row', gap: 14, justifyContent: 'center' }}>
        <View style={{ alignItems: 'center', gap: 7 }}>
          <Ad1 />
          <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 7.5, color: C.black40, letterSpacing: 1, textTransform: 'uppercase' }}>FOMO / Identity</Text>
        </View>
        <View style={{ alignItems: 'center', gap: 7 }}>
          <Ad2 />
          <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 7.5, color: C.black40, letterSpacing: 1, textTransform: 'uppercase' }}>Outcome / Stat</Text>
        </View>
        <View style={{ alignItems: 'center', gap: 7 }}>
          <Ad3 />
          <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 7.5, color: C.black40, letterSpacing: 1, textTransform: 'uppercase' }}>Feature Proof</Text>
        </View>
      </View>

      <PageFooter pageNum="10" />
    </PageChrome>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 11 — LINKEDIN COVER (1584 × 396 px = 4:1 ratio)
// ─────────────────────────────────────────────────────────────────────────────
const LinkedInPage = () => {
  const coverW = 467;
  const coverH = coverW / 4; // 116.75

  return (
    <PageChrome>
      <SectionLabel>LinkedIn</SectionLabel>
      <PageTitle>LinkedIn Cover  —  1584 × 396 px</PageTitle>
      <BodyText style={{ marginBottom: 28 }}>Company page banner. Design uses the full brand palette with the logo left-anchored and the tagline right-anchored. Exports at 1584 × 396 px.</BodyText>

      {/* Cover mockup */}
      <View style={{ marginBottom: 28, borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: C.black10 }}>
        {/* Fake LinkedIn UI chrome */}
        <View style={{ height: 22, backgroundColor: '#0A66C2', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
          <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 8, color: C.white }}>linkedin.com/company/zeeacts</Text>
        </View>
        {/* Cover image */}
        <View style={{ width: coverW + 2, height: coverH, backgroundColor: C.black, position: 'relative', overflow: 'hidden' }}>
          {/* Diagonal crimson accent */}
          <Svg style={{ position: 'absolute', top: 0, left: 0, width: coverW, height: coverH }}>
            <Polygon points={`0,0 ${coverW * 0.3},0 0,${coverH}`} fill={C.crimson} opacity={0.9} />
            <Polygon points={`${coverW},0 ${coverW},${coverH} ${coverW * 0.55},${coverH}`} fill={C.crimson} opacity={0.06} />
          </Svg>
          {/* Content */}
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 28, justifyContent: 'space-between' }}>
            <ZeeActsLogo variant="dark" scale={0.8} />
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 15, color: C.white, letterSpacing: -0.4, lineHeight: 1.15, textAlign: 'right' }}>
                Software That Builds.{'\n'}
                <Text style={{ color: C.crimson }}>AI That Scales.</Text>
              </Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
                {['Custom Software', 'AI Automation', 'Field Service'].map(tag => (
                  <View key={tag} style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, paddingHorizontal: 6, paddingVertical: 2 }}>
                    <Text style={{ fontFamily: 'Outfit', fontWeight: 500, fontSize: 6.5, color: 'rgba(255,255,255,0.7)' }}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
        {/* Fake profile area */}
        <View style={{ height: 30, backgroundColor: C.white, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 10, borderTopWidth: 1, borderTopColor: C.black05 }}>
          <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: C.black, justifyContent: 'center', alignItems: 'center', marginTop: -14, borderWidth: 2, borderColor: C.white }}>
            <Text style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 10, color: C.white }}>Z</Text>
          </View>
          <View>
            <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 8, color: C.black }}>ZeeActs Technologies</Text>
            <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 7, color: C.black40 }}>IT Solutions Company · Lahore, Pakistan</Text>
          </View>
        </View>
      </View>

      {/* Specs */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {[
          { label: 'Dimensions', value: '1584 × 396 px' },
          { label: 'Aspect Ratio', value: '4:1' },
          { label: 'Safe Zone', value: 'Logo: left 160px\nText: right 320px' },
          { label: 'Format', value: 'PNG at 72 DPI\nUnder 8MB' },
        ].map(({ label, value }) => (
          <View key={label} style={{ flex: 1, backgroundColor: C.offwhite, borderRadius: 6, padding: 12 }}>
            <Text style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 7.5, color: C.black40, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{label}</Text>
            <Text style={{ fontFamily: 'Outfit', fontWeight: 500, fontSize: 9, color: C.black, lineHeight: 1.6 }}>{value}</Text>
          </View>
        ))}
      </View>

      <PageFooter pageNum="11" />
    </PageChrome>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 12 — EMAIL SIGNATURE + BRAND RULES
// ─────────────────────────────────────────────────────────────────────────────
const BrandRulesPage = () => (
  <PageChrome>
    <SectionLabel>Usage Rules</SectionLabel>
    <PageTitle>Brand Do's & Don'ts</PageTitle>

    <View style={{ flexDirection: 'row', gap: 16, marginBottom: 24 }}>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: '#22c55e', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 9, color: C.white }}>✓</Text>
          </View>
          <Text style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 12, color: C.black }}>Do</Text>
        </View>
        {[
          'Use the logo on black, white, or crimson backgrounds only',
          'Keep minimum 36px clear space around the logo',
          'Use Syne ExtraBold (800) for all display headlines',
          'Use Outfit Regular/Medium for all body and UI text',
          'Use #E63950 Crimson as the primary action colour',
          'Maintain the exact logo proportions — never stretch or squash',
          'Use the velocity arrows motif as a supporting graphic element',
        ].map((rule, i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 7, marginBottom: 7, alignItems: 'flex-start' }}>
            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#22c55e', marginTop: 4 }} />
            <Text style={{ flex: 1, fontFamily: 'Outfit', fontWeight: 400, fontSize: 9, color: C.black60, lineHeight: 1.6 }}>{rule}</Text>
          </View>
        ))}
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: C.crimson, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 9, color: C.white }}>✗</Text>
          </View>
          <Text style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 12, color: C.black }}>Don't</Text>
        </View>
        {[
          'Rearrange or separate logo elements (Z-box, arrows, wordmark)',
          'Use the logo on any background colour other than black, white, or crimson',
          'Apply transparency or drop shadows to the logo',
          'Use any font other than Syne (headlines) and Outfit (body)',
          'Alter the crimson or black brand colours — even slightly',
          'Use the logo at below 80px width on screen or 22mm in print',
          'Substitute "ZeeActs" with abbreviations like "ZA" in formal materials',
        ].map((rule, i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 7, marginBottom: 7, alignItems: 'flex-start' }}>
            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: C.crimson, marginTop: 4 }} />
            <Text style={{ flex: 1, fontFamily: 'Outfit', fontWeight: 400, fontSize: 9, color: C.black60, lineHeight: 1.6 }}>{rule}</Text>
          </View>
        ))}
      </View>
    </View>

    <Divider />

    {/* Email signature preview */}
    <Text style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 14, color: C.black, marginBottom: 14 }}>Email Signature</Text>
    <View style={{ borderRadius: 8, borderWidth: 1, borderColor: C.black10, overflow: 'hidden' }}>
      <View style={{ backgroundColor: C.offwhite, padding: 20, flexDirection: 'row', gap: 16, alignItems: 'center' }}>
        <View style={{ width: 3, backgroundColor: C.crimson, alignSelf: 'stretch', borderRadius: 2 }} />
        <View>
          <Text style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 13, color: C.black }}>Muhammad Zeeshan</Text>
          <Text style={{ fontFamily: 'Outfit', fontWeight: 500, fontSize: 9.5, color: C.black60, marginBottom: 8 }}>CEO · ZeeActs Technologies</Text>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 8.5, color: C.black40 }}>📧 info@zeeacts.com</Text>
            <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 8.5, color: C.black40 }}>🌐 zeeacts.com</Text>
            <Text style={{ fontFamily: 'Outfit', fontWeight: 400, fontSize: 8.5, color: C.black40 }}>📱 +92 300 000 0000</Text>
          </View>
        </View>
        <View style={{ marginLeft: 'auto' }}>
          <ZeeActsLogo variant="light" scale={0.65} />
        </View>
      </View>
      <View style={{ backgroundColor: C.crimson, height: 3 }} />
    </View>

    <PageFooter pageNum="12" />
  </PageChrome>
);

// ─────────────────────────────────────────────────────────────────────────────
// MASTER DOCUMENT
// ─────────────────────────────────────────────────────────────────────────────
const BrandGuidelinesDoc = () => (
  <Document title="ZeeActs Brand Guidelines 2025" author="ZeeActs Technologies">
    <CoverPage />
    <PhilosophyPage />
    <LogoPage />
    <ColorPage />
    <TypoPage />
    <VoicePage />
    <BusinessCardPage />
    <LetterheadPage />
    <SocialPostPage />
    <AdsPage />
    <LinkedInPage />
    <BrandRulesPage />
  </Document>
);

// ─────────────────────────────────────────────────────────────────────────────
// GENERATE
// ─────────────────────────────────────────────────────────────────────────────
const outPath = join(process.cwd(), '..', '..', 'exports', 'zeeacts-brand-guidelines.pdf');
console.log('Generating brand guidelines PDF…');
await ReactPDF.renderToFile(<BrandGuidelinesDoc />, outPath);
console.log(`✅  Saved: ${outPath}`);
