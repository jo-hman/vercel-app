import { useEffect, useState } from "react";
import { createCommentUrl, defaultHeaders, deletePostUrl, getCommentsUrl, getPostsUrl, getUsersUrl } from "../utils/api";
import { extractJwtPayload, jwtLocalStorageKey } from "../utils/jwtUtils";
import PostCreation from "./PostCreation";
import Comments from "./Comments";

interface User {
    name: string
}

interface Post {
    id: string;
    name: string;
    title: string;
    content: string;
}

const MainPage= ()=> { 

    const [users, setUsers] = useState<User[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);

    const [comment, setComment] = useState('');


    useEffect(() => {
        fetchUsers();
        fetchPosts();
    }, []);

    const fetchUsers = () => {
        const mapResponseToUsers = (response: any): User[] => {
            return response.map((user: User) => {
                return {name: user.name}
            });
        };

        fetch(getUsersUrl, {
            'method': 'GET',
            'headers': defaultHeaders,
        })
        .then(response => response.json())
        .then(response => setUsers(mapResponseToUsers(response)));
    }

    const fetchPosts = () => {
        const mapResponseToPosts = (response: any): Post[] => {
            return response.map((post: Post) => post);
        };

        fetch(getPostsUrl, {
            'method': 'GET',
            'headers': defaultHeaders,
        })
        .then(response => response.json())
        .then(response => setPosts(mapResponseToPosts(response)));
    }

    const handleComment = (event: React.KeyboardEvent<HTMLInputElement>, postId: string) => {
        if (event.key === 'Enter') {
            fetch(createCommentUrl.replace('postId', postId), {
                'method': 'POST',
                'body': JSON.stringify({
                    name: extractJwtPayload(localStorage.getItem(jwtLocalStorageKey)).name,
                    commentText: comment,
                }),
                'headers': defaultHeaders
            })
            .then(response => {
                setComment('');
                window.location.reload();
            })
            .catch(() => setComment(''));
        }
    }

    const handleLogOut = () => {
        localStorage.removeItem(jwtLocalStorageKey);
        window.location.reload();
    }

    const handlePostRemove = (postId: string) => {
        console.log('dupa', postId);
        fetch(deletePostUrl.replace('postId', postId), {
            'method': 'DELETE',
            'headers': defaultHeaders,
        })
        .then(response => {
            if(response.status === 200) {
                window.location.reload()
            }
        })
        .catch(err => console.log(err));
    }

    return (
        <>
            <div>
                <p>You are logged in as: {extractJwtPayload(localStorage.getItem(jwtLocalStorageKey)).name}</p>
                <button type="submit" onClick={handleLogOut}>LOG OUT</button>
                <PostCreation />
            </div>
            <div style={{ display: 'flex'}}>
                <div>
                    <p>Users list</p>
                    {
                        users.map((user) => {
                            return (
                                <div>
                                    <p>{user.name}</p>
                                </div>
                            );
                        })
                    }
                </div>
                <p>-------------</p>
                <div>
                    <p>Posts list:</p>
                    {posts.map((post) => (
                        <div style={{
                            position: 'relative',
                            padding: '20px', // Adjust padding as needed
                            border: '2px solid #000', // Border color and width
                            borderRadius: '10px', // Adjust border-radius for rounded corners
                        }}>
                            <p>------------------</p>
                            <div key={post.id}>
                                <p>Title: {post.title} Author: {post.name}</p>
                                <p>Content: {post.content}</p>
                                { extractJwtPayload(localStorage.getItem(jwtLocalStorageKey)).name === post.name ?
                                    (<button type="submit" onClick={event => handlePostRemove(post.id)}>Remove your post</button>) : (<div></div>)
                                }
                                <p>Comments:</p>

                                <Comments postId={post.id}/>

                                <input 
                                    type='text'
                                    value={comment}
                                    onChange={event => setComment(event.target.value)}
                                    onKeyDown={event => handleComment(event, post.id)}
                                    placeholder='Add a comment' />
                            </div>
                            <p>------------------</p>
                        </div>
                            
                    ))}
                </div>
            </div>
        </>
            
    );
}

export default MainPage;