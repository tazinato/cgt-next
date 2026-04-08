import Link from "next/link";
import prisma from "@/app/lib/prisma";

export default async function ProfilesPage() {
  const profiles = await prisma.Profiles.findMany();

  return (
    <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "2.5rem" 
      }}>
        <h1 style={{ 
          fontSize: "2.5rem", 
          fontWeight: "700", 
          color: "#1f2937",
          margin: 0 
        }}>
          Profiles Directory
        </h1>
        <Link 
          href="/profiles/new"
          style={{
            background: "#3b82f6",
            color: "white",
            padding: "14px 28px",
            borderRadius: "12px",
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "1rem",
            boxShadow: "0 4px 12px rgba(59,130,246,0.4)"
          }}
        >
          + New Profile
        </Link>
      </div>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", 
        gap: "2rem" 
      }}>
        {profiles.map((profile) => (
          <Link 
            key={profile.id}
            href={`/profiles/${profile.id}`}
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "block"
            }}
          >
            <div style={{
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "1.75rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              background: "white",
              transition: "all 0.2s ease"
            }}>
              {profile.image_url && (
                <div style={{ 
                  marginBottom: "1.25rem", 
                  overflow: "hidden", 
                  borderRadius: "12px" 
                }}>
                  <img 
                    src={profile.image_url} 
                    alt={profile.name}
                    style={{ 
                      width: "100%", 
                      height: "220px", 
                      objectFit: "cover" 
                    }} 
                  />
                </div>
              )}
              <h3 style={{ 
                fontSize: "1.75rem", 
                marginBottom: "0.5rem", 
                color: "#111827",
                fontWeight: "600"
              }}>
                {profile.name}
              </h3>
              <p style={{ 
                color: "#6b7280", 
                fontSize: "1.125rem", 
                marginBottom: "0.75rem",
                fontWeight: "500"
              }}>
                {profile.title}
              </p>
              {profile.bio && (
                <p style={{ 
                  color: "#4b5563", 
                  marginBottom: "1.5rem", 
                  lineHeight: "1.6",
                  fontSize: "1rem"
                }}>
                  {profile.bio.length > 120 ? `${profile.bio.slice(0, 120)}...` : profile.bio}
                </p>
              )}
              <div style={{ 
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "white",
                padding: "12px 24px",
                borderRadius: "10px",
                textAlign: "center",
                fontWeight: "600",
                fontSize: "1rem"
              }}>
                View Profile →
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {profiles.length === 0 && (
        <div style={{ 
          textAlign: "center", 
          padding: "6rem 2rem",
          color: "#6b7280"
        }}>
          <h2 style={{ 
            fontSize: "2rem", 
            marginBottom: "1.5rem", 
            color: "#374151" 
          }}>
            No profiles yet
          </h2>
          <p style={{ fontSize: "1.125rem", marginBottom: "2rem" }}>
            Get started by creating your first profile.
          </p>
          <Link 
            href="/profiles/new"
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              color: "white",
              padding: "18px 36px",
              borderRadius: "16px",
              textDecoration: "none",
              fontSize: "1.125rem",
              fontWeight: "700",
              boxShadow: "0 8px 24px rgba(59,130,246,0.4)"
            }}
          >
            Create First Profile
          </Link>
        </div>
      )}
    </div>
  );
}
