/* eslint-disable no-param-reassign */
/* eslint-disable radix */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Collapse,
  Divider,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";

import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { green, orange } from "@material-ui/core/colors";
import clsx from "clsx";
import ContributeForm from "../../../../components/ContributeForm";
import Campaign from "../../../../ethereum/campaign";
import web3 from "../../../../ethereum/web3";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      borderBottom: "unset",
      margin: theme.spacing(1),
    },
  },
  tableStyle: {
    margin: 10,
  },
  nested: {
    paddingLeft: 50,
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
    color: orange[40],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

const columns = [
  { id: "id", label: "ID", minWidth: 20 },
  { id: "description", label: "Description", minWidth: 150 },
  {
    id: "value",
    label: "Amount (in Ether)",
    minWidth: 100,
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "recipient",
    label: "Recipient",
    minWidth: 170,
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "approvalCount",
    label: "Approval Count",
    minWidth: 30,
    format: (value) => value.toFixed(2),
  },
];

function Row(props) {
  const { row, approversCount } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const router = useRouter();
  const [apploading, setappLoading] = React.useState(false);
  const [finloading, setfinLoading] = React.useState(false);

  const buttonappClassname = clsx({
    [classes.buttonSuccess]: apploading,
  });
  const buttonfinClassname = clsx({
    [classes.buttonSuccess]: finloading,
  });

  const approve = async (e) => {
    e.preventDefault();
    setappLoading(true);
    const campaign = Campaign(router.query.address);
    try {
      const accounts = await web3.eth.getAccounts();

      await campaign.methods.approveRequest(row.id - 1).send({
        from: accounts[0],
      });
      router.push(`/campaigns/${router.query.address}/requests`);
    } catch (err) {
      console.log(err.message);
    }
    setappLoading(false);
  };

  const finalize = async (e) => {
    e.preventDefault();
    setfinLoading(true);
    const campaign = Campaign(router.query.address);
    try {
      const accounts = await web3.eth.getAccounts();

      await campaign.methods.finalizeRequest(row.id - 1).send({
        from: accounts[0],
      });
      router.push(`/campaigns/${router.query.address}/requests`);
    } catch (err) {
      console.log(err.message);
    }
    setfinLoading(false);
  };

  return (
    <>
      <TableRow
        className={classes.root}
        selected={row.approvalCount > approversCount / 2 || row.isCompleted}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.id}
        </TableCell>
        <TableCell>{row.description}</TableCell>
        <TableCell>{row.value}</TableCell>
        <TableCell>{row.recipient}</TableCell>
        <TableCell>{`${row.approvalCount}/${approversCount}`}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              {row.isCompleted ? (
                <List component="div" disablePadding>
                  <ListItem className={classes.nested}>
                    <ListItemText primary="This request has been finalized" />
                  </ListItem>
                </List>
              ) : (
                <List component="div" disablePadding>
                  <ListItem className={classes.nested}>
                    <ListItemText primary="Approve this request(If not already approved)" />
                    <ListItemSecondaryAction
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <div className={classes.wrapper}>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={approve}
                          className={buttonappClassname}
                          disabled={apploading}
                        >
                          Approve
                        </Button>
                        {apploading && (
                          <CircularProgress
                            size={24}
                            className={classes.buttonProgress}
                          />
                        )}
                      </div>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem className={classes.nested}>
                    <ListItemText primary="Finalize this request" />
                    <ListItemSecondaryAction
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <div className={classes.wrapper}>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={finalize}
                          className={buttonfinClassname}
                          disabled={finloading}
                        >
                          Finalize
                        </Button>
                        {finloading && (
                          <CircularProgress
                            size={24}
                            className={classes.buttonProgress}
                          />
                        )}
                      </div>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function Requests(props) {
  const router = useRouter();
  const { address } = router.query;
  const classes = useStyles();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={7} lg={8}>
        <Typography variant="h4" component="h2">
          Spending Requests
        </Typography>

        {props.reqCnt > 0 ? (
          <TableContainer component={Paper} className={classes.tableStyle}>
            <Table stickyHeader aria-label="collapsible table">
              <caption>{`Found ${props.reqCnt} spending requests`}</caption>
              <TableHead>
                <TableRow>
                  <TableCell />
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {props.allRequests.map((row) => (
                  <Row
                    key={row.id}
                    row={row}
                    approversCount={props.approversCount}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box style={{ margin: 10 }}>
            <Typography variant="h5">No requests made yet!</Typography>
          </Box>
        )}
      </Grid>
      <Grid container direction="column" alignItems="stretch" item xs sm md lg>
        <Box m={2} p={2}>
          <Card style={{ minWidth: 275, marginBottom: 15 }} variant="outlined">
            <CardContent>
              <Typography variant="h5" style={{ marginBottom: 10 }}>
                New Spending Request?
              </Typography>
              <Typography variant="body1">
                Make a new spending request for your campaign. Only manager of
                this campaign can create a spending request. Click the below
                button to create one
              </Typography>
            </CardContent>
            <CardActions>
              <Link
                href={`/campaigns/${address}/requests/new`}
                style={{ textDecoration: "none" }}
              >
                <Button
                  style={{ margin: 10 }}
                  variant="contained"
                  color="primary"
                >
                  Add Request
                </Button>
              </Link>
            </CardActions>
          </Card>
          <ContributeForm
            address={address}
            minContribution={props.minimumContribution}
          />
        </Box>
      </Grid>
    </Grid>
  );
}

Requests.getInitialProps = async (ctx) => {
  const campaign = Campaign(ctx.query.address);

  const minimumContribution = await campaign.methods
    .minimumContribution()
    .call();

  const approversCount = await campaign.methods.approversCount().call();

  const reqCnt = await campaign.methods.numRequests().call();

  const allRequests = await Promise.all(
    Array(parseInt(reqCnt))
      .fill()
      .map((sr, index) => campaign.methods.spendingRequests(index).call()),
  );

  allRequests.forEach((el, index) => {
    el.id = index + 1;
    el.value = web3.utils.fromWei(el.value, "ether");
  });

  return {
    minimumContribution,
    allRequests,
    approversCount,
    reqCnt,
  };
};

export default Requests;
