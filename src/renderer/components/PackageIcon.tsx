import React, { memo } from "react";
import { Avatar } from "@mantine/core";

import ICONS_DATA from "../data/icons";

const PackageIcon = memo(({ pack, compact = false }: { pack: string; compact?: boolean }) => {
  const initials = pack.replace("@", "").toUpperCase().slice(0, 2);
  const Component = ICONS_DATA[pack];

  return <Avatar size={compact ? "sm" : "md"}>{Component ? <Component size={compact ? 16 : 34} /> : initials} </Avatar>;
});

export default PackageIcon;
