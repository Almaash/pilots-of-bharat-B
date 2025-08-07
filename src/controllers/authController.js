// import { eq } from 'drizzle-orm';
// import { users } from '../drizzle/schema.js';
// import { db } from '../config/db.js';

// export const createOrFindUser = async (req, res) => {
//   const { name, email, image } = req.body;

//   if (!email) {
//     return res.status(400).json({ error: 'Email is required' });
//   }

//   try {
//     // 1. Check if user already exists by email
//     const existingUser = await db
//       .select()
//       .from(users)
//       .where(eq(users.email, email))
//       .limit(1);

//     if (existingUser.length > 0) {
//       return res.status(200).json({
//         user: existingUser[0],
//         message: 'User already exists',
//       });
//     }

//     // 2. Create user with only name, email, and image
//     const [newUser] = await db
//       .insert(users)
//       .values({ name, email, image })
//       .returning();

//     return res.status(201).json({
//       user: newUser,
//       message: 'User created successfully',
//     });
//   } catch (error) {
//     console.error('[createOrFindUser]', error);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// };


import { db } from "../config/db.js"; // your drizzle DB
import { users } from "../drizzle/schema.js"; // your users table
import { eq } from "drizzle-orm";

export const googleAuthRegister = async (req, res) => {
  try {
    const { name, email, image } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));

    if (existingUser.length > 0) {
      return res.status(200).json({ user: existingUser[0], message: "User already exists" });
    }

    // Insert new user
    const newUser = await db
      .insert(users)
      .values({ name, email, image })
      .returning();

    return res.status(201).json({ user: newUser[0], message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Error in Google auth route:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
