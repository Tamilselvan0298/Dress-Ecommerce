export type Role =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "PRODUCT_MANAGER"
  | "ORDER_MANAGER"
  | "INVENTORY_MANAGER"
  | "CONTENT_MANAGER"
  | "SUPPORT_AGENT"
  | "CUSTOMER";

export const PERMISSIONS = {
  MANAGE_PRODUCTS: ["SUPER_ADMIN", "ADMIN", "PRODUCT_MANAGER"],
  MANAGE_ORDERS: ["SUPER_ADMIN", "ADMIN", "ORDER_MANAGER", "SUPPORT_AGENT"],
  MANAGE_INVENTORY: ["SUPER_ADMIN", "ADMIN", "INVENTORY_MANAGER"],
  MANAGE_CONTENT: ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER"],
  MANAGE_COUPONS: ["SUPER_ADMIN", "ADMIN"],
  VIEW_ANALYTICS: ["SUPER_ADMIN", "ADMIN"],
  MANAGE_SETTINGS: ["SUPER_ADMIN"],
  ACCESS_ADMIN: [
    "SUPER_ADMIN",
    "ADMIN",
    "PRODUCT_MANAGER",
    "ORDER_MANAGER",
    "INVENTORY_MANAGER",
    "CONTENT_MANAGER",
    "SUPPORT_AGENT",
  ],
} as const;

export function hasPermission(role: string, requiredPermission: keyof typeof PERMISSIONS): boolean {
  const allowedRoles = PERMISSIONS[requiredPermission] as readonly string[];
  return allowedRoles.includes(role);
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

// Current demo session helper
export function getDemoSession(role: Role = "SUPER_ADMIN"): SessionUser {
  return {
    id: "admin-user-001",
    name: "Vaishiri Admin",
    email: "admin@vaishiri.com",
    role: role,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  };
}

