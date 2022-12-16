import React, { memo } from "react";
import { Avatar } from "@mantine/core";

import ICONS_DATA from "../data/icons";

const PackageIcon = memo(({ pack }: { pack: string }) => {
  const initials = pack.replace("@", "").toUpperCase().slice(0, 2);
  const Component = ICONS_DATA[pack];

  return <Avatar> {Component ? <Component size={36} /> : initials} </Avatar>;
});

export default PackageIcon;
