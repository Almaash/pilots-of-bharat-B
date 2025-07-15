import { and, eq, ilike } from "drizzle-orm";
import { db } from "../config/db.js";
import { skills, users } from "../drizzle/schema.js";
import { cloudinary } from "../utils/cloudinary.js";
import streamifier from "streamifier";

// ✅ Create a new skill with Cloudinary image upload
export const createSkill = async (req, res) => {
  try {
    const { userId, name, description, projectUrl } = req.body;

    let imageUrl = null;

    // If an image file is provided
    if (req.file) {
      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "skills",
              resource_type: "image",
            },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload();
      imageUrl = result.secure_url;
    }

    const newSkill = await db
      .insert(skills)
      .values({
        userId,
        name,
        description,
        imageUrl,
        projectUrl,
      })
      .returning();

    res.status(201).json({ message: "Skill created", skill: newSkill[0] });
  } catch (error) {
    console.error("Create Skill Error:", error);
    res.status(500).json({ message: "Error creating skill" });
  }
};

// ✅ Get all skills for a specific user
export const getUserSkills = async (req, res) => {
  try {
    const { userId } = req.params;

    const userSkills = await db
      .select()
      .from(skills)
      .where(eq(skills.userId, userId));

    res.status(200).json({
      status: "success",
      message: "User skills fetched successfully",
      data: userSkills,
    });
  } catch (error) {
    console.error("Get User Skills Error:", error);
    res.status(500).json({ message: "Error fetching user skills" });
  }
};

// ✅ Get single skill by ID
export const getSkillById = async (req, res) => {
  try {
    const { id } = req.params;

    const skill = await db.select().from(skills).where(eq(skills.id, id));

    if (!skill.length) {
      return res.status(404).json({ message: "Skill not found" });
    }

    res.status(200).json({
      status: "success",
      message: "User skills fetched successfully",
      data: skill[0],
    });
  } catch (error) {
    console.error("Get Skill Error:", error);
    res.status(500).json({ message: "Error fetching skill" });
  }
};

// ✅ Update a skill (no image re-upload here)
// ✅ Update skill and optionally re-upload image
export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.body) {
      return res.status(400).json({ message: "Missing form data" });
    }

    const { name, description, projectUrl, imageUrl: existingImageUrl } = req.body;

    let imageUrl = existingImageUrl || null;

    // Handle image upload if a new one is provided
    if (req.file) {
      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "skills",
              resource_type: "image",
            },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload();
      imageUrl = result.secure_url;
    }

    const updated = await db
      .update(skills)
      .set({
        name,
        description,
        projectUrl,
        imageUrl,
        updatedAt: new Date(),
      })
      .where(eq(skills.id, id))
      .returning();

    if (!updated.length) {
      return res
        .status(404)
        .json({ message: "Skill not found or not updated" });
    }

    res.status(200).json({ message: "Skill updated", skill: updated[0] });
  } catch (error) {
    console.error("Update Skill Error:", error);
    res.status(500).json({ message: "Error updating skill" });
  }
};


// ✅ Delete a skill
export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await db
      .delete(skills)
      .where(eq(skills.id, id))
      .returning();

    if (!deleted.length) {
      return res
        .status(404)
        .json({ message: "Skill not found or already deleted" });
    }

    res.status(200).json({ message: "Skill deleted", skill: deleted[0] });
  } catch (error) {
    console.error("Delete Skill Error:", error);
    res.status(500).json({ message: "Error deleting skill" });
  }
};


export const getAllSkillsWithFilters = async (req, res) => {
  try {
    const { name = "", location = "" } = req.query;

    let filters = [];

    if (name.trim()) {
      filters.push(ilike(skills.name, `%${name.trim()}%`));
    }

    if (location.trim()) {
      filters.push(ilike(users.location, `%${location.trim()}%`));
    }

    const result = await db
      .select({
        id: skills.id,
        name: skills.name,
        description: skills.description,
        imageUrl: skills.imageUrl,
        projectUrl: skills.projectUrl,
        userId: users.id,
        userName: users.name,
        userLocation: users.location,
        userEmail: users.email, // ✅ Include email
      })
      .from(skills)
      .innerJoin(users, eq(skills.userId, users.id))
      .where(filters.length > 0 ? and(...filters) : undefined);

    res.status(200).json({
      message: "Filtered skills fetched",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching filtered skills:", error);
    res.status(500).json({ message: "Error fetching skills" });
  }
};
