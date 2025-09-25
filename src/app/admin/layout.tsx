import AuthGuard from "../(auth)/AuthGuard";

// AdminLayout của bạn vẫn giữ nguyên
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  // Layout code của bạn...
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
        <div>{children}</div>
    </AuthGuard>
  );
}