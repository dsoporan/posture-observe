import * as tf from "@tensorflow/tfjs";

export const POINTS = {
  NOSE : 0,
  LEFT_EYE : 1,
  RIGHT_EYE : 2,
  LEFT_EAR : 3,
  RIGHT_EAR : 4,
  LEFT_SHOULDER : 5,
  RIGHT_SHOULDER : 6,
  LEFT_ELBOW : 7,
  RIGHT_ELBOW : 8,
  LEFT_WRIST : 9,
  RIGHT_WRIST : 10,
  LEFT_HIP : 11,
  RIGHT_HIP : 12,
  LEFT_KNEE : 13,
  RIGHT_KNEE : 14,
  LEFT_ANKLE : 15,
  RIGHT_ANKLE : 16,
}

export const keypointConnections = {
  nose: ['left_ear', 'right_ear'],
  left_ear: ['left_shoulder'],
  right_ear: ['right_shoulder'],
  left_shoulder: ['right_shoulder', 'left_elbow', 'left_hip'],
  right_shoulder: ['right_elbow', 'right_hip'],
  left_elbow: ['left_wrist'],
  right_elbow: ['right_wrist'],
  left_hip: ['left_knee', 'right_hip'],
  right_hip: ['right_knee'],
  left_knee: ['left_ankle'],
  right_knee: ['right_ankle']
}

export function get_center_point(landmarks, left_bodypart, right_bodypart) {
  let left = tf.gather(landmarks, left_bodypart, 1)
  let right = tf.gather(landmarks, right_bodypart, 1)
  return tf.add(tf.mul(left, 0.5), tf.mul(right, 0.5))
}

export function get_pose_size(landmarks, torso_size_multiplier=2.5) {
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

export function normalize_pose_landmarks(landmarks) {
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

export function landmarks_to_embedding(landmarks) {
  // normalize landmarks 2D
  landmarks = normalize_pose_landmarks(tf.expandDims(landmarks, 0))
  return tf.reshape(landmarks, [1, 34])
}