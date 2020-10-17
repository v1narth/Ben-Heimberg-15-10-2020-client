import Head from "next/head";
import List from "../components/List";
import MessageView from "~/components/View";
import { createStyles, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flex: 1,
      position: "relative",

      [theme.breakpoints.up("md")]: {
        display: "flex",
      },
    },
  })
);

const Home = () => {
  const classes = useStyles();

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <div className={classes.root}>
        <List />
        <MessageView />
      </div>
    </>
  );
};

export default Home;
