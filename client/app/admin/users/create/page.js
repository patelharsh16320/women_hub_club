"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchAPI } from "../../../../services/api";
import Link from "next/link";

export default function CreateUserPage() {
  const router = useRouter();
  useEffect(() => {
    // Hide direct access to create user page by redirecting to users list
    router.replace("/admin/users");
  }, [router]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // default value is lowercase
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await fetchAPI("/users", {
        method: "POST",
        body: JSON.stringify({ name, email, password, role }),
      });
      router.push("/admin/users");
    } catch (err) {
      setError(err.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  // Page is hidden; redirect above. Render nothing to avoid a flash.
  return null;
}
