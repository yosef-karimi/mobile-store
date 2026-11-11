const ADMIN_ACCESS_CODE = '123'
const ADMIN_SESSION_KEY = 'shop-admin-session'

export function loginAdmin(code: string): boolean {
  if (code !== ADMIN_ACCESS_CODE) return false

  sessionStorage.setItem(ADMIN_SESSION_KEY, 'active')
  return true
}

export function isAdminAuthenticated(): boolean {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'active'
}

export function logoutAdmin(): void {
  sessionStorage.removeItem(ADMIN_SESSION_KEY)
}
