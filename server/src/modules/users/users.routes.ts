import { Router } from "express";
import { AppError } from "../../lib/errors.js";
import { requireAuth } from "../../middleware/auth.js";
import { UserModel } from "./users.model.js";

export const usersRouter = Router();

// Profile editing (PATCH /me) is added in a later phase.
usersRouter.get("/me", requireAuth, async (req, res) => {
  const user = await UserModel.findById(req.user?.id)
    .select("name email emailVerified image role phone area bio status createdAt")
    .lean();
  if (!user) throw new AppError(404, "NOT_FOUND", "User not found");

  const { _id, ...profile } = user;
  res.json({ success: true, data: { id: _id.toString(), ...profile } });
});
