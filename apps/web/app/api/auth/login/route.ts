import bcrypt from 'bcryptjs';
import sign from 'jsonwebtoken';
import { prisma } from "../../../../../../packages/db/src/client";

export async function POST(req: Request) {
    console.log("Login API called");
  try {
    // Parse request body
    const { email, password } = await req.json();
    console.log("parsed body");
    
    if (!email || !password) {
      return new Response(
        JSON.stringify({
          error: 'Email and password are required'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
    console.log('User found:', user);
    
    // Check if user exists
    if (!user) {
      return new Response(
        JSON.stringify({
          error: 'Invalid email or password'
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Verify password (in production, use bcrypt.compare)
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    const isPasswordValid = password === user.password; // Temporary simplified check

    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({
          error: 'Invalid email or password'
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Generate JWT token
    const token = sign(
      { 
        userId: user.id,
        email: user.email
      },
      process.env.JWT_SECRET || 'fallback_secret_key_for_development',
      { expiresIn: '30m' }
    );
    
    console.log('User logged in:', user.email);
    
    // Return the token and user info (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    
    return new Response(
      JSON.stringify({
        user: userWithoutPassword,
        token
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Login error:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Login failed'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}