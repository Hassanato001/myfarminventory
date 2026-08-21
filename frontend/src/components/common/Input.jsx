function Input({ label, multiline = false, ...props }) {
  return (
    <label className="field">
      {label ? <span>{label}</span> : null}
      {multiline ? <textarea rows={props.rows || 4} {...props} /> : <input {...props} />}
    </label>
  );
}

export default Input;
