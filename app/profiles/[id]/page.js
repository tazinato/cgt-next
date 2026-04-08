import Link from "next/link";
import prisma from "@/app/lib/prisma";

export default async function ProfileDetail({ params }) {
  const resolvedParams = await params;
  console.log("params:", resolvedParams);
  
  const id = Number(resolvedParams.id);
  
  if (!resolvedParams.id || isNaN(id)) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Invalid Profile ID</h1>
        <p>ID: {resolvedParams.id} (parsed: {id})</p>
        <Link href="/profiles" style={{ color: "#3b82f6" }}>← Back to Profiles</Link>
      </div>
    );
  }

  try {
    const profile = await prisma.Profiles.findUnique({
      where: { id }
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
        <h1>{profile.name}</h1>
        <p><strong>Title:</strong> {profile.title}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        {profile.image_url && (
          <img 
            src={profile.image_url} 
            alt={profile.name} 
            style={{ maxWidth: "100%", borderRadius: "12px" }} 
          />
        )}
        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
          <Link 
            href={`/profiles/${profile.id}/edit`} 
            style={{ 
              background: "#3b82f6", 
              color: "white", 
              padding: "0.75rem 1.5rem", 
              borderRadius: "8px", 
              textDecoration: "none" 
            }}
          >
            Edit Profile
          </Link>
          <Link 
            href="/profiles" 
            style={{ 
              background: "#6b7280", 
              color: "white", 
              padding: "0.75rem 1.5rem", 
              borderRadius: "8px", 
              textDecoration: "none" 
            }}
          >
            Back
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Database error:", error);
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Error Loading Profile</h1>
        <p>Please try again later.</p>
        <Link href="/profiles" style={{ color: "#3b82f6" }}>← Back to Profiles</Link>
      </div>
    );
  }
}