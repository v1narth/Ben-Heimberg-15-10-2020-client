import { useApolloClient } from "@apollo/client";
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
import { Autocomplete } from "@material-ui/lab";
import React, { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SnackbarContext } from "~/context/snackbar";
import { Users } from "~/graphql/user";
import { RootState } from "~/store";
import messagesSlice from "~/store/slices/messages";
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
    userSelect__inputRoot: {
      background: "initial",
    },
    userSelect__input: {
      background: "initial",
      boxShadow: "none",
      marginRight: "1em",
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

  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState("");
  const apollo = useApolloClient();

  useEffect(() => {
    setLoading(true);

    const searchUsers = async () => {
      const {
        data: { users },
      } = await apollo.query({
        query: Users,
        variables: {
          q: search,
        },
      });

      setOptions(users);
    };

    searchUsers();
  }, [search]);

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
                <Autocomplete
                  options={options}
                  loading={loading}
                  fullWidth
                  classes={{
                    root: classes.userSelect__inputRoot,
                    input: classes.userSelect__inputRoot,
                  }}
                  onInputChange={(e, value) => setSearch(value)}
                  onChange={(e, value) => setId(value?.senderId ?? null)}
                  getOptionLabel={(option) => option.senderId}
                  getOptionSelected={(option, value) =>
                    option.senderId === value.senderId
                  }
                  className={classes.userSelect__input}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="filled"
                      fullWidth
                      error={error}
                      helperText={error}
                      label="Filter"
                      placeholder="Enter user name"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )}
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
