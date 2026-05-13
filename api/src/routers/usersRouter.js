import express from "express";
import * as db from "../database/users.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";
const usersRouter = express.Router();

usersRouter.post("/api/users", async (request, response) => {
  const user = request.body;
  const userError = validateUserData(user);

  if (userError) return response.status(400).send({ error: userError });

  await db.addUser(createUserObject(user));

  response.status(201).json({ message: "user added successfully." });
});

usersRouter.get("/api/users", requireAuth, requireRole("admin"), async (_request, response) => {
  const users = await db.getAllUsers();
  response.send(users);
});

usersRouter.patch("/api/users/:id/role", requireAuth, requireRole("admin"), async (request, response) => {
  const id = Number(request.params.id);
  const { admin } = request.body || {};

  if (!id) return response.status(400).send({ error: "Valid user id is required" });
  if (typeof admin !== "boolean") return response.status(400).send({ error: "admin must be a boolean" });

  const sessionUser = request.user || request.session?.user;
  if (sessionUser?.id && Number(sessionUser.id) === id && admin === false) {
    return response.status(400).send({ error: "You cannot remove admin access from your current account." });
  }

  const existingUsers = await db.getUserById(id);
  const existingUser = Array.isArray(existingUsers) ? existingUsers[0] : existingUsers;

  if (!existingUser) {
    return response.status(404).send({ error: "user not found." });
  }

  const updatedUser = await db.updateUserRoleById(id, admin);
  response.send(updatedUser);
});

usersRouter.get("/api/users/:email",requireAuth, async (request, response) => {
  const email = request.params.email;
  if (!email) return response.status(400).send({ error: `No email is provided` });

  const user = await db.getUserByEmail(email);

  if (!user) return response.status(404).send({ error: `user with such email has no data` });

  response.send(user);
});

usersRouter.put("/api/users/:email",requireAuth, async (request, response) => {
  const email = request.params.email;
  const user = request.body;

  if (!email) return response.status(400).send({ error: `Email address is mandatory` });

  const userError = validateUserData(user);

  if (userError) return response.status(400).send({ error: userError });

  const newUser = createUserObject(user);

  const existingUser = await db.getUserByEmail(email);

  if (!existingUser) {
    await db.addUser(newUser);
    return response.status(201).json({ message: "user added successfully." });
  }

  await db.updateUserByEmail(email, newUser);

  response.status(201).send({ message: "user updated successfully." });
});

usersRouter.delete("/api/users/:id", requireAuth, requireRole("admin"), async (request, response) => {
  const id = Number(request.params.id);

  if (!id) return response.status(400).send({ error: "Id is mandatory" });

  const sessionUser = request.user || request.session?.user;
  if (sessionUser?.id && Number(sessionUser.id) === id) {
    return response.status(400).send({ error: "You cannot delete your current account." });
  }

  const existingUsers = await db.getUserById(id);
  const existingUser = Array.isArray(existingUsers) ? existingUsers[0] : existingUsers;

  if (!existingUser) return response.status(404).send({ error: "user not found." });

  const isDeleted = await db.deleteUserById(id);

  if (isDeleted) return response.send({ message: "user data deleted successfully." });

  response.status(404).send({ error: "user not found." });
});

const validateUserData = (user) => {
  if (!user) return `user data is required.`;

  if (!user.full_name) return "User full name is required";
  if (!user.email) return "User email is required";
  if (!user.phone) return "User phone number is required";
  if (!user.address) return "User address is requred";
  if (!user.date_of_birth) return "User date of birth is required";
  if (!user.passport_number) return "User passport number is required";
  if (!user.created_at) return "User create date is required";
  if (!user.updated_at) return "User update date is required";
};

const createUserObject = (user) => {
  const createUser = {
    full_name: user.full_name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    date_of_birth: user.date_of_birth,
    passport_number: user.passport_number,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };

  return createUser;
};

export default usersRouter;
