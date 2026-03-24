// app/page.js
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [profiles, setProfiles] = useState([]);
  const [name, setName] = useState("");
  const [major, setMajor] = useState("");
  const [year, setYear] = useState("");
  const [gpa, setGpa] = useState("");

  const fetchProfiles = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.major) params.append("major", filters.major);
    if (filters.year) params.append("year", filters.year);
    if (filters.name) params.append("name", filters.name);

    const res = await fetch(`/api/profiles?${params}`);
    const data = await res.json();
    setProfiles(data);
  };

  const handleCreate = async () => {
    const body = {
      name,
      major,
      year: Number(year),
      gpa: Number(gpa),
    };

    const res = await fetch("/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const newProfile = await res.json();
      setProfiles((prev) => [...prev, newProfile]);
      // reset form
      setName("");
      setMajor("");
      setYear("");
      setGpa("");
    } else {
      const err = await res.text();
      alert(`Error: ${err}`);
    }
  };

  const handleUpdate = async (id) => {
    const res = await fetch(`/api/profiles?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gpa: 4.0 }), // example: update GPA
    });

    if (res.ok) {
      const updated = await res.json();
      setProfiles((prev) =>
        prev.map((p) => (p.id === id ? updated : p))
      );
    } else {
      const err = await res.text();
      alert(`Error: ${err}`);
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/profiles?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setProfiles((prev) => prev.filter((p) => p.id !== id));
    } else {
      const err = await res.text();
      alert(`Error: ${err}`);
    }
  };

  useEffect(() => {
    fetchProfiles(); // initial load
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-3xl space-y-8 px-6 py-12">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />

        <section>
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
            Profiles (via API)
          </h2>
          <ul className="mt-4 grid gap-2">
            {profiles.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-4 rounded border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-black"
              >
                <span className="flex-1 text-sm text-zinc-900 dark:text-zinc-50">
                  {p.name}, {p.major} · Year {p.year} · GPA {p.gpa}
                </span>
                <button
                  onClick={() => handleUpdate(p.id)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Set GPA 4.0
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
            Add a New Profile
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreate();
            }}
            className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded border border-zinc-300 p-2 dark:border-zinc-700 dark:bg-zinc-900"
              required
            />
            <input
              placeholder="Major"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="rounded border border-zinc-300 p-2 dark:border-zinc-700 dark:bg-zinc-900"
              required
            />
            <input
              type="number"
              min="1"
              max="4"
              placeholder="Year (1–4)"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="rounded border border-zinc-300 p-2 dark:border-zinc-700 dark:bg-zinc-900"
              required
            />
            <input
              type="number"
              step="0.1"
              min="0"
              max="4"
              placeholder="GPA (0–4)"
              value={gpa}
              onChange={(e) => setGpa(e.target.value)}
              className="rounded border border-zinc-300 p-2 dark:border-zinc-700 dark:bg-zinc-900"
              required
            />
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Add Profile
            </button>
          </form>
        </section>

        <section className="flex flex-wrap gap-2">
          <button
            onClick={() => fetchProfiles()}
            className="rounded bg-zinc-200 px-3 py-1 text-sm text-black dark:bg-zinc-800 dark:text-white"
          >
            Load All
          </button>
          <button
            onClick={() => fetchProfiles({ major: "CGT" })}
            className="rounded bg-zinc-200 px-3 py-1 text-sm text-black dark:bg-zinc-800 dark:text-white"
          >
            Filter: major=CGT
          </button>
          <button
            onClick={() => fetchProfiles({ year: 3 })}
            className="rounded bg-zinc-200 px-3 py-1 text-sm text-black dark:bg-zinc-800 dark:text-white"
          >
            Filter: year=3
          </button>
          <button
            onClick={() => fetchProfiles({ name: "ava" })}
            className="rounded bg-zinc-200 px-3 py-1 text-sm text-black dark:bg-zinc-800 dark:text-white"
          >
            Filter: name includes "ava"
          </button>
        </section>
      </main>
    </div>
  );
}