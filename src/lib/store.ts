import { load } from "@tauri-apps/plugin-store";

const saveData = async (
  storeName: string = "default",
  key: string,
  value: string | number
) => {
  const store = await load(storeName);
  await store.set(key, { value: value });
  await store.save();
};

const getData = async (storeName: string = "default", key: string) => {
  const store = await load(storeName);
  const data = await store.get<any>(key);
  return data.value;
};

const deleteData = async (storeName: string = "default", key: string) => {
  const store = await load(storeName);
  await store.delete(key);
};

export { saveData, getData, deleteData };
