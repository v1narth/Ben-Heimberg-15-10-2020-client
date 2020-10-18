import { useApolloClient } from "@apollo/client";
import { Avatar, createStyles, makeStyles, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Users } from "~/graphql/user";
import { generateColor } from "~/utils";

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

const UserSearchField = ({ onChange, value = null, inputProps = {} }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState("");
  const [localValue, setLocalValue] = useState(null);
  const apollo = useApolloClient();

  useEffect(() => {
    if (value) {
      setLocalValue({ senderId: value });
    }
  }, [value]);

  useEffect(() => {
    onChange(null, localValue);
  }, [localValue]);

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
      onChange={(e, value) => setLocalValue(value)}
      getOptionLabel={(option) => option.senderId}
      getOptionSelected={(option, value) => option.senderId === value.senderId}
      renderOption={(option, state) => (
        <>
          <Avatar
            style={{
              background: generateColor(option.id),
              marginRight: ".5em",
            }}
          >
            {option.senderId.substring(0, 1)}
          </Avatar>

          {option.senderId}
        </>
      )}
      className={classes.userSelect__input}
      inputValue={search}
      value={localValue}
      autoComplete={false}
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
