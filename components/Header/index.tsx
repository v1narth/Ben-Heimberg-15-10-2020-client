import {
  AppBar,
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  createStyles,
  makeStyles,
  TextField,
  Toolbar,
} from "@material-ui/core";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "~/store";
import { login, logout } from "~/store/slices/user";
import DialogContainer from "../Dialog";

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
    loginContainer: {
      padding: "1em",
      width: "400px",
    },
    loginForm: {
      display: "flex",
      flexFlow: "column",
      gap: "1em",
    },
  })
);

const Header = () => {
  const classes = useStyles();
  const [id, setId] = useState(null);

  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const handleLogin = (event, setOpen) => {
    event.preventDefault();
    dispatch(login(id));
    setOpen(false);
  };

  const handleLogout = (setOpen) => {
    dispatch(logout());
    setOpen(false);
  };

  return (
    <AppBar className={classes.root} position="static" elevation={0}>
      <Toolbar>
        <div className={classes.userAvatar}>
          <DialogContainer activator={<Avatar>{user && user.senderId}</Avatar>}>
            {({ setOpen }) => (
              <Card className={classes.loginContainer}>
                <CardHeader title="Login" />
                <CardContent>
                  <form
                    onSubmit={(e) => handleLogin(e, setOpen)}
                    className={classes.loginForm}
                  >
                    <TextField
                      variant="filled"
                      label="Login as"
                      placeholder="User id"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      type="number"
                      fullWidth
                      autoFocus
                      onChange={({ target }) => setId(target.value)}
                    />

                    <Button type="submit" color="primary" variant="contained">
                      Login
                    </Button>
                    {user && (
                      <Button
                        onClick={() => handleLogout(setOpen)}
                        color="secondary"
                        variant="text"
                      >
                        Logout
                      </Button>
                    )}
                  </form>
                </CardContent>
              </Card>
            )}
          </DialogContainer>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
