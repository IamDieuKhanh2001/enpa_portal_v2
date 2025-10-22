"use client";
import { useEffect, useState } from "react";

export default function TestBackend() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:8000/ping")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Backend Connection Test</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
