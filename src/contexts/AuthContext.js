import React, {useContext, useEffect, useState} from 'react';
import { auth } from '../firebase'
import {createTheme} from "@mui/material/styles";

export const AuthContext = React.createContext();

export function useAuth(){
    return useContext(AuthContext);
}

export default function AuthProvider({ children }){

    const [currentUser, setCurrentUser] = useState();
    const theme = createTheme();

    function signup(email, password){
        return auth.createUserWithEmailAndPassword(email, password);
    }

    function login(email, password){
        return auth.signInWithEmailAndPassword(email, password);
    }

    function logout() {
        return auth.signOut()
    }

    useEffect(() => {

        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
        });

        return unsubscribe;
    }, [])

    const value = {
        currentUser,
        signup,
        login,
        logout,
        theme
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}