const Header = ({ title, subtitle }) => {
   
    return (
      <div className="mb-2 ml-5">
        <h2 className="text-2xl font-bold text-[#0056FF]">
          {title}
        </h2>
        <h5 className="text-gray-400 text-sm">
          {subtitle}
        </h5>
      </div>
    );
  };
  
  export default Header;