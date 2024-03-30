import React, { memo } from "react";
import { Avatar } from "@mantine/core";

import ICONS_DATA from "../data/icons";
import { TiTick } from "react-icons/ti";

type Props = { pack: string; compact?: boolean; onClick?: () => void; isSelected?: boolean; size?: number };

const PackageIcon = memo(({ pack, compact = false, onClick, isSelected, size }: Props) => {
  const initials = pack.replace("@", "").toUpperCase().slice(0, 2);
  const Component = ICONS_DATA[pack];

  return (
    <Avatar size={size ? size : compact ? 18 : 36} onClick={onClick} color={isSelected ? "blue" : "gray"}>
      {isSelected ? (
        <TiTick size={size ? size : compact ? 16 : 34} />
      ) : Component ? (
        <Component size={size ? size : compact ? 16 : 34} />
      ) : (
        initials
      )}
    </Avatar>
  );
});

export default PackageIcon;
