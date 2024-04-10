import cookie from 'cookie';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { username, email, password } = req.body;
  console.log(req.body);
  const response = await fetch('http://localhost:4000/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });

  if (response.ok) {
    res.json({ message: 'Registration successful' });
  } else {
    const error = await response.text();
    res.status(400).json({ message: `Registration failed: ${error}` });
  }
}