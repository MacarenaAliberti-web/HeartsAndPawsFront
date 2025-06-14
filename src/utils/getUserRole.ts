// utils/getUserRole.ts
type UserWithRoles = {
  [key: string]: unknown;
};

export const getUserRole = (user: UserWithRoles) => {
  const namespace = "https://backend-hearts-paws/";
  const roles = user?.[`${namespace}roles`] as string[] || [];
  return roles[0]; 
};
