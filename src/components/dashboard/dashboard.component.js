import React, {useEffect, useState} from 'react';
import { useAuth} from "../../contexts/AuthContext";
import WebcamComponent from "../webcam/webcam.component";
import SportsCardsComponent from "../sports-cards/sports-cards.component";
import "./dashboard.css";
import firebase from "firebase";

export default function Dashboard(){
    const sportCollectionRef = firebase.firestore().collection("sports");
    const { currentUser } = useAuth();
    const [sports, setSports] = useState([]);

    useEffect(() => {
        getSports();
    }, [])

    const getSports = () => {
        sportCollectionRef.onSnapshot((querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push(doc.data());
            })
            setSports(items);
        })
    }

    console.log(sports);

    return (
        <div className={"dashboard-container"}>
            {/*DASHBOARD {currentUser.email}*/}
          <SportsCardsComponent sports={sports}/>
          {/*  <WebcamComponent />*/}
        </div>
    )
}