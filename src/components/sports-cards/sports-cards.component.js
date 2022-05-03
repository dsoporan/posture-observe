import React from "react";
import {Grid, Paper, Typography, Button} from "@mui/material";
import "./sports-cards.css";


export default function SportsCardsComponent() {
  return (
    <Grid className={"sports-container"} sx={{ flexGrow: 1 }} container spacing={2}>
      <Grid item xs={12}>
        <Grid className={"sports-cards-container"} container justifyContent="center" spacing={8}>
          <Grid className={"sports-item"} item>
            <Paper
              style={{borderRadius: "15px"}}
              elevation={8}
              sx={{
                height: 350,
                width: 300,
              }}
            >
              <div className={"image-card-container"}>
                <img className={"sports-image"} src={"https://voifibine.ro/wp-content/uploads/2022/02/yoga2.jpg"} alt={"Yoga"} />
              </div>
              <div className={"card-text-container"}>
                <Typography variant="h6" gutterBottom component="div">
                  Yoga
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Grup de practici fizice, exerciții de respirație, concentrare și meditație.
                </Typography>
                <Button variant="contained">Exerciții</Button>
              </div>
            </Paper>
          </Grid>
          <Grid className={"sports-item"} item>
            <Paper
              style={{borderRadius: "15px"}}
              elevation={8}
              sx={{
                height: 350,
                width: 300,
              }}
            >
              <div className={"image-card-container"}>
                <img className={"sports-image"} src={"https://www.wellandgood.com/wp-content/uploads/2020/02/Stocksy-Jacob-Lund-plank-hold.jpg"} alt={"Fitness"} />
              </div>
              <div className={"card-text-container"}>
                <Typography variant="h6" gutterBottom component="div">
                  Fitness
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Capacitatea de a efectua aspecte ale sportului, ocupațiilor și activităților zilnice.
                </Typography>
                <Button variant="contained">Exerciții</Button>
              </div>
            </Paper>
          </Grid>
          <Grid className={"sports-item"} item>
            <Paper
              style={{borderRadius: "15px"}}
              elevation={8}
              sx={{
                height: 350,
                width: 300,
              }}
            >
              <div className={"image-card-container"}>
                <img className={"sports-image"} src={"https://hongikmartialarts.com/wp-content/uploads/2015/09/6_4_taekwondo.jpg"} alt={"Taekwondo"} />
              </div>
              <div className={"card-text-container"}>
                <Typography variant="h6" gutterBottom component="div">
                  Taekwondo
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Artă marțială coreeană, caracterizată în special prin lovituri înalte cu piciorul și lovituri cu pumnul.
                </Typography>
                <Button variant="contained">Exerciții</Button>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}