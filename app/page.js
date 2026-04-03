// app/page.js
import styles from './page.module.css';
import Link from 'next/link';
import Filters from './components/Filters';
import prisma from './lib/prisma';

export const runtime = 'nodejs';

async function fetchTitles() {
  const data = await prisma.profiles.findMany({
    distinct: ['title'],
    select: { title: true }
  });
  return data.map(item => item.title).sort();
}

async function getData({ title, search }) {
  const profiles = await prisma.profiles.findMany({
    where: {
      AND: [
        ...(title ? [{ title: { contains: title, mode: 'insensitive' } }] : []),
        ...(search ? [{ 
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { bio: { contains: search, mode: 'insensitive' } },
          ] 
        }] : []),
      ],
    },
    orderBy: { createAt: 'desc' },
  });

  return profiles;
}

export default async function Home({ searchParams }) {
  const titles = await fetchTitles();
  const resolvedParams = await searchParams;
  const { title, search } = resolvedParams ?? {};
  const profiles = await getData({ title, search });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Profiles Directory</h1>
        <p className={styles.subtitle}>Discover amazing professionals</p>
      </div>

      <div className={styles.filtersSection}>
        <Filters searchParams={searchParams} titles={titles} />
      </div>

      {profiles.length === 0 ? (
        <div className={styles.noProfiles}>
          No profiles match your filters.{' '}
          <Link href="/profiles/new">Add a new profile</Link>
        </div>
      ) : (
        <div className={styles.profilesGrid}>
          {profiles.map((profile) => (
            <div key={profile.id} className={styles.profileCard}>
              {profile.image_url ? (
                <img 
                  src={profile.image_url} 
                  alt={profile.name}
                  className={styles.profileImage}
                />
              ) : (
                <div className={styles.profileImage}>
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              )}
              <h2 className={styles.profileName}>{profile.name}</h2>
              <p className={styles.profileRole}>{profile.title}</p>
              {profile.bio && (
                <p className={styles.profileBio}>{profile.bio}</p>
              )}
              <div className={styles.socialLinks}>
                <a href={`mailto:${profile.email}`} className={styles.socialLink}>
                  📧 {profile.email}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}