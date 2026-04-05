export const ZeeActsLogo = ({ light = false, onClick }: { light?: boolean; onClick?: () => void }) => (
  <div className={`logo ${light ? "light" : ""}`} onClick={onClick} style={{ cursor: onClick ? "pointer" : undefined }}>
    <div className="logo-zbox">
      <span>Z</span>
    </div>
    <div className="logo-arrows">
      <div className="logo-arrow"></div>
      <div className="logo-arrow"></div>
      <div className="logo-arrow"></div>
    </div>
    <div className="logo-wordmark">
      <span className="logo-zee">Zee</span>
      <span className="logo-acts">Acts</span>
    </div>
  </div>
);
