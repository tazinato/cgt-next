import Link from "next/link";
import prisma from "@/app/lib/prisma";
import DeleteButton from "./DeleteButton";  

export default async function EditProfile({ params }) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  
  if (!resolvedParams.id || isNaN(id)) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Invalid Profile ID</h1>
        <Link href="/profiles" style={{ color: "#3b82f6" }}>← Back to Profiles</Link>
      </div>
    );
  }

  try {
    const profile = await prisma.Profiles.findUnique({
      where: { id: id }
    });

    if (!profile) {
      return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h1>Profile Not Found</h1>
          <Link href="/profiles" style={{ color: "#3b82f6" }}>← Back to Profiles</Link>
        </div>
      );
    }

    return (
      <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
        <h1>Edit {profile.name}</h1>
        
        <form action={`/profiles/${profile.id}/edit`} method="POST" style={{ marginBottom: "2rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
              Name:
              <input name="name" defaultValue={profile.name} required style={{ width: "100%", padding: "0.75rem", border: "1px solid #d1d5db", borderRadius: "8px" }} />
            </label>
          </div>
          
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
              Title:
              <input name="title" defaultValue={profile.title || ""} style={{ width: "100%", padding: "0.75rem", border: "1px solid #d1d5db", borderRadius: "8px" }} />
            </label>
          </div>
          
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
              Email:
              <input name="email" type="email" defaultValue={profile.email || ""} required style={{ width: "100%", padding: "0.75rem", border: "1px solid #d1d5db", borderRadius: "8px" }} />
            </label>
          </div>
          
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
              Image URL (optional):
              <input name="image_url" defaultValue={profile.image_url || ""} style={{ width: "100%", padding: "0.75rem", border: "1px solid #d1d5db", borderRadius: "8px" }} />
            </label>
          </div>
          
          <button 
            type="submit"
            style={{ background: "#10b981", color: "white", padding: "0.75rem 1.5rem", borderRadius: "8px", border: "none", cursor: "pointer", marginRight: "1rem" }}
          >
            Update Profile
          </button>
          
          <DeleteButton id={profile.id} />
        </form>

        <Link 
          href={`/profiles/${profile.id}`} 
          style={{ background: "#6b7280", color: "white", padding: "0.75rem 1.5rem", borderRadius: "8px", textDecoration: "none" }}
        >
          Cancel
        </Link>
      </div>
    );
  } catch (error) {
    console.error("Database error:", error);
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Error Loading Profile</h1>
        <Link href="/profiles" style={{ color: "#3b82f6" }}>← Back to Profiles</Link>
      </div>
    );
  }
}