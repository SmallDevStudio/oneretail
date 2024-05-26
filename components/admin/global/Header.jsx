const Header = ({ title, subtitle }) => {
   
    return (
      <div className="mb-30">
        <h2
        >
          {title}
        </h2>
        <h5>
          {subtitle}
        </h5>
      </div>
    );
  };
  
  export default Header;