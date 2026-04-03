// app/profiles/[id]/page.js
import prisma from '../../../app/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const runtime = 'nodejs';

export default async function ProfilePage({ params }) {
  const profile = await prisma.profiles.findUnique({
    where: { id: parseInt(params.id) }
  });

  if (!profile) {
    notFound();
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Profile</h1>
        <Link 
          href="/" 
          style={{
            padding: '0.75rem 1.5rem',
            background: '#f3f4f6',
            color: '#374151',
            textDecoration: 'none',
            borderRadius: '0.5rem',
            border: '1px solid #d1d5db'
          }}
        >
          ← Back to Profiles
        </Link>
      </div>

      <div style={{ display: 'grid', gap: '2rem' }}>
        <div>
          {profile.image_url ? (
            <img 
              src={profile.image_url} 
              alt={profile.name}
              style={{ 
                width: 120, 
                height: 120, 
                borderRadius: '50%', 
                objectFit: 'cover',
                marginBottom: '1rem'
              }}
            />
          ) : (
            <div style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: '#e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              color: '#6b7280',
              marginBottom: '1rem'
            }}>
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{profile.name}</h2>
          <p style={{ color: '#6b7280', fontSize: '1.25rem', marginBottom: '1rem' }}>{profile.title}</p>
          <p style={{ lineHeight: 1.6, color: '#4b5563' }}>{profile.bio}</p>
        </div>

        <div>
          <p style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Email:</p>
          <a href={`mailto:${profile.email}`} style={{ color: '#3b82f6' }}>
            {profile.email}
          </a>
        </div>

        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          <p>Created: {new Date(profile.createAt).toLocaleDateString()}</p>
          <p>Updated: {new Date(profile.updateAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}