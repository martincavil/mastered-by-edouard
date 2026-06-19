import { AdminBodyMarker } from "./AdminBodyMarker";

export const metadata = {
  title: "Studio - mastered by edouard",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminBodyMarker />
      {children}
    </>
  );
}
