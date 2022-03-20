import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {useAuth} from "../../contexts/AuthContext";

//Material-UI
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {validateLogin} from "../../validators/validateLogin";
import Alert from "@mui/material/Alert";

export default function Login(){
    const { login } = useAuth();
    const theme = createTheme();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [unexpectedError, setUnexpectedError] = useState('');
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate();

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const  handleSubmit = async (event) => {
        event.preventDefault();
        console.log({
            email,
            password
        });
        const validateData = validateLogin({ email, password });
        setErrors(validateData.errors);
        if (!validateData.isError){
            try {
                await login(email, password);
                navigate('/');
            }
            catch {
                setUnexpectedError('Failed to log in, please try again.')
            }
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={handleEmailChange}
                            error={errors.email.length !== 0}
                            helperText={errors.email}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={handlePasswordChange}
                            error={errors.password.length !== 0}
                            helperText={errors.password}
                        />
                        {unexpectedError.length !== 0 ? (<Alert severity="error">{unexpectedError}</Alert>) : '' }
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link to={'/signup'} variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}