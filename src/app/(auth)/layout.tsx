// src/app/(auth)/layout.tsx
// This layout wraps BOTH the login and register pages
// It is very simple — just renders whatever page is inside
 
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // No navbar, no sidebar — just the page itself
  return <>{children}</>
}
 