export default function AdIdentity() {
  return (
    <div style={{
      width: "100vw", height: "100vh", overflow: "hidden",
      position: "relative", fontFamily: "'Syne', 'Outfit', sans-serif",
      background: "#0A0A0F"
    }}>
      <img
        src="/__mockup/images/ad-identity.png"
        alt=""
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(10,10,15,0.7) 0%, rgba(10,10,15,0.1) 50%, rgba(10,10,15,0.96) 100%)"
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
        position: "absolute", top: "50%", left: "5vw", right: "5vw",
        transform: "translateY(-50%)"
      }}>
        <div style={{
          fontFamily: "'Outfit', sans-serif",
          color: "#E63950", fontWeight: 600, fontSize: "2vw",
          letterSpacing: "0.3em", textTransform: "uppercase",
          marginBottom: "2vw"
        }}>
          Introducing AeroSoft OS
        </div>
        <h1 style={{
          color: "#FFFFFF", fontWeight: 800,
          fontSize: "11vw", lineHeight: 0.92, letterSpacing: "-0.05em",
          margin: 0,
          textShadow: "0 4px 40px rgba(0,0,0,0.5)"
        }}>
          Built for<br/>
          <span style={{ color: "#E63950" }}>Pakistan's</span><br/>
          HVAC Cos.
        </h1>
      </div>

      <div style={{
        position: "absolute", bottom: "5vw", left: "5vw", right: "5vw"
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "3vw", gap: "2vw"
        }}>
          <div style={{ display: "flex", gap: "4vw" }}>
            {["Complaints", "Dispatch", "Inventory", "Analytics"].map(f => (
              <div key={f} style={{
                display: "flex", alignItems: "center", gap: "1vw"
              }}>
                <div style={{ width: "1vw", height: "1vw", borderRadius: "50%", background: "#E63950" }} />
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "2vw", fontFamily: "'Outfit', sans-serif" }}>{f}</span>
              </div>
            ))}
          </div>
          <div style={{
            background: "#E63950", color: "#fff",
            padding: "1.6vw 4vw", borderRadius: "100px",
            fontSize: "2.4vw", fontWeight: 700, whiteSpace: "nowrap",
            boxShadow: "0 4px 24px rgba(230,57,80,0.45)", flexShrink: 0
          }}>
            Try for Free →
          </div>
        </div>
      </div>
    </div>
  );
}
