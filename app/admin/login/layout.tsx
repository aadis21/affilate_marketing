// Admin login uses the root layout (no sidebar/header needed)
// We override with a simple wrapper that just passes children through
export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
