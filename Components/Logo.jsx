import React, { memo } from "react";

const Logo = memo(() => (
  <img
    src="/images/logo.png"
    alt="Fundverse Logo"
    width={56}
    height={56}
    style={{ objectFit: 'contain' }}
    loading="eager"
  />
));

Logo.displayName = "Logo";

export default Logo;
