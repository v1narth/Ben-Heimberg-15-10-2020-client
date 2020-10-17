import Head from "next/head";
import store from "~/store";
import DefaultLayout from "../layouts/default";
import theme from "../themes/default";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { useEffect } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "~/lib/apolloClient";
import "../styles/globals.css";

const App = ({ Component, pageProps }) => {
  const apolloClient = useApollo(pageProps.initialApolloState);

  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Herolo Messaging App</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ApolloProvider client={apolloClient}>
        <ReduxProvider store={store}>
          <ThemeProvider theme={theme}>
            <DefaultLayout>
              <CssBaseline />
              <Component {...pageProps} />
            </DefaultLayout>
          </ThemeProvider>
        </ReduxProvider>
      </ApolloProvider>
    </>
  );
};

export default App;
