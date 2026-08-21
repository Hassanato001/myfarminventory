import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { Link } from 'react-router-dom';

function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'admin@example.com', password: 'Password123!' });
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card panel">
        <h1>Sign in</h1>
        <p className="muted">Enter login details to access the dashboard.</p>
        <form onSubmit={submit} className="page">
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error ? <div className="muted">{error}</div> : null}
          <Button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </Button>
          <Link to="/signup" className="muted">Create a new account</Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
