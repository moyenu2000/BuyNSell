const Button = ({ children, to = "/", className = "" }) => {
  return (
    <div className={"w-40 dark-bg py-2.5 text-center rounded " + className}>
      {children}
    </div>
  );
};

export default Button;
