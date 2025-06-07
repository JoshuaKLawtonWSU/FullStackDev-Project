import bcrypt from 'bcryptjs';
// import { z } from 'zod';
import { prisma } from "../../../../../../packages/db/src/client";


// Define validation schema for registration data


export async function POST(req: Request) {
  try {
    // Parse request body
    const { email, password } = await req.json();
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
        console.log('User already exists:', email);
        return new Response(
            JSON.stringify({
                error: 'User with this email already exists'
            }), 
            {
                status: 409,
                headers: { 'Content-Type': 'application/json' }
            }
        )
    }
    
    // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 12);
    const hashedPassword = password;
    
    // Create new user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword
      }
    });
    console.log('User created:', user.email);

    // Return success without exposing the password
    return new Response(
        JSON.stringify(user),
        {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        }
    );
    
  } catch (error) {
    console.log('Registration error:', error);
    console.error('Registration error:', error);
    // return new Response(
    //   { error: 'Registration failed' },
    //   { status: 500 }
    // );
    return new Response(
        JSON.stringify({
            error: 'Registration failed'
        }),
        {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        }
    )
  }
}