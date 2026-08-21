function PagePlaceholder({ title, description }) {
  return (
    <div className="page">
      <h1 className="page-title">{title}</h1>
      <p className="muted">{description}</p>
    </div>
  );
}

export default PagePlaceholder;
