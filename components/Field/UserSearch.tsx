import { useApolloClient } from "@apollo/client";
import { createStyles, makeStyles, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { Users } from "~/graphql/user";

const useStyles = makeStyles((theme) =>
  createStyles({
    userSelect__inputRoot: {
      background: "initial",
    },
    userSelect__input: {
      background: "initial",
      boxShadow: "none",
      marginRight: "1em",
    },
  })
);

const UserSearchField = ({ onChange, value = "", inputProps = {} }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState("");
  const apollo = useApolloClient();

  useEffect(() => {
    setLoading(true);

    const searchUsers = async () => {
      const {
        data: { users },
      } = await apollo.query({
        query: Users,
        variables: {
          q: search,
        },
      });

      setOptions(users);
      setLoading(false);
    };

    searchUsers();
  }, [search]);

  return (
    <Autocomplete
      options={options}
      loading={loading}
      fullWidth
      classes={{
        input: classes.userSelect__inputRoot,
      }}
      onInputChange={(e, value) => setSearch(value)}
      onChange={(e, value) => onChange(e, value)}
      getOptionLabel={(option) => option.senderId}
      getOptionSelected={(option, value) => option.senderId === value.senderId}
      className={classes.userSelect__input}
      inputValue={value}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="filled"
          fullWidth
          placeholder="Search..."
          InputLabelProps={{
            shrink: true,
          }}
          {...inputProps}
        />
      )}
    />
  );
};

export default UserSearchField;
