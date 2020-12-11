interface Props {
  commentOwnerUsername: string;
  createdAt: string;
  content: string;
}

export const Comment: React.FC<Props> = ({
  commentOwnerUsername,
  createdAt,
  content,
}) => {
  return (
    <div className='comment'>
      <span style={{ fontStyle: 'italic' }}>
        {commentOwnerUsername}
        <time style={{ fontStyle: 'italic' }}>
          {' '}
          {new Date(createdAt).toDateString()}
        </time>
        <p> {content}</p>
      </span>
    </div>
  );
};
