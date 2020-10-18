import { AppBar, createStyles, makeStyles, Toolbar } from "@material-ui/core";
import Login from "../Login";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      background: "#f7f7f7",
      borderBottom: "1px solid #efefef",
      width: "calc(100% - 60px)",
      marginLeft: "60px",
      color: "#000",

      [theme.breakpoints.up("md")]: {
        width: "calc(100% - 260px)",
        marginLeft: "260px",
      },
    },
    userAvatar: {
      marginLeft: "auto",
    },
  })
);

const Header = () => {
  const classes = useStyles();

  return (
    <AppBar className={classes.root} position="static" elevation={0}>
      <Toolbar>
        <div className={classes.userAvatar}>
          <Login />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
