import React, {useEffect, useRef, useState} from 'react';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import Webcam from 'react-webcam';
import {drawPoint, drawSegment} from "../../utils/draw-helper";
import {keypointConnections, POINTS} from "../../utils/data";
import {Button, FormControl, TextField} from "@mui/material";
import "./webcam.css"
import { useSpeechSynthesis } from 'react-speech-kit';

let isCorrectPosture = false;
let talkedCorrect = false;
let talkedIncorrect = false;

export default function WebcamComponent({ setStartedPose, pose: propsPose }){
  const [startingTime, setStartingTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [poseTime, setPoseTime] = useState(0);
  const [bestTime, setBestTime] = useState(0);
  const { speak } = useSpeechSynthesis();
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  let skeletonColor = 'rgb(255,255,255)';

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
    High_kick: 4,
    No_Pose: 5,
    Plank: 6,
    Prepare_fight: 7,
    Shoulder_stand: 8,
    Triangle: 9,
    Tree: 10,
    Warrior: 11,
    Wushu: 12
  }

  function get_center_point(landmarks, left_bodypart, right_bodypart) {
    let left = tf.gather(landmarks, left_bodypart, 1)
    let right = tf.gather(landmarks, right_bodypart, 1)
    return tf.add(tf.mul(left, 0.5), tf.mul(right, 0.5))

  }

  function get_pose_size(landmarks, torso_size_multiplier=2.5) {
    let hips_center = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP)
    let shoulders_center = get_center_point(landmarks,POINTS.LEFT_SHOULDER, POINTS.RIGHT_SHOULDER)
    let torso_size = tf.norm(tf.sub(shoulders_center, hips_center))
    let pose_center_new = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP)
    pose_center_new = tf.expandDims(pose_center_new, 1)

    pose_center_new = tf.broadcastTo(pose_center_new,
      [1, 17, 2]
    )
    // return: shape(17,2)
    let d = tf.gather(tf.sub(landmarks, pose_center_new), 0, 0)
    let max_dist = tf.max(tf.norm(d,'euclidean', 0))

    // normalize scale
    return tf.maximum(tf.mul(torso_size, torso_size_multiplier), max_dist)
  }

  function normalize_pose_landmarks(landmarks) {
    let pose_center = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP)
    pose_center = tf.expandDims(pose_center, 1)
    pose_center = tf.broadcastTo(pose_center,
      [1, 17, 2]
    )
    landmarks = tf.sub(landmarks, pose_center)

    let pose_size = get_pose_size(landmarks)
    landmarks = tf.div(landmarks, pose_size)
    return landmarks
  }

  function landmarks_to_embedding(landmarks) {
    // normalize landmarks 2D
    landmarks = normalize_pose_landmarks(tf.expandDims(landmarks, 0))
    return tf.reshape(landmarks, [1, 34])
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
        // console.log(data[0]);
        if(data[0][classNo] > 0.97) {
          // console.log("POSE: ", propsPose.title);
          // console.log("Acc: ", data[0][classNo]);
          if(!isCorrectPosture && !talkedCorrect && talkedIncorrect) {
            setStartingTime(new Date(Date()).getTime())
            isCorrectPosture = true;
            speak({ text: "Correct posture, keep it going!" })
            talkedCorrect = true;
            talkedIncorrect = false;
          }
          setCurrentTime(new Date(Date()).getTime())
          skeletonColor = 'rgb(0,255,0)'
        } else {
          if (!talkedIncorrect){
            speak({ text: "Please correct your posture" })
            talkedIncorrect = true;
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
          onClick={() => setStartedPose(false)}
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