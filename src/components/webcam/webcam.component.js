import React, {useEffect, useRef, useState} from 'react';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import Webcam from 'react-webcam';
import {drawPoint, drawSegment} from "../../utils/draw-helper";
import {keypointConnections, landmarks_to_embedding, POINTS} from "../../utils/data";
import {Button, TextField} from "@mui/material";
import "./webcam.css"
import { useSpeechSynthesis } from 'react-speech-kit';

let isCorrectPosture = false;
let talkedCorrect = false;
let skeletonColor = 'rgb(255,255,255)';

export default function WebcamComponent({
  setStartedPose,
  pose: propsPose,
  sport
}){
  const [startingTime, setStartingTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [poseTime, setPoseTime] = useState(0);
  const [bestTime, setBestTime] = useState(0);
  const { speak } = useSpeechSynthesis();
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  console.log(sport);

  useEffect(() => {
    const timeDiff = (currentTime - startingTime) / 1000;
    if(isCorrectPosture) {
      setPoseTime(timeDiff)
    }
    if((currentTime - startingTime) / 1000 > bestTime) {
      setBestTime(timeDiff)
    }
  }, [currentTime])

  const CLASS_NO = {
    Chair: 0,
    Cobra: 1,
    Crunches: 2,
    Dog: 3,
    "High Kick": 4,
    No_Pose: 5,
    Plank: 6,
    "Prepare Fight": 7,
    "Shoulder Stand": 8,
    Triangle: 9,
    Tree: 10,
    Warrior: 11,
    Wushu: 12
  }

  // Load MoveNet
  const runMoveNet = async () => {
    // Load model with: SINGLEPOSE_THUNDER. A more accurate but slower single-pose detector.
    const detectorConfig = {modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER};
    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
    const poseClassifier = await tf.loadLayersModel('https://storage.googleapis.com/pose-classifier/model/model.json');

    setInterval(() => {
      detectPose(detector, poseClassifier);
    }, 100)
  }

  const detectPose = async (detector, poseClassifier) => {
    if (typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState === 4){

      //Get Video Properties
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      //Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      //Make Detections
      const pose = await detector.estimatePoses(webcamRef.current.video);

      drawCanvas(pose, poseClassifier, webcamRef.current.video, videoWidth, videoHeight);
    }
  }

  const drawCanvas = (pose, poseClassifier, video, videoWidth, videoHeight) => {
    const ctx = canvasRef.current.getContext('2d')
    let notDetected = 0

    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    // Clear the canvas -> transparent pixels
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    try {
      const keypoints = pose[0].keypoints
      let input = keypoints.map((keypoint) => {
        //Check the keypoint has a secure score
        if(keypoint.score > 0.4) {
          if(!(keypoint.name === 'left_eye' || keypoint.name === 'right_eye')) {
            drawPoint(ctx, keypoint.x, keypoint.y, 8, 'rgb(255,255,255)')
            let connections = keypointConnections[keypoint.name]
            try {
              connections.forEach((connection) => {
                let conName = connection.toUpperCase()
                drawSegment(ctx, [keypoint.x, keypoint.y],
                  [keypoints[POINTS[conName]].x,
                    keypoints[POINTS[conName]].y]
                  , skeletonColor)
              })
            } catch(err) {
              // console.log(err);
            }

          }
        } else {
          notDetected += 1
        }
        return [keypoint.x, keypoint.y]
      })
      if(notDetected > 4) {
        skeletonColor = 'rgb(255,255,255)'
        return
      }
      const processedInput = landmarks_to_embedding(input)
      const classification = poseClassifier.predict(processedInput);

      classification.array().then((data) => {
        const classNo = CLASS_NO[propsPose.title]
        if(data[0][classNo] > 0.97 ||
          (sport.title === "Fitness" && data[0][classNo] > 0.8) ||
          (sport.title === "Taekwondo" && data[0][classNo] > 0.4)) {
          if(!isCorrectPosture) {
            setStartingTime((new Date(Date())).getTime())
            isCorrectPosture = true;
            if(!talkedCorrect && poseTime > 1) {
              // speak({text: "Correct posture, keep it going!"})
              talkedCorrect = true;
            }
          }
          setCurrentTime((new Date(Date())).getTime())
          skeletonColor = 'rgb(0,255,0)'
        } else {
          if (talkedCorrect){
            // speak({ text: "Please correct your posture" })
            talkedCorrect = false;
          }
          isCorrectPosture = false;
          skeletonColor = 'rgb(255,255,255)'
        }
      })
    } catch(err) {
      // console.log(err)
    }
  }

  runMoveNet();

  return (
    <div
      style={{
        maxWidth: 640,
        marginTop: 50,
        display: "inline-block"
      }}>
      <div className={'pose-data-container'}>
        <TextField
          disabled
          id="outlined-disabled"
          label="Pose Time"
          value={poseTime + " seconds"}
        />
        <Button
          variant="outlined"
          color={'error'}
          className={'pose-button'}
          onClick={() => window.location.reload()}
        >
          Stop Pose
        </Button>
        <TextField
          disabled
          id="outlined-disabled"
          label="Personal Best Pose Time"
          value={bestTime + " seconds"}
        />
      </div>
      <Webcam
        ref={webcamRef}
        style={{
          position: "relative",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 640,
          height: 480,
          borderRadius: 25
        }}/>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 640,
          height: 480,
          borderRadius: 25
        }} />
    </div>
  )
}