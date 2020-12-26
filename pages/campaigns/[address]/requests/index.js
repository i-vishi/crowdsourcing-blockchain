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
import ContributeForm from "../../../../components/ContributeForm";
import Campaign from "../../../../ethereum/campaign";
import web3 from "../../../../ethereum/web3";

const useStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  tableStyle: {
    margin: 10,
  },
  nested: {
    paddingLeft: 50,
  },
});

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

  const approve = async (e) => {
    e.preventDefault();
    const campaign = Campaign(router.query.address);

    const accounts = await web3.eth.getAccounts();

    await campaign.methods.approveRequest(row.id - 1).send({
      from: accounts[0],
    });
    router.push(`/campaigns/${router.query.address}/requests`);
  };

  const finalize = async (e) => {
    e.preventDefault();
    const campaign = Campaign(router.query.address);

    const accounts = await web3.eth.getAccounts();

    await campaign.methods.finalizeRequest(row.id - 1).send({
      from: accounts[0],
    });
    router.push(`/campaigns/${router.query.address}/requests`);
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
                    <ListItemSecondaryAction>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={approve}
                      >
                        Approve
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem className={classes.nested}>
                    <ListItemText primary="Finalize this request" />
                    <ListItemSecondaryAction>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={finalize}
                      >
                        Finalize
                      </Button>
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
      <Grid item container direction="column" alignItems="stretch" xs sm md lg>
        <Box m={2} p={2}>
          <Grid item>
            <Typography variant="h5">New Spending Request?</Typography>
            <Typography variant="body1" style={{ margin: 10 }}>
              Make a new spending request for your campaign. Click the below
              button to create one
            </Typography>
            <Link href={`/campaigns/${address}/requests/new`}>
              <Button
                style={{ margin: 10, marginBottom: 40 }}
                variant="contained"
                color="primary"
              >
                Add Request
              </Button>
            </Link>
          </Grid>
          <Grid item>
            <ContributeForm
              address={address}
              minContribution={props.minimumContribution}
            />
          </Grid>
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
