import { Menu } from "@material-ui/core";
import React, { useState } from "react";

const MenuContainer = ({ activator, children }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <>
      <div
        onClick={(e) => {
          e.stopPropagation();
          setAnchorEl(e.currentTarget);
        }}
      >
        {activator}
      </div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <div onClick={() => setAnchorEl(null)}>{children}</div>
      </Menu>
    </>
  );
};

export default MenuContainer;
