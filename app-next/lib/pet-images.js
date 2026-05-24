export function getPetPhotoUrl(pet, fallback = "/images/loading.svg") {
  if (!pet) return fallback;
  if (pet.photo_url) return pet.photo_url;

  const isNora = String(pet.id) === "1" || pet.name?.toLowerCase() === "nora";
  return isNora ? "/images/nora.png" : fallback;
}
