import {
  Button,
  createStyles,
  Grid,
  IconButton,
  makeStyles,
  TextField,
  TextFieldProps,
} from "@material-ui/core";
import Head from "next/head";
import Link from "next/link";
import { Close } from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SnackbarContext } from "~/context/snackbar";
import { RootState } from "~/store";
import { createMessageAsync } from "~/store/slices/messages";

const useStyles = makeStyles((theme) =>
  createStyles({
    compose: {
      width: "100%",
      padding: "1em",

      [theme.breakpoints.up("md")]: {
        padding: "50px",
      },
    },
    form: {
      display: "flex",
      flexFlow: "column",
      gap: "1.75em",
      marginTop: "2em",
    },
  })
);

const FormTextField = ({
  label,
  name,
  errors,
  ...props
}: TextFieldProps & { errors: any }) => {
  return (
    <TextField
      variant="filled"
      InputLabelProps={{
        shrink: true,
      }}
      id={name}
      key={name}
      error={!!errors[name]}
      helperText={errors[name]}
      name={name}
      label={label}
      placeholder={`Enter ${label}`}
      fullWidth
      {...props}
    />
  );
};

const Compose = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  const {
    messages: { senderId },
    user: { user },
  } = useSelector((state: RootState) => state);

  const initialFormValue = {
    sender: user?.senderId ?? senderId,
    receiver: "",
    subject: "",
    message: "",
  };

  const [messageData, setMessageData] = useState(() => initialFormValue);
  const [errors, setErrors] = useState({});

  const { createSnackbar } = useContext(SnackbarContext);
  const dispatch = useDispatch();
  const createMessage = (message) => dispatch(createMessageAsync(message));

  useEffect(() => {
    user && setMessageData((curr) => ({ ...curr, sender: user.senderId }));
  }, [user]);

  /**
   * Handle input field changes.
   *
   * @return {void}
   */
  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setMessageData((data) => ({ ...data, [name]: value }));

    if (errors[name] && value) {
      setErrors(() => {
        delete errors[name];
        return errors;
      });
    }
  };

  /**
   * Send message.
   *
   * @param event
   */
  const handleSendMessage = async (event) => {
    event.preventDefault();

    let err = {};
    for (let field of ["sender", "receiver"]) {
      if (!messageData[field]) {
        err[field] = "This field is required";
      }
    }

    setErrors(err);
    if (Object.keys(err).length) return;

    setLoading(true);

    try {
      await createMessage({
        ...messageData,
        sender: messageData.sender,
        receiver: messageData.receiver,
      });

      resetFields();
      createSnackbar("Message successfully sent", {
        type: "success",
      });
    } catch (e) {
      createSnackbar("Sending message has failed", {
        type: "error",
      });
      return;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset form fields value.
   *
   * @return {void}
   */
  const resetFields = () => {
    setMessageData(initialFormValue);
    setErrors({});
  };

  return (
    <>
      <Head>
        <title>Send Message</title>
      </Head>
      <div className={classes.compose}>
        <Link href="/">
          <IconButton>
            <Close />
          </IconButton>
        </Link>

        <form
          autoComplete="off"
          className={classes.form}
          onSubmit={handleSendMessage}
        >
          <Grid container spacing={3}>
            {!user && (
              <Grid item xs={12} md={6}>
                <FormTextField
                  name="sender"
                  label="Sender"
                  errors={errors}
                  disabled={loading}
                  value={messageData.sender}
                  onChange={handleFieldChange}
                  placeholder="Enter an existing / new user"
                />
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <FormTextField
                name="receiver"
                label="Receiver"
                errors={errors}
                disabled={loading}
                value={messageData.receiver}
                onChange={handleFieldChange}
                placeholder="Enter an existing / new user"
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormTextField
                name="subject"
                label="Subject"
                errors={errors}
                disabled={loading}
                value={messageData.subject}
                onChange={handleFieldChange}
              />
            </Grid>
          </Grid>

          <div>
            <FormTextField
              name="message"
              label="Message body"
              type="number"
              multiline
              rows={6}
              errors={errors}
              disabled={loading}
              value={messageData.message}
              onChange={handleFieldChange}
            />
          </div>
          <div>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} lg={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  fullWidth
                >
                  Send
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} lg={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={resetFields}
                  disabled={loading}
                  fullWidth
                >
                  Clear
                </Button>
              </Grid>
            </Grid>
          </div>
        </form>
      </div>
    </>
  );
};

export default Compose;
