import { openDB } from "idb";
let database;
function db() {
  return (database ??= openDB("salesflow-documents", 1, {
    upgrade(database) {
      database.createObjectStore("photos");
    },
  }).catch((error) => {
    database = undefined;
    throw error;
  }));
}
export async function putPhoto(id, file) {
  return (await db()).put("photos", file, id);
}
export async function getPhoto(id) {
  return id ? (await db()).get("photos", id) : null;
}
export async function deletePhoto(id) {
  if (id) await (await db()).delete("photos", id);
}
export async function clearPhotos() {
  await (await db()).clear("photos");
}
