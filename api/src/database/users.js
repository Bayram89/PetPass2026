import dbClient from "./database_client.js";

export async function addUser(user) {
  return dbClient("users").insert(user);
}

export async function deleteUserByGoogleId(id) {
  return dbClient("users").where("google_id", id).del();
}

export async function getUserById(id) {
  return dbClient("users").select("*").where("id", id);
}

export async function updateUserByEmail(email, user) {
  return dbClient("users").where("email", email).update(user);
}

export async function getUserByName(userName) {
  return dbClient("users").select("*").where("full_name", userName);
}

export async function getUserByPhoneNumber(phone) {
  return dbClient("users").select("*").where("phone", phone);
}

export async function getUserByEmail(email) {
  const [user] = await dbClient("users").select("*").where("email", email);
  return user;
}

export async function getAllUsers() {
  return dbClient("users")
    .select("id", "full_name", "email", "phone", "address", "admin", "created_at", "updated_at")
    .orderBy("full_name", "asc");
}

export async function updateUserRoleById(id, isAdmin) {
  const [user] = await dbClient("users")
    .where("id", id)
    .update({
      admin: isAdmin,
      updated_at: dbClient.fn.now(),
    })
    .returning(["id", "full_name", "email", "phone", "address", "admin", "created_at", "updated_at"]);

  return user;
}
