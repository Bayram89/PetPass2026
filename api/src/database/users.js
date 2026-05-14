import dbClient from "./database_client.js";

export async function addUser(user) {
  return dbClient("users").insert(user);
}

export async function deleteUserByGoogleId(id) {
  return dbClient("users").where("google_id", id).del();
}

export async function deleteUserById(id) {
  return dbClient.transaction(async (trx) => {
    await trx("pets").where("owner_user_id", id).del();
    return trx("users").where("id", id).del();
  });
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
    .leftJoin("pets", "pets.owner_user_id", "users.id")
    .select(
      "users.id",
      "users.full_name",
      "users.email",
      "users.phone",
      "users.address",
      "users.date_of_birth",
      "users.passport_number",
      "users.admin",
      "users.created_at",
      "users.updated_at"
    )
    .count("pets.id as pet_count")
    .groupBy(
      "users.id",
      "users.full_name",
      "users.email",
      "users.phone",
      "users.address",
      "users.date_of_birth",
      "users.passport_number",
      "users.admin",
      "users.created_at",
      "users.updated_at"
    )
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

export async function updateUserDetailsById(id, user) {
  const [updatedUser] = await dbClient("users")
    .where("id", id)
    .update({
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      date_of_birth: user.date_of_birth,
      passport_number: user.passport_number,
      updated_at: dbClient.fn.now(),
    })
    .returning(["id", "full_name", "email", "phone", "address", "date_of_birth", "passport_number", "admin", "created_at", "updated_at"]);

  return updatedUser;
}
