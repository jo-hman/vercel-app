import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from 'yup';
import { jwtLocalStorageKey } from "../utils/jwtUtils";
import { createAccessCodeUrl, createUserUrl, defaultHeaders } from "../utils/api";

interface UserRequest {
    name: string;
    password: string;
}

const Login: React.FC<{
    checkExpiration: () => void;
}> = ({ checkExpiration })=> { 

    const [isError, setIsError] = useState(false);

    const userRequestInitialValues: UserRequest = {
        name: '',
        password: ''
    };
    const validation = Yup.object({
        name: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required'),
    });

    const registerHandler = (userRequest: UserRequest) => {
        fetch(createUserUrl, {
            'method': 'POST',
            'body': JSON.stringify({
                name: userRequest.name,
                password: userRequest.password
              }),
            'headers': defaultHeaders,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error();
            }
            return response.json();
        })
        .then(response => localStorage.setItem(jwtLocalStorageKey, response.accessCode))
        .then(() => checkExpiration())
        .catch(() => setIsError(true));
    };

    const loginHandler = (userRequest: UserRequest) => {
        fetch(createAccessCodeUrl, {
            'method': 'POST',
            'body': JSON.stringify({
                name: userRequest.name,
                password: userRequest.password
              }),
            'headers': defaultHeaders
        })
        .then(response => {
            if (!response.ok) {
                throw new Error();
            }
            return response.json();
        })
        .then(response => localStorage.setItem(jwtLocalStorageKey, response.accessCode))
        .then(() => checkExpiration())
        .catch(() => setIsError(true));
    }; 

    return (
        <Formik initialValues={userRequestInitialValues}
            validationSchema={validation}
            onSubmit={loginHandler}
            initialErrors={{'name': 'Required', 'password': 'Required'}}>
            {({ isValid, values }) => (
                <Form>
                    <div>
                        <label htmlFor='name'>Username:</label>
                        <Field type='text' id='name' name='name' />
                        <ErrorMessage name='name' component='div' />
                    </div>
                    <div>
                        <label htmlFor='password'>Password:</label>
                        <Field type='password' id='password' name='password' />
                        <ErrorMessage name='password' component='div' />
                    </div>
                    <div>
                        <button type="submit" disabled={!isValid} >Login</button>
                    </div>
                    <div>
                        <button type="button" disabled={!isValid} onClick={() => registerHandler(values)}>Register</button>
                    </div>
                    {isError && (
                        <div>
                            <p>You cannot log in, you have provided wrong credentials or you cannot register with already existing account</p>
                        </div>
                    )}
                </Form>
                )}
        </Formik>
    );
}

export default Login;