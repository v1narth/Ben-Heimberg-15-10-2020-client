import {
  Avatar,
  createStyles,
  IconButton,
  makeStyles,
  MenuItem,
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import { ChevronRight, Delete, MoreVert } from "@material-ui/icons";
import { RootState } from "~/store";
import MenuContainer from "../Menu";
import moment from "moment";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { generateColor } from "~/utils";

const useStyles = makeStyles((theme) =>
  createStyles({
    listItem: {
      padding: "1em 1.5em",
      borderBottom: "1px solid #f1f1f1",
      userSelect: "none",
    },
    listItem__info: {
      display: "flex",
      alignItems: "center",
      color: grey[400],
      marginBottom: "1em",
    },
    listItem__body: {
      display: "flex",
      alignItems: "center",
    },
    itemInfo__createdDate: {
      marginLeft: "auto",
      fontSize: "12px",
    },
    itemInfo__avatar: {
      width: "30px",
      height: "30px",
      marginRight: ".5em",
    },
    itemInfo__sender: {
      display: "flex",
      alignItems: "center",
    },

    itemBody__optionsIcon: {
      display: "flex",
      color: grey[400],
    },
    itemBody__content: {
      marginLeft: ".85em",
      whiteSpace: "pre-line",
    },
    bodyContent__subject: {
      fontWeight: 800,
      fontSize: "16px",
      marginBottom: ".5em",
    },
    bodyContent__message: {
      fontSize: "13px",
    },
  })
);

const ITEM_BODY_LIMIT = 235;

const ListItem = ({ data, onDelete }: { data: Message; onDelete }) => {
  const classes = useStyles();
  const { senderId, type } = useSelector((store: RootState) => store.messages);
  const { user } = useSelector((state: RootState) => state.user);

  const itemUserName =
    user || senderId
      ? type === "sent"
        ? data.receiver
        : data.sender
      : data.sender ?? data.receiver;

  return (
    <div className={classes.listItem}>
      <div className={classes.listItem__info}>
        <Avatar
          className={classes.itemInfo__avatar}
          style={{ background: generateColor(data.id) }}
        >
          {itemUserName.substring(0, 1)}
        </Avatar>
        <span className={classes.itemInfo__sender}>
          {user || senderId ? (
            type === "sent" ? (
              data.receiver
            ) : (
              data.sender
            )
          ) : (
            <>
              <span>{data.sender}</span>
              <ChevronRight />
              <span>{data.receiver}</span>
            </>
          )}
        </span>

        <span className={classes.itemInfo__createdDate}>
          {moment(data.createdAt).fromNow()}
        </span>
      </div>
      <div className={classes.listItem__body}>
        <div className={classes.itemBody__optionsIcon}>
          <MenuContainer
            activator={
              <IconButton size="small">
                <MoreVert />
              </IconButton>
            }
          >
            <MenuItem onClick={(e) => onDelete(e, data)}>
              <Delete color="secondary" />
            </MenuItem>
          </MenuContainer>
        </div>
        <div className={classes.itemBody__content}>
          <div className={classes.bodyContent__subject}>{data.subject}</div>
          <div className={classes.bodyContent__message}>
            {data.message.substring(0, ITEM_BODY_LIMIT)}{" "}
            {data.message.length > ITEM_BODY_LIMIT ? "..." : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
