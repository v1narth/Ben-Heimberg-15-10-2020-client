import {
  Avatar,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  makeStyles,
  createStyles,
  Grid,
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SnackbarContext } from "~/context/snackbar";
import { RootState } from "~/store";
import { login, logout } from "~/store/slices/user";
import DialogContainer from "../Dialog";

const useStyles = makeStyles((theme) =>
  createStyles({
    loginContainer: {
      padding: "1em",
      width: "100%",
    },
    loginForm: {
      display: "flex",
      flexFlow: "column",
      gap: "1em",
    },
    loginButtons: {
      gap: ".5em",
    },
  })
);

const Login = () => {
  const classes = useStyles();
  const [id, setId] = useState("");
  const [error, setError] = useState(null);
  const { createSnackbar } = useContext(SnackbarContext);

  const { user } = useSelector((state: RootState) => state.user);
  const { senderId } = useSelector((state: RootState) => state.messages);
  const dispatch = useDispatch();

  const handleLogin = async (event, setOpen) => {
    event.preventDefault();

    if (!id) {
      setError("Cannot login without a user name");
      return;
    }

    const response = await dispatch(login(id));
    if (!response) {
      createSnackbar(`Cannot find user with name ${id}`, { type: "error" });
      setError("");
      return;
    }

    setError("");
    setId(null);
    setOpen(false);
  };

  const handleLogout = (setOpen) => {
    dispatch(logout());
    setId(null);
    setOpen(false);
  };

  return (
    <>
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
                  placeholder="User name"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={!!error}
                  helperText={error}
                  fullWidth
                  autoFocus
                  value={id}
                  onChange={({ target }) => setId(target.value)}
                />

                <Grid
                  className={classes.loginButtons}
                  container
                  justify="space-between"
                >
                  <Grid item xs={12} md={2}>
                    <Button
                      type="submit"
                      color="primary"
                      variant="contained"
                      fullWidth
                    >
                      Login
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    {user && (
                      <Button
                        onClick={() => handleLogout(setOpen)}
                        color="secondary"
                        variant="contained"
                        fullWidth
                      >
                        Logout
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        )}
      </DialogContainer>
    </>
  );
};

export default Login;
