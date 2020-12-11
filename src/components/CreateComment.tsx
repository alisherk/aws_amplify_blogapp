import { Auth } from 'aws-amplify';
import { useState, useEffect } from 'react';
import { createComment } from '../graphql/mutations';
import { callGraphQL } from '../utils/callGraphQL';

export const CreateComment: React.FC<{ postId: string }> = ({ postId }) => {
  const [state, setState] = useState<any>({
    commentOwnerId: '',
    commentOwnerUsername: '',
    content: '',
  });

  useEffect(() => {
    Auth.currentUserInfo().then((user) => {
      setState((state: any) => ({
        ...state,
        commentOwnerId: user.attributes.sub,
        commentOwnerUsername: user.username,
      }));
    });
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState((state: any) => ({
      ...state,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = {
      commentPostId: postId,
      commentOwnerId: state?.commentOwnerId,
      commentOwnerUsername: state?.commentOwnerUsername,
      content: state?.content,
      createdAt: new Date().toISOString(),
    };
    await callGraphQL(createComment, { input });
    setState(null)
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        rows={3}
        cols={40}
        required
        name='content'
        placeholder='Add comment'
        onChange={handleChange}
      />
      <button> Comment </button>
    </form>
  );
};
