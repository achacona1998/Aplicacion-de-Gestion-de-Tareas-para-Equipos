const Header = ({ title, subtitle }) => {
  return (
    <div className="mb-8">
      <h1 className="mb-2 text-3xl font-bold">{title}</h1>
      <p className="text-lg text-gray-600">{subtitle}</p>
    </div>
  );
};

export default Header;
