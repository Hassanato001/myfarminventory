function Button({ children, variant = 'primary', ...props }) {
  return (
    <button className={`btn ${variant === 'secondary' ? 'secondary' : ''}`.trim()} {...props}>
      {children}
    </button>
  );
}

export default Button;
