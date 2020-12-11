import { deletePost as deletePostMutation } from '../graphql/mutations'; 
import { callGraphQL } from '../utils/callGraphQL';


export const DeletePost: React.FC<{ id: string}> = ({ id }): JSX.Element => {
  const handleDeletePost = async (id: string): Promise<void> => {
    const input = { id };
    await callGraphQL<void>(deletePostMutation, { input })
  };
  return <button onClick={() => handleDeletePost(id)}> Delete </button>;
};
