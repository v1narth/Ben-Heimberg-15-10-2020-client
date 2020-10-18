import { useSubscription, gql } from "@apollo/client";
import { createStyles, makeStyles } from "@material-ui/core";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SnackbarProvider from "~/context/snackbar";
import { RootState } from "~/store";
import { fetchMessages, setCurrentList } from "~/store/slices/messages";
import { getUser } from "~/store/slices/user";
import Drawer from "../components/Drawer";
import Header from "../components/Header";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: "flex",
    },
  })
);

const Default = ({ children }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const {
    messages: { senderId },
    user: { user },
  } = useSelector((state: RootState) => state);

  useEffect(() => {
    dispatch(getUser());
  }, []);

  useEffect(() => {
    dispatch(fetchMessages(user?.senderId ?? senderId));
  }, [senderId, user]);

  const { data: { messageCreated } = { data: null } } = useSubscription(gql`
    subscription {
      messageCreated {
        id
        message
        sender
        receiver
        subject
        createdAt
      }
    }
  `);

  useEffect(() => {
    if (messageCreated) {
      dispatch(setCurrentList(messageCreated));
    }
  }, [messageCreated]);

  return (
    <>
      <div>
        <SnackbarProvider>
          <Header />
          <div className={classes.root}>
            <Drawer />
            {children}
          </div>
        </SnackbarProvider>
      </div>
    </>
  );
};

export default Default;
