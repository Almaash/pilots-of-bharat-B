import { db } from "../config/db.js";
import { eq } from "drizzle-orm";
import { users } from "../drizzle/schema.js";

// GET all users
export const getAllUsers = async (req, res) => {
  try {
    const result = await db.select().from(users);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single user by email
export const getUserById = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

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
    const {
      name,
      email,
      phone,
      image,
      bio,
      role,
      location,
      status,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const inserted = await db
      .insert(users)
      .values({
        name,
        email,
        phone,
        image,
        bio,
        role,
        location,
        status,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    res.status(201).json(inserted[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT update user
export const updateUser = async (req, res) => {
  const { id } = req.params;

  try {
    const updated = await db
      .update(users)
      .set({
        ...req.body,
        updatedAt: new Date(), // ensure timestamp is updated
      })
      .where(eq(users.id, id))
      .returning();

    if (!updated.length) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE user
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await db.delete(users).where(eq(users.id, id));
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
