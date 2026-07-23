import { supabase, STORAGE_BUCKET } from './supabase';

export async function uploadFile(file: File, folder: string): Promise<string | null> {
  const ext = file.name.split('.').pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) {
    console.error('Upload error:', error.message);
    return null;
  }
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteFile(url: string): Promise<void> {
  if (!url) return;
  try {
    const parts = url.split(`/${STORAGE_BUCKET}/`);
    if (parts.length < 2) return;
    const path = parts[1];
    await supabase.storage.from(STORAGE_BUCKET).remove([path]);
  } catch (e) {
    // best-effort
  }
}
