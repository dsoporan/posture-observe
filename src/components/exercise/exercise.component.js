import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import ExerciseDetails from "../exercise-details/exercise-details.component";
import firebase from "firebase";

export default function Exercise() {

  const { sportParam } = useParams();
  const [sport, setSport] = useState('');
  const sportCollectionRef = firebase.firestore().collection("sports");

  useEffect(() => {
    getSport();
  }, [sportParam])

  const getSport = () => {
    sportCollectionRef.onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data().title.toLowerCase() === sportParam.toLowerCase()){
          setSport(doc.data());
          return;
        }
      })
    })
  }

  return (
    <div>
      {sport !== '' &&
        <ExerciseDetails sport={sport}/>
      }
    </div>
  )
}