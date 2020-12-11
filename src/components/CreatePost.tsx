import { API, Auth } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { createPost } from '../graphql/mutations';

export const CreatePost = () => {
  const [postOwnerId, setPostOwnerId] = useState('');
  const [postOwnerUsername, setPostOwnerUsername] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');

  useEffect(() => {
    Auth.currentUserInfo().then((user) => {
      if (user) {
        setPostOwnerUsername(user.username);
        setPostOwnerId(user.attributes.sub)
      }
    });
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = {
      postOwnerId,
      postOwnerUsername,
      postTitle,
      postBody,
      createdAt: new Date().toISOString(),
    };
    await API.graphql({ query: createPost, variables: { input } });
  };

  return (
    <form className='Form' onSubmit={handleSubmit}>
      <input
        style={{ font: '19px' }}
        type='text'
        name='postTitle'
        placeholder='Post title'
        required
        onChange={(event: any) => setPostTitle(event.target.value)}
      />
      <textarea
        name='postBody'
        rows={3}
        cols={40}
        placeholder='New Blog Post'
        onChange={(event: any) => setPostBody(event.target.value)}
      />
      <button type='submit'> Submit </button>
    </form>
  );
};
