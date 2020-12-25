/* eslint-disable no-restricted-globals */
/* eslint-disable react/prop-types */
import React from "react";
import clsx from "clsx";
import { useRouter } from "next/router";
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
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";

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

export default function ContributeForm({ address }) {
  const router = useRouter();
  const classes = useStyles();
  const [state, setState] = React.useState({
    amount: "",
    errorMessage: "",
  });

  const handleChange = (event) => {
    setState({ amount: event.target.value, errorMessage: "" });
  };
  const [loading, setLoading] = React.useState(false);
  const buttonClassname = clsx({
    [classes.buttonSuccess]: loading,
  });

  async function makeContribution() {
    event.preventDefault();

    setState({
      errorMessage: "",
    });
    setLoading(true);

    const campaign = Campaign(address);

    try {
      const accounts = await web3.eth.getAccounts();

      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(state.amount, "ether"),
      });
      router.push(`/campaigns/${address}`);
    } catch (err) {
      setState({ errorMessage: err.message, amount: "" });
    }

    setLoading(false);
  }

  return (
    <Box m={3} p={1} pt={6}>
      <Grid container direction="column">
        <Typography variant="h5">Contribute to this Campaign</Typography>
        <form
          className={classes.root}
          autoComplete="off"
          onSubmit={makeContribution}
        >
          <Grid item>
            <Typography variant="h6">Amount to Contribute</Typography>
            <Typography variant="caption" display="block" gutterBottom>
              {/* {`Minimum Contribution: ${address}`} */}
              (Minimum Contribution: 100 Wei)
            </Typography>
            <TextField
              id="outlined-amount"
              required
              value={state.amount}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">ether</InputAdornment>
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
          <Grid item style={{ display: "flex", alignItems: "center" }}>
            <div className={classes.wrapper}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                className={buttonClassname}
                disabled={loading}
              >
                Contribute
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
