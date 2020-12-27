/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Link,
  Typography,
} from "@material-ui/core";
import React, { Component } from "react";
import factory from "../ethereum/factory";
import CampaignCard from "../components/CampaignCard";

class CampaignHome extends Component {
  static async getInitialProps() {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    return { campaigns };
  }

  renderCampaigns() {
    const items = this.props.campaigns.map((address) => ({
      header: address,
      description: "some details",
    }));
    return items;
  }

  render() {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={7} lg={8}>
          <Typography variant="h4" component="h2">
            All Campaigns
          </Typography>
          {this.renderCampaigns().map((campaign) => (
            <CampaignCard key={campaign.header} campaign={campaign} />
          ))}
        </Grid>
        <Grid item xs sm md lg>
          <Box m={2} p={2}>
            <Card style={{ minWidth: 275 }} variant="outlined">
              <CardContent>
                <Typography variant="h5" style={{ marginBottom: 10 }}>
                  Create a campaign?
                </Typography>
                <Typography variant="body1">
                  You can create a new campaign very easily. Click the below
                  button to proceed
                </Typography>
              </CardContent>
              <CardActions>
                <Link href="/campaigns/new" style={{ textDecoration: "none" }}>
                  <Button
                    style={{ margin: 10 }}
                    variant="contained"
                    color="primary"
                  >
                    Create Campaign
                  </Button>
                </Link>
              </CardActions>
            </Card>
          </Box>
        </Grid>
      </Grid>
    );
  }
}

export default CampaignHome;
