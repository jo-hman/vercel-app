import { useEffect, useState } from "react";
import { defaultHeaders, getCommentsUrl } from "../utils/api";

interface Comment {
    name: string;
    text: string;
}

const Comments: React.FC<{
    postId: string;
}> = ({ postId })=> { 

    const [comments, setComments] = useState<Comment[]>([]);

    const fetchComments= () => {
        const mapResponseToComments = (response: any): Comment[] => {
            return response.map((post: Comment) => post);
        };

        fetch(getCommentsUrl.replace('postId', postId), {
            'method': 'GET',
            'headers': defaultHeaders,
        })
        .then(response => response.json())
        .then(response => {
            setComments(mapResponseToComments(response));
        })
        .catch(err => console.log(err));
    }

    useEffect(() => {
        fetchComments();
    }, []);

    return (
        <>
            {
                comments
                    .map(comment => {
                        return (
                            <div>
                                <p>---</p>
                                <p>Comment Author: {comment.name}</p>
                                <p>Comment text: {comment.text}</p>
                            </div>
                        );
                    })
            }
        </>
    )
} 

export default Comments;