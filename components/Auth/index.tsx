import { Avatar, Card, makeStyles, createStyles } from "@material-ui/core";
import { deepPurple } from "@material-ui/core/colors";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "~/store";
import DialogContainer from "../Dialog";
import Login from "./Login";
import Register from "./Register";

const useStyles = makeStyles((theme) =>
  createStyles({
    loginContainer: {
      width: "100%",
    },
    loginButtons: {
      gap: ".5em",
    },
    userSelect__inputRoot: {
      background: "initial",
    },
    userSelect__input: {
      background: "initial",
      boxShadow: "none",
      marginRight: "1em",
    },
    position: {
      marginLeft: "auto",
    },
    userAvatar: {
      color: theme.palette.getContrastText(theme.palette.primary.main),
      background: theme.palette.primary.main,
    },
  })
);

const Auth = () => {
  const classes = useStyles();
  const [action, setAction] = useState<"login" | "register">("login");
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <>
      <DialogContainer
        activator={
          <Avatar className={classes.userAvatar}>
            {user && user.senderId.substring(0, 1)}
          </Avatar>
        }
      >
        {({ setOpen }) => (
          <Card className={classes.loginContainer}>
            {action === "login" ? (
              <Login
                onLoggedIn={() => setOpen(false)}
                onActionChange={(action) => setAction(action)}
              />
            ) : (
              <Register
                onRegistered={() => setAction("login")}
                onActionChange={(action) => setAction(action)}
              />
            )}
          </Card>
        )}
      </DialogContainer>
    </>
  );
};

export default Auth;
