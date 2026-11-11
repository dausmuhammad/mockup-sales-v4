import "fake-indexeddb/auto";
import test from "node:test";
import assert from "node:assert/strict";
import {
  putPhoto,
  getPhoto,
  deletePhoto,
  clearPhotos,
} from "../lib/storage/photos.js";
test("IndexedDB menyimpan Blob asli, dapat dibaca ulang, dihapus, dan direset", async () => {
  const blob = new Blob(["image bytes"], { type: "image/png" });
  await putPhoto("test-photo", blob);
  assert.equal(await (await getPhoto("test-photo")).text(), "image bytes");
  await deletePhoto("test-photo");
  assert.equal(await getPhoto("test-photo"), undefined);
  await putPhoto("other", blob);
  await clearPhotos();
  assert.equal(await getPhoto("other"), undefined);
});
