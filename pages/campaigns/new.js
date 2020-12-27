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
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";

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

export default function NewCampaign() {
  const router = useRouter();
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
      router.push("/");
    } catch (err) {
      setState({ errorMessage: err.message, minimumContribution: "" });
    }
    setLoading(false);
  }

  return (
    <Box m={4}>
      <Typography variant="h3" component="h1" style={{ marginBottom: 15 }}>
        Create a Campaign
      </Typography>
      <Grid container direction="column" alignItems="stretch">
        <form
          className={classes.root}
          autoComplete="off"
          onSubmit={createCampaign}
        >
          <Grid item>
            <Typography variant="overline" display="block" gutterBottom>
              Minimum Contribution
            </Typography>
            <TextField
              id="outlined-full-width-minimumContribution"
              required
              style={{ margin: 8 }}
              margin="normal"
              value={state.minimumContribution}
              onChange={handleChange}
              placeholder="Minimum Contribution for this campaign"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">Wei</InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
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
