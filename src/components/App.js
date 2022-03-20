import Signup from "./signup/signup.component";
import Dashboard from "./dashboard/dashboard.component";
import Login from './login/login.component';
import AuthProvider from "../contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./private-route/private-route.component";
import './styles/App.css';
import Profile from "./profile/profile.component";

function App() {
  return (
      <Router>
          <AuthProvider>
              <Routes>
                  <Route exact path={'/'} element={
                      <PrivateRoute component={Dashboard} />} />
                  <Route path={'/profile'} element={
                      <PrivateRoute component={Profile} /> } />
                  <Route path={'/signup'} element={<Signup />} />
                  <Route path={'/login'} element={<Login />} />
              </Routes>
          </AuthProvider>
      </Router>
  )
}

export default App;
