import { gql, useMutation } from "@apollo/client";
import {
  Button,
  createStyles,
  Grid,
  IconButton,
  makeStyles,
  Snackbar,
  TextField,
  TextFieldProps,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "~/store";

const useStyles = makeStyles((theme) =>
  createStyles({
    compose: {
      width: "100%",
      padding: "50px",
    },
    form: {
      display: "flex",
      flexFlow: "column",
      gap: "1.75em",
      marginTop: "2em",
    },
  })
);

const Compose = () => {
  const classes = useStyles();

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

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  } as { open: boolean; message: string; type: "success" | "warning" | "info" | "error" });

  const [errors, setErrors] = useState({});

  const [createMessage] = useMutation(
    gql`
      mutation($data: MessageCreateInput!) {
        createOneMessage(data: $data) {
          id
        }
      }
    `
  );

  useEffect(() => {
    user && setMessageData((curr) => ({ ...curr, sender: user.senderId }));
  }, [user]);

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

    try {
      await createMessage({
        variables: {
          data: {
            ...messageData,
            sender: messageData.sender && Number(messageData.sender),
            receiver: messageData.receiver && Number(messageData.receiver),
          },
        },
      });
    } catch (e) {
      setSnackbar({
        message: "Sending message has failed",
        open: true,
        type: "error",
      });

      return;
    }

    setSnackbar({
      message: "Message successfully sent",
      open: true,
      type: "success",
    });

    resetFields();
  };

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
            <Grid item xs={12} md={6}>
              <FormTextField
                name="sender"
                label="Sender"
                type="number"
                errors={errors}
                value={messageData.sender}
                onChange={handleFieldChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormTextField
                name="receiver"
                label="Receiver"
                type="number"
                errors={errors}
                value={messageData.receiver}
                onChange={handleFieldChange}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormTextField
                name="subject"
                label="Subject"
                errors={errors}
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
              value={messageData.message}
              onChange={handleFieldChange}
            />
          </div>
          <div>
            <Grid container spacing={3}>
              <Grid item>
                <Button type="submit" variant="contained" color="primary">
                  Send
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={resetFields}
                >
                  Clear
                </Button>
              </Grid>
            </Grid>
          </div>
        </form>
      </div>

      <Snackbar
        open={snackbar.open}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.type}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
};

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

export default Compose;
