import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { email, password } = req.body;
  const response = await fetch('http://localhost:4000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (response.ok) {
    const { token, userResponse } = await response.json();
    
    console.log('userResponse:', userResponse);

    res.setHeader('Set-Cookie', [
      cookie.serialize('auth', token, {
        httpOnly: false,
        //secure: process.env.NODE_ENV !== 'development',
        secure: true,
        //sameSite: 'strict',
        sameSite: 'none',
        maxAge: 3600,
        path: '/'
      }),
      cookie.serialize('user', JSON.stringify(userResponse), {
        httpOnly: false,
        //secure: process.env.NODE_ENV !== 'development',
        secure: true,
        //sameSite: 'lax',
        sameSite: 'none',
        maxAge: 3600,
        path: '/'
      })
    ]);
    res.json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
}