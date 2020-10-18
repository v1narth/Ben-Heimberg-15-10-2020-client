import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { createContext, useState } from "react";

type CreateSnackbarOptionsProps = {
  type: "success" | "error" | "info" | "warning";
};

const initialState = {
  createSnackbar: (message: string, options?: CreateSnackbarOptionsProps) => {},
};

export const SnackbarContext = createContext(initialState);

const SnackbarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    options: {} as CreateSnackbarOptionsProps,
    message: "",
  });

  const createSnackbar = (
    message: string,
    options?: CreateSnackbarOptionsProps
  ) => {
    setSnackbar({
      message,
      options,
    });

    setOpen(true);
  };

  return (
    <SnackbarContext.Provider value={{ createSnackbar }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
      >
        <Alert severity={snackbar.options?.type ?? "info"}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;
