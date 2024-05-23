import useLine from "@/lib/hook/useLine";
const HomePage = (props) => {
  const { liffObject, status, } = props

  const { logout, login, idtokens, accessTokens } = useLine();

  if (status !== 'inited') {
    return (
      <>
        <h1>Login</h1>
        <button className="btn btn-primary" onClick={login}>Login</button>
      </>
    )
  }

  return (
    <>
      <h1>Home</h1>
      <button className="btn btn-primary" onClick={logout}>Logout</button>
    </>
  )
    
}
export default HomePage;