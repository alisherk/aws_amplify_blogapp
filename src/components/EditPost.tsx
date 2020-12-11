import { Auth } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { callGraphQL } from '../utils/callGraphQL';
import { updatePost } from '../graphql/mutations';

interface Props {
  postId: string;
  postTitle: string;
  postBody: string;
}

export const EditPost: React.FC<Props> = ({ postId, postTitle, postBody }) => {
  const [state, setState] = useState({
    show: false,
    postOwnerId: '',
    postOwnerUsername: '',
    postTitle: postTitle,
    postBody: postBody,
  });

  useEffect(() => {
    Auth.currentUserInfo().then((user) => {
      setState((state) => ({
        ...state,
        postOwnerUsername: user.username,
        postOwnerId: user.attributes.sub,
      }));
    });
  }, []);

  const handleModal = () => {
    setState((state) => ({ ...state, show: !state.show }));
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState((state) => ({
      ...state,
      [event.target.name]: event.target.value,
    }));
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = {
      id: postId,
      postOwnerId: state.postOwnerId, 
      postTitle: state.postTitle, 
      postBody: state.postBody
    };
    await callGraphQL<void>(updatePost, { input })
    setState(state => ({ ...state, show: !state.show }));
  };

  return (
    <>
      {state.show && (
        <div className='modal'>
          <button className='close' onClick={handleModal}>
            X
          </button>
          <form className='add-post' onSubmit={handleUpdate}>
            <input
              type='text'
              placeholder='Title'
              name='postTitle'
              value={state.postTitle}
              onChange={handleChange}
            />
            <input
              type='text'
              name='postBody'
              value={state.postBody}
              onChange={handleChange}
            />
            <button>Update post</button>
          </form>
        </div>
      )}
      <button onClick={handleModal}> Edit </button>
    </>
  );
};
