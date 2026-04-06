export default function AdPain() {
  return (
    <div style={{
      width: "100vw", height: "100vh", overflow: "hidden",
      position: "relative", fontFamily: "'Syne', 'Outfit', sans-serif",
      background: "#0A0A0F"
    }}>
      <img
        src="/__mockup/images/ad-pain.png"
        alt=""
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(10,10,15,0.55) 0%, rgba(10,10,15,0.15) 40%, rgba(10,10,15,0.92) 100%)"
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
        position: "absolute", bottom: "5vw", left: "5vw", right: "5vw"
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "1.5vw",
          background: "rgba(230,57,80,0.18)", border: "1px solid rgba(230,57,80,0.4)",
          borderRadius: "100px", padding: "0.6vw 1.8vw", marginBottom: "2.5vw"
        }}>
          <span style={{ width: "0.8vw", height: "0.8vw", borderRadius: "50%", background: "#E63950", display: "inline-block" }} />
          <span style={{ color: "#E63950", fontSize: "1.6vw", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em" }}>HVAC Field Service</span>
        </div>

        <h1 style={{
          color: "#FFFFFF", fontWeight: 800,
          fontSize: "9.5vw", lineHeight: 1.0, letterSpacing: "-0.04em",
          margin: "0 0 2.5vw 0",
          textShadow: "0 4px 24px rgba(0,0,0,0.5)"
        }}>
          Stop Losing<br/>
          Jobs to<br/>
          <span style={{ color: "#E63950" }}>WhatsApp Chaos</span>
        </h1>

        <p style={{
          color: "rgba(255,255,255,0.75)", fontSize: "2.8vw",
          fontWeight: 400, margin: "0 0 4vw 0", lineHeight: 1.4,
          fontFamily: "'Outfit', sans-serif"
        }}>
          One dashboard. Every complaint. Zero missed jobs.
        </p>

        <div style={{ display: "flex", gap: "2vw", alignItems: "center" }}>
          <div style={{
            background: "#E63950", color: "#fff",
            padding: "1.8vw 4.5vw", borderRadius: "100px",
            fontSize: "2.6vw", fontWeight: 700, letterSpacing: "-0.01em",
            boxShadow: "0 4px 24px rgba(230,57,80,0.4)"
          }}>
            Book Free Demo →
          </div>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "2.2vw", fontFamily: "'Outfit', sans-serif" }}>
            zeeacts.com/solutions/hvac
          </span>
        </div>
      </div>
    </div>
  );
}
