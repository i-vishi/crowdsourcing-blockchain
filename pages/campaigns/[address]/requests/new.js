/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
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
import clsx from "clsx";
import { useRouter } from "next/router";
import React from "react";
import web3 from "../../../../ethereum/web3";
import Campaign from "../../../../ethereum/campaign";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  wrapper: {
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

export default function NewRequest() {
  const router = useRouter();
  const { address } = router.query;
  const classes = useStyles();
  const [state, setState] = React.useState({
    description: "",
    amount: "",
    recipient: "",
    errorMessage: "",
  });

  const handleChange = (prop) => (event) => {
    setState({ ...state, [prop]: event.target.value, errorMessage: "" });
  };
  const [loading, setLoading] = React.useState(false);
  const buttonClassname = clsx({
    [classes.buttonSuccess]: loading,
  });

  const makeRequest = async (e) => {
    e.preventDefault();
    setState({ ...state, errorMessage: "" });
    setLoading(true);

    const campaign = Campaign(address);

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createSpendingRequest(
          state.description,
          web3.utils.toWei(state.amount, "ether"),
          state.recipient,
        )
        .send({ from: accounts[0] });
      router.push(`/campaigns/${address}/requests`);
    } catch (err) {
      setState({ ...state, errorMessage: err.message });
    }
    setLoading(false);
  };
  return (
    <Box m={4}>
      <Typography variant="h3" component="h1" style={{ marginBottom: 15 }}>
        Create a new spending request
      </Typography>
      <Grid container direction="column" alignItems="stretch">
        <form
          className={classes.root}
          autoComplete="off"
          onSubmit={makeRequest}
        >
          <Grid item>
            <Typography variant="overline" display="block" gutterBottom>
              Description
            </Typography>
            <TextField
              id="outlined-full-width-description"
              value={state.description}
              onChange={handleChange("description")}
              style={{ margin: 8 }}
              placeholder="What's this request for?"
              fullWidth
              required
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <Typography variant="overline" display="block" gutterBottom>
              Amount in Ether
            </Typography>
            <TextField
              id="outlined-full-width-amount"
              value={state.amount}
              onChange={handleChange("amount")}
              style={{ margin: 8 }}
              placeholder="How much do you want to spend on it?"
              fullWidth
              margin="normal"
              required
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">Ether</InputAdornment>
                ),
              }}
              variant="outlined"
              type="number"
            />
          </Grid>
          <Grid item>
            <Typography variant="overline" display="block" gutterBottom>
              Recipient
            </Typography>
            <TextField
              id="outlined-full-width-recipient"
              value={state.recipient}
              onChange={handleChange("recipient")}
              style={{ margin: 8 }}
              placeholder="Address of Recipient (e.g, 0x0000...)"
              fullWidth
              required
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
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
                Create Request
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
