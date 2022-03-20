import { validateEmail } from "./validateContent";

export const validateSignup = (fields) => {
    const { firstName, lastName, email, password } = fields;
    const errors = {
        firstName: firstName.length === 0 ? 'First Name cannot be empty.' : '',
        lastName: lastName.length === 0 ? 'Last Name cannot be empty.' : '',
        email: email.length === 0 ? 'Email cannot be empty.' : validateEmail(email) ? '' : 'Email not valid.',
        password: password.length < 6 ? 'Password cannot be shorter than 6 characters.' : ''
    }
    return {
        isError: errors.firstName.length !== 0 || errors.lastName.length !== 0 || errors.email.length !== 0 || errors.password.length !== 0,
        errors
    }
}
