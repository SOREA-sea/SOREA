// Shared in-memory store for endpoints when no database is available
export const usersDB = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "user" },
];

export const productsDB = [
  { id: 1, name: "Product A", price: 29.99, stock: 100 },
  { id: 2, name: "Product B", price: 49.99, stock: 50 },
];

export const coachesDB: any[] = [];
export const sessionsDB: any[] = [];
export const contactsDB: any[] = []; 
