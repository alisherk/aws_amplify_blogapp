import { listPosts } from '../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { ListPostsQuery } from '../API';
import { GraphQLResult } from '@aws-amplify/api';
import { DeletePost } from './DeletePost';
import { EditPost } from './EditPost';
import {
  onCreateComment,
  onCreatePost,
  onDeletePost,
  onUpdatePost,
} from '../graphql/subscriptions';
import { CreateComment } from './CreateComment';
import { Comment } from './DisplayComment';

export const DipslayPosts = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    getPosts();
    const creListener = createPostListener();
    const delListener = createDeleteListener();
    const upListener = createUpdateListener();
    const comListener = createCommentListener();
    return () => {
      delListener.unsubscribe();
      creListener.unsubscribe();
      upListener.unsubscribe();
      comListener.unsubscribe();
    };
  }, []);

  const createPostListener = () =>
    //@ts-ignore
    API.graphql(graphqlOperation(onCreatePost)).subscribe({
      next: (postData: any) => {
        const newPost = postData.value.data.onCreatePost;
        setPosts((prev) => prev.concat(newPost));
      },
    });
  const createUpdateListener = () =>
    //@ts-ignore
    API.graphql(graphqlOperation(onUpdatePost)).subscribe({
      next: (postData: any) => {
        const newPost = postData.value.data.onUpdatePost;
        setPosts((prev) =>
          prev
            ? [...prev.filter((post: any) => post.id !== newPost.id), newPost]
            : [newPost]
        );
      },
    });

  const createDeleteListener = () =>
    //@ts-ignore
    API.graphql(graphqlOperation(onDeletePost)).subscribe({
      next: (postData: any) => {
        const deletedPost = postData.value.data.onDeletePost;
        setPosts((prev) =>
          prev.filter((post: any) => post.id !== deletedPost.id)
        );
      },
    });

  const createCommentListener = () =>
    //@ts-ignore
    API.graphql(graphqlOperation(onCreateComment)).subscribe({
      next: (commentData: any) => {
        const newComment = commentData.value.data.onCreateComment;
        setComments((prev) => prev.concat(newComment));
      },
    });

  const getPosts = async () => {
    const result = (await API.graphql(
      graphqlOperation(listPosts)
    )) as GraphQLResult<ListPostsQuery>;
    setPosts(result.data?.listPosts?.items as any);
  };

  return (
    <>
      {posts.map((post: any) => (
        <div key={post.id} style={rowStyle}>
          <h1> {post.postTitle} </h1>
          <span style={{ fontStyle: 'italic', color: '#0ca5e297' }}>
            {post.postOwnerUsername} {'on'}{' '}
            <time style={{ fontStyle: 'italic' }}>
              {' '}
              {new Date(post.createdAt).toDateString()}{' '}
            </time>{' '}
          </span>
          <p> {post.postBody} </p>
          <br />
          <DeletePost id={post.id} />
          <EditPost
            postId={post.id}
            postTitle={post.postTitle}
            postBody={post.postBody}
          />

          <span>
            <CreateComment postId={post.id} />
            <span>
              {comments.map((comment) => (
                <Comment
                  key={comment.id}
                  commentOwnerUsername={comment.commentOwnerUsername}
                  content={comment.content}
                  createdAt={comment.createdAt}
                />
              ))}
            </span>
          </span>
        </div>
      ))}
    </>
  );
};

const rowStyle = {
  background: '#f4f4f4',
  padding: '10px',
  border: '1px  #ccc dotted',
  margin: '14px',
};
