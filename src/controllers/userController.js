import { db } from '../config/db.js';
import { eq } from 'drizzle-orm';
import { users } from '../drizzle/schema.js';

// GET all users
export const getAllUsers = async (req, res) => {
  try {
    const result = await db.select().from(users);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single user by ID
export const getUserById = async (req, res) => {
    const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!result.length) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST create user
export const createUser = async (req, res) => {
  try {
    const { name, email, phone, avatarUrl, role } = req.body;
    const inserted = await db.insert(users).values({ name, email, phone, avatarUrl, role }).returning();
    res.status(201).json(inserted[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT update user
export const updateUser = async (req, res) => {
  try {
    const updated = await db
      .update(users)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(users.id, req.params.id))
      .returning();
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE user
export const deleteUser = async (req, res) => {
  try {
    await db.delete(users).where(eq(users.id, req.params.id));
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
