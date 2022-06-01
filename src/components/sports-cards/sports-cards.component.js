import React from "react";
import {Grid, Paper, Typography, Button} from "@mui/material";
import "./sports-cards.css";
import {Link} from "react-router-dom";


export default function SportsCardsComponent({sports}) {

  return (
    <Grid className={"sports-container"} sx={{ flexGrow: 1 }} container spacing={2}>
      <Grid item xs={12}>
        <Grid className={"sports-cards-container"} container justifyContent="center" spacing={8}>
          {sports.map((sport) => (
            <Grid key={sport.title} className={"sports-item"} item>
              <Paper
                style={{borderRadius: "15px"}}
                elevation={8}
                sx={{
                  height: 350,
                  width: 300,
                }}
              >
                <div className={"image-card-container"}>
                  <img className={"sports-image"} src={sport.image} alt={sport.title} />
                </div>
                <div className={"card-text-container"}>
                  <Typography variant="h6" gutterBottom component="div">
                    {sport.title}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {sport.description}
                  </Typography>
                  <Link to={'/exercise/' + sport.title} className={'link-button'} >
                    <Button fullWidth variant="contained">{sport.CTA}</Button>
                  </Link>
                </div>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  )
}