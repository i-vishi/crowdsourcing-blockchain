/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Link,
  Typography,
} from "@material-ui/core";
import web3 from "../../../ethereum/web3";
import Campaign from "../../../ethereum/campaign";
import ContributeForm from "../../../components/ContributeForm";

function ShowCampaign(props) {
  const router = useRouter();
  const { address } = router.query;

  const summary = [
    {
      header: address,
      meta: "Campaign Address",
      description:
        "The address of the contract of this campaign on Rinkeby Test Network",
    },
    {
      header: props.manager,
      meta: "Address of Manager",
      description: "Owner of this campaign and can create spending requests",
    },
    {
      header: web3.utils.fromWei(props.bal, "ether"),
      meta: "Current Balance (ether)",
      description: "The Balance of this campaign",
    },
    {
      header: props.minimumContribution,
      meta: "Minimum Contribution (Wei)",
      description:
        "The minimum amount in Wei to contribute to this campaign",
    },
    {
      header: props.approversCnt,
      meta: "Total Approvers",
      description: "Number of people who have funded this campaign",
    },
    {
      header: props.reqCnt,
      meta: "Total Requests",
      description:
        "Number of Spending Requests made by the manager of this campaign",
    },
  ];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={7} lg={8}>
        <Typography variant="h4" component="h2">
          Campaign Details
        </Typography>
        <Grid
          container
          spacing={2}
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
        >
          {summary.map((detail) => (
            <Grid item xs={12} md={6} lg={6} key={detail.meta}>
              <Card
                style={{
                  height: 180,
                  margin: 10,
                  overflowWrap: "break-word",
                }}
                variant="outlined"
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    component="h4"
                    style={{ marginBottom: 10 }}
                  >
                    {detail.header}
                  </Typography>
                  <Typography
                    style={{ marginBottom: 12 }}
                    color="textSecondary"
                  >
                    {detail.meta}
                  </Typography>
                  <Typography variant="body1" component="p">
                    {detail.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
          <Grid item xs={12} md={6} lg={6}>
            <Link
              href={`/campaigns/${address}/requests`}
              style={{ textDecoration: "none" }}
            >
              <Button
                style={{ margin: 10 }}
                variant="contained"
                color="primary"
              >
                View Requests
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs sm md lg>
        <Box m={2} p={2}>
          <ContributeForm
            address={address}
            minContribution={props.minimumContribution}
          />
        </Box>
      </Grid>
    </Grid>
  );
}

ShowCampaign.getInitialProps = async (ctx) => {
  const campaign = Campaign(ctx.query.address);
  const minimumContribution = await campaign.methods
    .minimumContribution()
    .call();
  const manager = await campaign.methods.manager().call();
  const approversCnt = await campaign.methods.approversCount().call();
  const reqCnt = await campaign.methods.numRequests().call();
  const bal = await web3.eth.getBalance(ctx.query.address);
  return {
    minimumContribution,
    manager,
    approversCnt,
    reqCnt,
    bal,
  };
};

export default ShowCampaign;
