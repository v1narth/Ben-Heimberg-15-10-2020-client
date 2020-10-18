import {
  Avatar,
  createStyles,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import { Delete, Reply, Print, Close, EmojiPeople } from "@material-ui/icons";
import moment from "moment";
import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SnackbarContext } from "~/context/snackbar";
import { RootState } from "~/store";
import messagesSlice, { deleteMessage } from "~/store/slices/messages";

const useStyles = makeStyles((theme) =>
  createStyles({
    messageView: {
      flex: 1,
      display: "flex",
      flexFlow: "column",
      maxHeight: "calc(100vh - 65px)",
      overflowY: "auto",
    },
    messageView__hasItem: {
      [theme.breakpoints.down("md")]: {
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        background: "#FFF",
        padding: "1em",
      },

      [theme.breakpoints.up("md")]: {
        padding: "2em 6em",
      },
    },
    messageView__sender: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "2em",
    },
    messageView__senderDetails: {
      display: "flex",
      alignItems: "center",
      gap: "1em",
    },
    messageView__date: {
      fontSize: 11,
      color: grey[400],
    },
    messageView__title: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: 21,
      fontWeight: 900,
      marginBottom: "1em",
    },
    messageView__options: {
      display: "flex",
      gap: ".5em",
      color: "#bdbdbd",
    },
    messageView__body: {
      whiteSpace: "pre-line",
    },
    // messageView__reply: {
    //   padding: "11em",
    //   marginTop: "auto",
    //   boxShadow: "1px 1px 100px 0 rgb(0 0 0 / 7%)",
    // },
    messageView__placeholder: {
      display: "flex",
      flexFlow: "column",
      gap: ".5em",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
    },
    messageView__placeholderIcon: {
      fontSize: "12em",
      color: "#DEDEDE",
    },
    messageView__placeholderText: {
      fontWeight: 200,
    },
    messageView__closeButton: {
      alignItems: "center",
    },
  })
);

const MessageView = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { createSnackbar } = useContext(SnackbarContext);

  const { selected: message } = useSelector(
    (state: RootState) => state.messages
  );

  const handleViewClose = () => {
    dispatch(messagesSlice.actions.setSelected(null));
  };

  /**
   * Handles message delete.
   * 
   * @return {void}
   */
  const handleDelete = async () => {
    try {
      await dispatch(deleteMessage(message));
      createSnackbar("Message deleted successfully", { type: "success" });
      handleViewClose();
    } catch (e) {
      createSnackbar(
        "An error occurred during the message deletion. Try again.",
        { type: "error" }
      );
    }
  };

  return (
    <div
      className={`${classes.messageView} ${
        !!message ? classes.messageView__hasItem : ""
      }`}
    >
      {!message ? (
        <div className={classes.messageView__placeholder}>
          <EmojiPeople className={classes.messageView__placeholderIcon} />
          <div className={classes.messageView__placeholderText}>
            Hello there..!
          </div>
        </div>
      ) : (
        <>
          <div className={classes.messageView__sender}>
            <div className={classes.messageView__senderDetails}>
              <Avatar />
              <span>{message.sender}</span>
            </div>
            <IconButton onClick={handleViewClose}>
              <Close />
            </IconButton>
          </div>
          <div className={classes.messageView__date}>
            {moment(message.createdAt).fromNow()}
          </div>
          <div className={classes.messageView__title}>
            <div>{message.subject}</div>
            <div className={classes.messageView__options}>
              <IconButton onClick={handleDelete} size="small" color="inherit">
                <Delete />
              </IconButton>
              {/* <IconButton size="small" color="inherit">
                <Reply />
              </IconButton> */}
              <IconButton
                onClick={() => window.print()}
                size="small"
                color="inherit"
              >
                <Print />
              </IconButton>
            </div>
          </div>
          <div className={classes.messageView__body}>{message.message}</div>
          {/* <div className={classes.messageView__reply}></div> */}
        </>
      )}
    </div>
  );
};

export default MessageView;
