/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import { Box, Grid } from "@material-ui/core";
import React, { Component } from "react";
import factory from "../ethereum/factory";
import CampaignCard from "../components/CampaignCard";

class CampaignHome extends Component {
  static async getInitialProps() {
    // const campaigns = await factory.methods.getDeployedCampaigns().call();
    const campaigns = ["sdjghbvdjfghbn", "nkjsdghvbdj", "jkgfsdjgkhfbgjhdn"];
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
        <Grid item xs={12} sm={7} md={9} lg={10}>
          <Box m={3}>
            {this.renderCampaigns().map((campaign) => (
              <CampaignCard key={campaign.header} campaign={campaign} />
            ))}
          </Box>
        </Grid>
        <Grid item xs={12} sm={5} md={3} lg={2}>
          <Box m={3}>Right</Box>
        </Grid>
      </Grid>
    );
  }
}

export default CampaignHome;
