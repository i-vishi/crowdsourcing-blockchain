/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/prop-types */
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Link,
} from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    margin: 10,
  },
});

export default function CampaignCard({ campaign }) {
  const classes = useStyles();

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography variant="h5" component="h2">
          {campaign.header}
        </Typography>
      </CardContent>
      <CardActions>
        <Link
          href={`/campaigns/${campaign.header}`}
          style={{ textDecoration: "none" }}
        >
          <Button variant="contained" size="small" color="primary">
            View Campaign
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}
