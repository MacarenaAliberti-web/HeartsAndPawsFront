// utils/getUserRole.ts
type UserWithRoles = {
  [key: string]: unknown;
};

export const getUserRole = (user: UserWithRoles) => {
  const namespace = "NEXT_PUBLIC_API_URL";
  const roles = user?.[`${namespace}roles`] as string[] || [];
  return roles[0]; 
};
