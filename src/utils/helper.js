export const checkUserHasRequiredRole = (roleName, allowedRoles) => {
    return allowedRoles.includes(roleName);
};
