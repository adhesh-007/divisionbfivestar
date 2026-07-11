import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export const DEFAULT_DIRECTORS = {
  B1: "TM Karthick Rajendran",
  B2: "Atchayashiri",
  B3: "Jonathan",
  B4: "Sunita Rajaseelan"
};

const KEYS = {
  clubs: 'db:clubs',
  meetings: 'db:meetings',
  pathways: 'db:pathways',
  mentors: 'db:mentors',
  directors: 'db:directors'
};

export async function getState() {
  const [clubs, meetings, pathways, mentors, directors] = await Promise.all([
    redis.get(KEYS.clubs),
    redis.get(KEYS.meetings),
    redis.get(KEYS.pathways),
    redis.get(KEYS.mentors),
    redis.get(KEYS.directors)
  ]);
  return {
    clubs: clubs || [],
    meetings: meetings || [],
    pathways: pathways || [],
    mentors: mentors || [],
    directors: directors || {}
  };
}

export async function saveClubs(v) { await redis.set(KEYS.clubs, v); }
export async function saveMeetings(v) { await redis.set(KEYS.meetings, v); }
export async function savePathways(v) { await redis.set(KEYS.pathways, v); }
export async function saveMentors(v) { await redis.set(KEYS.mentors, v); }
export async function saveDirectors(v) { await redis.set(KEYS.directors, v); }

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
