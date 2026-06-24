export function getRoleRedirectPath(role) {
  if (role === "artist") {
    return "/dashboard/artist";
  }

  if (role === "admin") {
    return "/dashboard/admin";
  }

  return "/";
}
