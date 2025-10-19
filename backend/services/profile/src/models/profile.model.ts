import { query } from '../config/database';
import { Profile, CreateProfileDTO, UpdateProfileDTO } from '../types';

export async function createProfile(data: CreateProfileDTO): Promise<Profile> {
  const result = await query<Profile>(
    `INSERT INTO profiles (user_id, display_name, bio, age, gender, looking_for, city, country, interests)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [data.user_id, data.display_name, data.bio || null, data.age, data.gender, data.looking_for, data.city || null, 'RU', data.interests || []]
  );
  return result.rows[0];
}

export async function findProfileByUserId(userId: string): Promise<Profile | null> {
  const result = await query<Profile>(`SELECT * FROM profiles WHERE user_id = $1`, [userId]);
  return result.rows[0] || null;
}

export async function updateProfile(userId: string, data: UpdateProfileDTO): Promise<Profile | null> {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (data.display_name) {
    fields.push('display_name = $' + idx++);
    values.push(data.display_name);
  }
  if (data.bio !== undefined) {
    fields.push('bio = $' + idx++);
    values.push(data.bio);
  }
  if (data.age) {
    fields.push('age = $' + idx++);
    values.push(data.age);
  }

  if (fields.length === 0) return null;

  values.push(userId);
  const sql = 'UPDATE profiles SET ' + fields.join(', ') + ', updated_at = NOW() WHERE user_id = $' + idx + ' RETURNING *';
  const result = await query<Profile>(sql, values);
  return result.rows[0] || null;
}

export async function updateLocation(userId: string, lat: number, lng: number): Promise<void> {
  await query(`UPDATE profiles SET location = ST_SetSRID(ST_MakePoint($1, $2), 4326) WHERE user_id = $3`, [lng, lat, userId]);
}

export async function addPhoto(userId: string, url: string): Promise<void> {
  await query(`UPDATE profiles SET photos = array_append(photos, $1) WHERE user_id = $2`, [url, userId]);
}

export async function removePhoto(userId: string, url: string): Promise<void> {
  await query(`UPDATE profiles SET photos = array_remove(photos, $1) WHERE user_id = $2`, [url, userId]);
}

export async function findNearbyProfiles(params: any): Promise<Profile[]> {
  const result = await query<Profile>(
    `SELECT * FROM profiles WHERE ST_DWithin(location::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3 * 1000) ORDER BY location <-> ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography LIMIT $4`,
    [params.longitude, params.latitude, params.radius, params.limit]
  );
  return result.rows;
}
