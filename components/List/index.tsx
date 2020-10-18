import ListItem from "./Item";
import { createStyles, makeStyles, TextField } from "@material-ui/core";
import { RootState } from "~/store";
import { useDispatch, useSelector } from "react-redux";
import messagesSlice, {
  deleteMessage,
  messagesList,
} from "~/store/slices/messages";
import { Inbox } from "@material-ui/icons";
import { isLoggedIn } from "~/store/slices/user";
import { useContext } from "react";
import { SnackbarContext } from "~/context/snackbar";
import Login from "../Login";

const useStyles = makeStyles((theme) =>
  createStyles({
    listRoot: {
      position: "relative",
      top: "-55px",

      [theme.breakpoints.up("sm")]: {
        top: "-65px",
      },
    },
    list: {
      background: "#f7f7f7",
      height: "calc(100vh - 65px)",
      borderRight: "1px solid #f1f1f1",
      maxHeight: "100%",
      overflow: "auto",

      [theme.breakpoints.up("lg")]: {
        width: "460px",
      },
    },
    list__emptyPlaceholder: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      flexFlow: "column",
    },
    emptyPlaceholder__icon: {
      fontSize: "12em",
      color: "#dedede",
    },
    emptyPlaceholder__text: {
      fontWeight: 200,
    },
    listItem: {
      transition: ".1s ease",
      cursor: "pointer",

      "&:hover": {
        background: "#FFF",
        transition: ".1s ease",
      },
    },
    listItem__selected: {
      background: "#FFF",
      borderLeft: `2px solid ${theme.palette.primary.main}`,
    },
    userSelect: {
      ...theme.mixins.toolbar,
      background: "#f5f5f5",
      borderRight: "1px solid #e2e2e2",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 1em",
      borderBottom: "1px solid #e0e0e0",
      height: "65px",
    },
    userSelect__input: {
      background: "#f7f7f7",
      boxShadow: "none",
      marginRight: "1em",
    },
    userAvatar: {
      marginLeft: "auto",

      [theme.breakpoints.up("md")]: {
        display: "none",
      },
    },
  })
);

const List = () => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const { selected, type, senderId } = useSelector(
    (state: RootState) => state.messages
  );

  const { createSnackbar } = useContext(SnackbarContext);
  const loggedIn = useSelector(isLoggedIn);
  const messages = useSelector(messagesList);
  const list = Array.isArray(messages) ? messages : messages[type];

  /**
   *
   * @param message
   */
  const handleItemSelected = (message: Message) => {
    dispatch(messagesSlice.actions.setSelected(message));
  };

  /**
   * Handles message deletion.
   *
   * @param e
   * @param message
   */
  const handleMessageDelete = async (e, message: Message) => {
    e.stopPropagation();

    try {
      await dispatch(deleteMessage(message));
      createSnackbar("Message deleted successfully", { type: "success" });
    } catch (e) {
      createSnackbar(
        "An error occurred during the message deletion. Try again.",
        { type: "error" }
      );
    }
  };

  return (
    <div className={classes.listRoot}>
      <div className={classes.userSelect}>
        {!loggedIn && (
          <TextField
            className={classes.userSelect__input}
            variant="filled"
            fullWidth
            label="Filter"
            placeholder="Enter user name"
            InputLabelProps={{
              shrink: true,
            }}
            value={senderId}
            onChange={({ target }) =>
              dispatch(messagesSlice.actions.setSenderId(target.value))
            }
          />
        )}
        <div className={classes.userAvatar}>
          <Login />
        </div>
      </div>
      <div className={classes.list}>
        {!list.length && (
          <div className={classes.list__emptyPlaceholder}>
            <Inbox className={classes.emptyPlaceholder__icon} />
            <div className={classes.emptyPlaceholder__text}>No messages</div>
          </div>
        )}

        {list &&
          list.map((message) => (
            <div
              key={message.id}
              className={`${classes.listItem} ${
                selected?.id === message.id ? classes.listItem__selected : ""
              }`}
              onClick={() => handleItemSelected(message)}
            >
              <ListItem data={message} onDelete={handleMessageDelete} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default List;
