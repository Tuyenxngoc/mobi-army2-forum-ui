export const checkUserHasRequiredRole = (roleName, allowedRoles) => {
    return allowedRoles.includes(roleName);
};

export const checkIdIsNumber = (id) => {
    return !isNaN(id) && /^-?\d+$/.test(id);
};
