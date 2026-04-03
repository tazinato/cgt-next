"use client";

import Link from "next/link";

export default function Filters({ titles = [], title = "", search = "" }) {
  const params = new URLSearchParams();
  if (title) params.set("title", title);
  if (search) params.set("search", search);

  const clearHref = "/";

  return (
    <div style={{ marginBottom: "24px" }}>
      <form method="GET" action="/" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <select name="title" defaultValue={title}>
          <option value="">All titles</option>
          {titles.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="search"
          placeholder="Search by name"
          defaultValue={search}
        />

        <button type="submit">Filter</button>

        <Link href={clearHref}>Clear</Link>
      </form>
    </div>
  );
}