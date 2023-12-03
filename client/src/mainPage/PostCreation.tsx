import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from 'yup';
import { createPostUrl, defaultHeaders } from "../utils/api";
import { extractJwtPayload, jwtLocalStorageKey } from "../utils/jwtUtils";

interface PostRequest {
    title: string;
    content: string;
}

const PostCreation = () => {

    const [isError, setIsError] = useState(false);

    const userRequestInitialValues: PostRequest = {
        title: '',
        content: ''
    };
    const validation = Yup.object({
        title: Yup.string().required('Title is required'),
        content: Yup.string().required('Content is required'),
    });

    const postCreationHandler = (postRequest: PostRequest) => {
        fetch(createPostUrl, {
            'method': 'POST',
            'body': JSON.stringify({
                name: extractJwtPayload(localStorage.getItem(jwtLocalStorageKey)).name,
                postTitle: postRequest.title,
                postContent: postRequest.content
              }),
            'headers': defaultHeaders
        })
        .then(response => {
            if (!response.ok) {
                throw new Error();
            }
            window.location.reload();
        })
        .catch(() => setIsError(true));
    }; 


    return (
        <div>
            <p>Create your post:</p>
            <Formik initialValues={userRequestInitialValues}
                validationSchema={validation}
                onSubmit={postCreationHandler}
                initialErrors={{'name': 'Required', 'password': 'Required'}}>
                {({ isValid, values }) => (
                    <Form>
                        <div>
                            <label htmlFor='title'>Title:</label>
                            <Field type='text' id='title' name='title' />
                            <ErrorMessage name='title' component='div' />
                        </div>
                        <div>
                            <label htmlFor='content'>Content:</label>
                            <Field type='text' id='content' name='content' />
                            <ErrorMessage name='content' component='div' />
                        </div>
                        <div>
                            <button type="submit" disabled={!isValid} >Create post</button>
                        </div>
                        {isError && (
                            <div>
                                <p>Error when creating a post</p>
                            </div>
                        )}
                    </Form>
                    )}
            </Formik>
        </div>
    );
}

export default PostCreation;