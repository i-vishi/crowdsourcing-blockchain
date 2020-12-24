/* eslint-disable no-restricted-globals */
/* eslint-disable react/prop-types */
import React from "react";
import clsx from "clsx";

import {
  Box,
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import { Alert, AlertTitle } from "@material-ui/lab";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  buttonSuccess: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default function NewCampaign() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    minimumContribution: "",
    errorMessage: "",
  });

  const handleChange = (event) => {
    setState({ minimumContribution: event.target.value, errorMessage: "" });
  };
  const [loading, setLoading] = React.useState(false);
  const buttonClassname = clsx({
    [classes.buttonSuccess]: loading,
  });

  async function createCampaign() {
    event.preventDefault();
    setState({
      errorMessage: "",
    });
    setLoading(true);
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(state.minimumContribution).send({
        from: accounts[0],
      });
    } catch (err) {
      setState({ errorMessage: err.message, minimumContribution: "" });
    }
    setLoading(false);
  }

  return (
    <Box m={4}>
      <Typography variant="h3" component="h1">
        Create a Campaign
      </Typography>
      <Grid container item xs={12} sm={10} md={8} lg={8}>
        <form
          className={classes.root}
          autoComplete="off"
          onSubmit={createCampaign}
        >
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Typography variant="overline" display="block" gutterBottom>
              Minimum Contribution
            </Typography>
            <TextField
              id="outlined-minimumContribution"
              // eslint-disable-next-line react/jsx-boolean-value
              required={true}
              value={state.minimumContribution}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">Wei</InputAdornment>
                ),
              }}
              type="number"
            />
          </Grid>
          {state.errorMessage.length > 0 && (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {state.errorMessage}
            </Alert>
          )}
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            style={{ display: "flex", alignItems: "center" }}
          >
            <div className={classes.wrapper}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                className={buttonClassname}
                disabled={loading}
              >
                Create Campaign
              </Button>
              {loading && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </div>
          </Grid>
        </form>
      </Grid>
    </Box>
  );
}
