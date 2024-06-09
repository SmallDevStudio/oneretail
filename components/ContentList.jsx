import Link from 'next/link';

const ContentList = ({ contents }) => {
  return (
    <div>
      {contents.map(content => (
        <div key={content._id} className="content-item">
          <h2>{content.title}</h2>
          <p>{content.description}</p>
          <Link href={`/posts/content/${content._id}`}>
            <span>Read More</span>
          </Link>
          <Link href={`/posts/content/${content._id}/edit`}>
            <button>Edit</button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ContentList;