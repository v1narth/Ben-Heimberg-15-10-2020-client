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
  CardActions,
  Divider,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SnackbarContext } from "~/context/snackbar";
import { Users } from "~/graphql/user";
import { RootState } from "~/store";
import { login, logout, register } from "~/store/slices/user";
import DialogContainer from "../Dialog";
import UserSearchField from "../Field/UserSearch";

const useStyles = makeStyles((theme) =>
  createStyles({
    loginContainer: {
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
    position: {
      marginLeft: "auto",
    },
  })
);

const Login = () => {
  const classes = useStyles();

  const [id, setId] = useState("");
  const [action, setAction] = useState<"login" | "register">("login");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState("");

  const apollo = useApolloClient();
  const dispatch = useDispatch();
  const { createSnackbar } = useContext(SnackbarContext);
  const { user } = useSelector((state: RootState) => state.user);

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
      setLoading(false);
    };

    searchUsers();
  }, [search]);

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

    setOpen(false);
    setError("");
    setId(null);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!id) {
      setError("This field is required");
    }

    try {
      const {
        data: { createOneUser },
      } = (await dispatch(register(id))) as any;
      createSnackbar(
        `User ${createOneUser.senderId} has been successfully created`,
        { type: "success" }
      );

      setAction("login");
      setId("");
    } catch (e) {
      createSnackbar(
        "An error occurred, please check the field values, and try again.",
        { type: "error" }
      );
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setId(null);
  };

  return (
    <>
      <DialogContainer
        activator={<Avatar>{user && user.senderId.substring(0, 1)}</Avatar>}
      >
        {({ setOpen }) => (
          <Card className={classes.loginContainer}>
            {action === "login" ? (
              <>
                <CardHeader title={user ? "Switch user" : "Login"} />
                <form
                  onSubmit={(e) => handleLogin(e, setOpen)}
                  className={classes.loginForm}
                >
                  <CardContent>
                    <UserSearchField
                      value={id}
                      onChange={(e, value) => setId(value?.senderId ?? "")}
                      inputProps={{
                        label: "User",
                      }}
                    />
                  </CardContent>
                  <Divider />
                  <CardActions disableSpacing>
                    <Button type="submit" color="primary">
                      {user ? "Switch" : "Login"}
                    </Button>
                    {user && (
                      <Button onClick={() => handleLogout()} color="secondary">
                        Logout
                      </Button>
                    )}

                    <Button
                      className={classes.position}
                      onClick={() => setAction("register")}
                      color="secondary"
                    >
                      Create New
                    </Button>
                  </CardActions>
                </form>
              </>
            ) : (
              <>
                <form onSubmit={handleRegister}>
                  <CardHeader title="Create user" />
                  <CardContent>
                    <TextField
                      variant="filled"
                      placeholder="User name"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      label="Name"
                      onChange={({ target }) => setId(target.value)}
                      fullWidth
                    />
                  </CardContent>
                  <Divider />
                  <CardActions disableSpacing>
                    <Button color="primary" type="submit">
                      Create
                    </Button>
                    <Button
                      className={classes.position}
                      color="secondary"
                      onClick={() => setAction("login")}
                    >
                      Back to Login
                    </Button>
                  </CardActions>
                </form>
              </>
            )}
          </Card>
        )}
      </DialogContainer>
    </>
  );
};

export default Login;
