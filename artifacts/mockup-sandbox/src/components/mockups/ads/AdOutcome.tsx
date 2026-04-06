export default function AdOutcome() {
  return (
    <div style={{
      width: "100vw", height: "100vh", overflow: "hidden",
      position: "relative", fontFamily: "'Syne', 'Outfit', sans-serif",
      background: "#0A0A0F"
    }}>
      <img
        src="/__mockup/images/ad-outcome.png"
        alt=""
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(10,10,15,0.6) 0%, rgba(10,10,15,0.05) 45%, rgba(10,10,15,0.95) 100%)"
      }} />

      <div style={{
        position: "absolute", top: "4vw", left: "4vw",
        display: "flex", alignItems: "center", gap: "1.5vw"
      }}>
        <div style={{
          width: "7vw", height: "7vw", background: "#E63950",
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: "0.8vw"
        }}>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: "4vw", lineHeight: 1 }}>Z</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4vw" }}>
          <svg width="3vw" height="1.2vw" viewBox="0 0 36 12" fill="none">
            <path d="M0 6L10 0V12L0 6Z" fill="#E63950"/>
            <path d="M13 6L23 0V12L13 6Z" fill="#E63950" opacity="0.6"/>
            <path d="M26 6L36 0V12L26 6Z" fill="#E63950" opacity="0.3"/>
          </svg>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: "3.8vw", letterSpacing: "-0.05em", lineHeight: 1 }}>
            Zee<span style={{ color: "#E63950" }}>Acts</span>
          </span>
        </div>
      </div>

      <div style={{
        position: "absolute", top: "4vw", right: "4vw",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5vw"
      }}>
        {[
          { num: "60%", label: "Fewer Callbacks" },
          { num: "3×", label: "Faster Dispatch" },
          { num: "100%", label: "Job Visibility" },
          { num: "Rs 0", label: "Setup Cost" },
        ].map(s => (
          <div key={s.num} style={{
            background: "rgba(10,10,15,0.75)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(230,57,80,0.25)", borderRadius: "1.5vw",
            padding: "1.5vw 2vw", textAlign: "center"
          }}>
            <div style={{ color: "#E63950", fontWeight: 800, fontSize: "3.8vw", lineHeight: 1 }}>{s.num}</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.6vw", fontFamily: "'Outfit', sans-serif", marginTop: "0.3vw" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{
        position: "absolute", bottom: "5vw", left: "5vw", right: "5vw"
      }}>
        <h1 style={{
          color: "#FFFFFF", fontWeight: 800,
          fontSize: "10.5vw", lineHeight: 0.95, letterSpacing: "-0.045em",
          margin: "0 0 2.5vw 0",
          textShadow: "0 4px 32px rgba(0,0,0,0.6)"
        }}>
          <span style={{ color: "#E63950" }}>60% Fewer</span><br/>
          Customer<br/>Callbacks.
        </h1>

        <p style={{
          color: "rgba(255,255,255,0.7)", fontSize: "2.6vw",
          fontWeight: 400, margin: "0 0 4vw 0", lineHeight: 1.4,
          fontFamily: "'Outfit', sans-serif"
        }}>
          AeroSoft OS — built for Pakistan's HVAC companies.
        </p>

        <div style={{ display: "flex", gap: "2vw", alignItems: "center" }}>
          <div style={{
            background: "#E63950", color: "#fff",
            padding: "1.8vw 4.5vw", borderRadius: "100px",
            fontSize: "2.6vw", fontWeight: 700, letterSpacing: "-0.01em",
            boxShadow: "0 4px 24px rgba(230,57,80,0.45)"
          }}>
            Get Free Demo →
          </div>
          <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "2vw", fontFamily: "'Outfit', sans-serif" }}>
            No credit card required
          </span>
        </div>
      </div>
    </div>
  );
}
