"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userInfo");
    }
    // small delay to show message if needed
    const t = setTimeout(() => router.push("/"), 400);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow text-center">
      <h2 className="text-2xl font-bold mb-2">Signed out</h2>
      <p className="text-sm text-gray-600">You have been signed out. Redirecting...</p>
    </div>
  );
}
