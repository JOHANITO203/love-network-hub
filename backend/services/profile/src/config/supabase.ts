import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_KEY!;

export const supabase = createClient(url, key);

export async function uploadPhoto(userId: string, buffer: Buffer, filename: string) {
  const path = userId + '/' + Date.now() + '-' + filename;
  
  const { data, error } = await supabase.storage
    .from('profile-photos')
    .upload(path, buffer, { contentType: 'image/webp' });

  if (error) throw new Error('Upload failed');

  const { data: urlData } = supabase.storage
    .from('profile-photos')
    .getPublicUrl(path);

  return { url: urlData.publicUrl, path: data.path };
}

export async function deletePhoto(path: string) {
  await supabase.storage.from('profile-photos').remove([path]);
}
