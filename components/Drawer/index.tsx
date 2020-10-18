import {
  Badge,
  Button,
  createStyles,
  Divider,
  Drawer as MUIDrawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Create, Drafts, Inbox, Mail } from "@material-ui/icons";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import Link from "next/link";
import messagesSlice, { messagesList } from "~/store/slices/messages";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: 60,
      overflowX: "hidden",
      [theme.breakpoints.up("md")]: {
        width: 260,
        flexShrink: 0,
      },
    },
    paper: {
      width: 60,
      overflowX: "hidden",
      [theme.breakpoints.up("md")]: {
        width: 260,
        flexShrink: 0,
      },
    },
    secondaryText: {
      textAlign: "right",
    },
    toolbar: {
      ...theme.mixins.toolbar,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: 19,
      fontWeight: 800,
    },
    toolbar__icon: {
      color: theme.palette.primary.main,
    },
    toolbar__iconText: {
      display: "none",

      [theme.breakpoints.up("md")]: {
        display: "block",
      },
    },
    listItem: {
      color: "#9a9a9a",

      "&$.selected, &$.selected:hover": {
        backgroundColor: "#FFF",
      },
    },
    listItemSelected: {
      color: theme.palette.primary.main,
      fontWeight: "bolder",
      backgroundColor: "#FFF",
      background: "#FFF",
      "&:hover": {
        backgroundColor: "#FFF",
      },
    },
    listItemIcon: {
      color: "inherit",
    },
    compose__button: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "1em 1.25em",
    },
  })
);

const Drawer = () => {
  const classes = useStyles();

  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const drawerItems: DrawerItem[] = [
    {
      name: "received",
      title: "Inbox",
      icon: <Inbox />,
    },
    {
      name: "sent",
      title: "Sent",
      icon: <Mail />,
    },
  ];

  const dispatch = useDispatch();
  const messages = useSelector(messagesList);
  const {
    messages: { type: selectedTab, senderId },
    user: { user },
  } = useSelector((state: RootState) => state);

  /**
   * Handles tab click.
   *
   * @param item
   */
  const handleTabSelected = (item: DrawerItem) => {
    dispatch(messagesSlice.actions.setType(item.name));
  };

  return (
    <MUIDrawer
      className={classes.root}
      variant="permanent"
      classes={{
        paper: classes.paper,
      }}
    >
      <div className={classes.toolbar}>
        <>
          <Drafts className={classes.toolbar__icon} />{" "}
          <span className={classes.toolbar__iconText}>Mail Box</span>
        </>
      </div>
      <Divider />
      <div className={classes.compose__button}>
        <Link href="/compose">
          {isMdUp ? (
            <Button variant="contained" color="primary" fullWidth>
              Compose new
            </Button>
          ) : (
            <IconButton color="primary">
              <Create />
            </IconButton>
          )}
        </Link>
      </div>
      <List>
        {user || senderId ? (
          drawerItems.map((item, index) => (
            <Link key={index} href="/">
              <ListItem
                onClick={() => handleTabSelected(item)}
                button
                selected={item.name === selectedTab}
                classes={{
                  selected: classes.listItemSelected,
                  root: classes.listItem,
                }}
              >
                <ListItemIcon className={classes.listItemIcon}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.title} />
                <ListItemText
                  className={classes.secondaryText}
                  secondary={
                    Array.isArray(messages)
                      ? messages.length
                      : messages[item.name].length
                  }
                />
              </ListItem>
            </Link>
          ))
        ) : (
          <ListItem>
            <ListItemIcon>
              <Inbox />
            </ListItemIcon>
            <ListItemText primary="All Messages" />
            <ListItemText
              className={classes.secondaryText}
              secondary={(messages as []).length}
            />
          </ListItem>
        )}
      </List>
    </MUIDrawer>
  );
};

export default Drawer;
