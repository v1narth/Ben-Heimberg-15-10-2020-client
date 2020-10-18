import {
  CardHeader,
  CardContent,
  Divider,
  CardActions,
  Button,
  makeStyles,
  createStyles,
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SnackbarContext } from "~/context/snackbar";
import { RootState } from "~/store";
import { login, logout } from "~/store/slices/user";
import UserSearchField from "../Field/UserSearch";

const useStyles = makeStyles((theme) =>
  createStyles({
    loginForm: {
      display: "flex",
      flexFlow: "column",
      gap: "1em",
    },
    position: {
      marginLeft: "auto",
    },
  })
);

const Login = ({ onLoggedIn = null, onActionChange = null }) => {
  const classes = useStyles();
  const [userName, setUserName] = useState("");
  const [error, setError] = useState(null);

  const { createSnackbar } = useContext(SnackbarContext);

  const {
    user: { user },
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  /**
   * Handles the user login.
   *
   * @param event
   * @param setOpen
   * @return {void}
   */
  const handleLogin = async (event) => {
    event.preventDefault();

    if (!userName) {
      setError("Cannot login without a user name");
      return;
    }

    const response = await dispatch(login(userName));
    if (!response) {
      createSnackbar(`Cannot find user with name ${userName}`, {
        type: "error",
      });
      setError("");
      return;
    }

    setError("");
    setUserName("");

    onLoggedIn && onLoggedIn();
  };

  /**
   * Handles user logout.
   *
   * @return {void}
   */
  const handleLogout = () => {
    dispatch(logout());
    setUserName("");
  };

  return (
    <>
      <CardHeader title={user ? "Switch user" : "Login"} />
      <form onSubmit={handleLogin} className={classes.loginForm}>
        <CardContent>
          <UserSearchField
            value={userName}
            onChange={(e, value) => setUserName(value?.senderId ?? "")}
            inputProps={{
              label: "User",
              error: !!error,
              helperText: error,
            }}
          />
        </CardContent>
        <Divider />
        <CardActions disableSpacing>
          <Button type="submit" color="primary">
            {user ? "Switch" : "Login"}
          </Button>
          {user && (
            <Button onClick={handleLogout} color="secondary">
              Logout
            </Button>
          )}

          <Button
            className={classes.position}
            onClick={() => onActionChange && onActionChange("register")}
            color="secondary"
          >
            Create New
          </Button>
        </CardActions>
      </form>
    </>
  );
};

export default Login;
