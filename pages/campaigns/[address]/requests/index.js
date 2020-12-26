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
  Grid,
  Link,
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
import ContributeForm from "../../../../components/ContributeForm";
import Campaign from "../../../../ethereum/campaign";
import web3 from "../../../../ethereum/web3";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
});

const columns = [
  { id: "id", label: "ID", minWidth: 20 },
  { id: "description", label: "Description", minWidth: 180 },
  {
    id: "value",
    label: "Amount(in Ether)",
    minWidth: 100,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "recipient",
    label: "Recipient",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "approvalCount",
    label: "Approval Count",
    minWidth: 100,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "approve",
    label: "Approve",
    minWidth: 120,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "finalize",
    label: "Finalize",
    minWidth: 120,
    align: "right",
    format: (value) => value.toFixed(2),
  },
];

function Requests(props) {
  const router = useRouter();
  const { address } = router.query;
  const classes = useStyles();
  return (
    <Box m={4}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={7} lg={8}>
          <Typography variant="h4" component="h2">
            Spending Requests
          </Typography>
          <Paper className={classes.root}>
            <TableContainer className={classes.container}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
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
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid
          container
          direction="column"
          alignItems="stretch"
          item
          xs
          sm
          md
          lg
        >
          <Grid item>
            <Box m={2} p={1} pt={6}>
              <Typography variant="h5">New Spending Request?</Typography>
              <Typography variant="body1" style={{ margin: 10 }}>
                Make a new spending request for your campaign. Click the below
                button to create one
              </Typography>
              <Link href={`/campaigns/${address}/requests/new`}>
                <Button
                  style={{ margin: 10 }}
                  variant="contained"
                  color="primary"
                >
                  Add Request
                </Button>
              </Link>
            </Box>
          </Grid>
          <Grid item>
            <ContributeForm
              address={address}
              minContribution={props.minimumContribution}
            />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

Requests.getInitialProps = async (ctx) => {
  const campaign = Campaign(ctx.query.address);
  const minimumContribution = await campaign.methods
    .minimumContribution()
    .call();
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
  return { minimumContribution, allRequests };
};

export default Requests;
