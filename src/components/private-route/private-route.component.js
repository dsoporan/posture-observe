import React from 'react';
import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import ResponsiveAppBar from "../app-bar/app-bar.component";

export default function PrivateRoute({
     component: RouteComponent
}) {
    const { currentUser } = useAuth();

    if (currentUser)
        return (
            <>
                <ResponsiveAppBar />
                <RouteComponent />
            </>
        )

    return <Navigate to="/login" />
}