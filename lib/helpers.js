export function getNowTimestamp() {
  return new Date().toISOString(); // หรือใช้ Timestamp.now() ของ Firestore
}

export function generateId(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
}
