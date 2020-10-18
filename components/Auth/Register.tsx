import {
  CardHeader,
  CardContent,
  TextField,
  Divider,
  CardActions,
  Button,
  makeStyles,
  createStyles,
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { SnackbarContext } from "~/context/snackbar";
import { register } from "~/store/slices/user";

const useStyles = makeStyles((theme) =>
  createStyles({
    position: {
      marginLeft: "auto",
    },
  })
);

const Register = ({ onRegistered = null, onActionChange = null }) => {
  const classes = useStyles();
  const [userName, setUserName] = useState("");
  const [error, setError] = useState(null);

  const { createSnackbar } = useContext(SnackbarContext);

  const dispatch = useDispatch();

  /**
   * Handle user registration.
   *
   * @param e
   * @return {void}
   */
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!userName) {
      setError("This field is required");
      return;
    }

    try {
      const {
        data: { createOneUser },
      } = (await dispatch(register(userName))) as any;
      createSnackbar(
        `User ${createOneUser.senderId} has been successfully created`,
        { type: "success" }
      );

      setUserName("");
      onRegistered && onRegistered();
    } catch (e) {
      createSnackbar(
        "An error occurred, please check the field values, and try again.",
        { type: "error" }
      );
    }
  };

  return (
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
            error={!!error}
            helperText={error}
            label="Name"
            onChange={({ target }) => setUserName(target.value)}
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
            onClick={() => onActionChange && onActionChange("login")}
          >
            Back to Login
          </Button>
        </CardActions>
      </form>
    </>
  );
};

export default Register;
