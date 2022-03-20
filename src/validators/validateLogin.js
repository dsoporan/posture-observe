import { validateEmail } from "./validateContent";

export const validateLogin = (fields) => {
    const { email, password } = fields;
    const errors = {
        email: email.length === 0 ? 'Email cannot be empty.' : validateEmail(email) ? '' : 'Email not valid.',
        password: password.length === 0 ? 'Password cannot be empty.' : ''
    }
    return {
        isError: errors.email.length !== 0 || errors.password.length !== 0,
        errors
    }
}