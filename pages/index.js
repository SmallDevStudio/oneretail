
const HomePage = ({ user }) => {
  if (!user) {
    return <p>Redirecting....</p>
  }

  return (
    <div>
      <h1>Welcome {user.name}</h1>
    </div>
  );
};


export default HomePage;