import React, {useEffect, useState} from 'react';
import {Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Typography} from "@mui/material";
import './exercise-details.css'
import WebcamComponent from "../webcam/webcam.component";

export default function ExerciseDetails({ sport }) {

  const [posture, setPosture] = useState('');
  const [startedPose, setStartedPose] = useState(false);

  useEffect(() => {
    setPosture(sport?.postures[0]);
  }, [sport])

  const handleChange = (e) => {
    console.log(e.target.value);
  }

  const handleStartPose = () => {
    setStartedPose(true);
  }

  console.log(sport);
  console.log(posture);

  return (
    <div className={'exercise-container-wrapper'}>
      { !startedPose ? (
          <FormControl className={'select-container'}>
            <InputLabel id="demo-simple-select-label">Posture</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={posture && posture.title}
              label="Posture"
              onChange={handleChange}
            >
              {sport.postures.map((postureElem) =>
                <MenuItem key={postureElem.title} value={postureElem.title}>{postureElem.title}</MenuItem>
              )}
            </Select>
            <Button variant="outlined" className={'pose-button'} onClick={handleStartPose}>Start Pose</Button>
          </FormControl>
        ) : (
          <WebcamComponent
            pose={posture}
            setStartedPose={setStartedPose}
          />
        )}
        <div className={'exercise-container'}>
            <Paper className={'exercise-details'} elevation={24}>
              <Typography
                className={'text-details'}
                variant="body1"
                gutterBottom
                dangerouslySetInnerHTML={{ __html: posture?.description }}>
              </Typography>
            </Paper>
            <Paper className={'exercise-image'} elevation={24}>
              <img
                className={'exercise-posture'}
                src={posture.image}
                alt={posture.title}
              />
            </Paper>
        </div>
    </div>
  )
}