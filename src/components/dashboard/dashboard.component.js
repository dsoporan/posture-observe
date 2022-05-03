import React from 'react';
import { useAuth} from "../../contexts/AuthContext";
import WebcamComponent from "../webcam/webcam.component";
import SportsCardsComponent from "../sports-cards/sports-cards.component";
import "./dashboard.css";

export default function Dashboard(){

    const { currentUser } = useAuth();
    return (
        <div className={"dashboard-container"}>
            {/*DASHBOARD {currentUser.email}*/}
          <SportsCardsComponent />
          {/*  <WebcamComponent />*/}
        </div>
    )
}