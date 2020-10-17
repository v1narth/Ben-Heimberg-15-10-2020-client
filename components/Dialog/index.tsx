import { createStyles, Dialog, makeStyles } from "@material-ui/core";
import { useState } from "react";

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      padding: "1em",
    },
    activator: {
      cursor: "pointer",
    },
  })
);

const DialogContainer = ({ activator, children }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleActivatorClick = () => {
    setOpen((state) => !state);
  };

  return (
    <>
      <div className={classes.activator} onClick={handleActivatorClick}>
        {activator}
      </div>
      <Dialog open={open} onClose={handleActivatorClick}>
        {children({ setOpen })}
      </Dialog>
    </>
  );
};

export default DialogContainer;
