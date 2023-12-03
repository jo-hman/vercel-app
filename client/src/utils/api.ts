const baseUrl = 'http://localhost:5000';

export const createAccessCodeUrl = baseUrl + '/users/accessCodes';

export const createUserUrl = baseUrl + '/users';
export const getUsersUrl = createUserUrl;
export const getPostsUrl = baseUrl + '/posts';
export const createPostUrl = getPostsUrl;
export const createCommentUrl = getPostsUrl + '/postId/comments';
export const getCommentsUrl = createCommentUrl;
export const deletePostUrl = getPostsUrl + '/postId';


export const defaultHeaders = {'Access-Control-Allow-Headers': '*', 'Content-Type': 'application/json'};
