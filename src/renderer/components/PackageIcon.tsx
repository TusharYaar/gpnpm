import React, { memo } from "react";
import { Avatar } from "@mantine/core";

import ICONS_DATA from "../data/icons";
import { TiTick } from "react-icons/ti";

type Props = { pack: string; compact?: boolean; onClick?: () => void; isSelected?: boolean };

const PackageIcon = memo(({ pack, compact = false, onClick, isSelected }: Props) => {
  const initials = pack.replace("@", "").toUpperCase().slice(0, 2);
  const Component = ICONS_DATA[pack];

  return (
    <Avatar size={compact ? "sm" : "md"} onClick={onClick} color={isSelected ? "blue" : "gray"}>
      {isSelected ? <TiTick size={compact ? 16 : 34} /> : Component ? <Component size={compact ? 16 : 34} /> : initials}
    </Avatar>
  );
});

export default PackageIcon;
