import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

/**
 * МойDate Mock Profile Photos Hook
 * Replaces Supabase photo storage with localStorage
 */

export interface ProfilePhoto {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  width: number;
  height: number;
  display_order: number;
  is_primary: boolean;
  is_verified: boolean;
  is_active: boolean;
  upload_source: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface PhotoUploadData {
  file: File;
  width: number;
  height: number;
  displayOrder?: number;
}

const MAX_PHOTOS = 6;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const useProfilePhotos = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [photos, setPhotos] = useState<ProfilePhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  // Load user's photos from localStorage
  const loadPhotos = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const storedPhotos = localStorage.getItem(`moydate_photos_${user.id}`);
      if (storedPhotos) {
        setPhotos(JSON.parse(storedPhotos));
      } else {
        setPhotos([]);
      }
    } catch (error) {
      console.error('Error loading photos:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos photos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Get photos for a specific user
  const getProfilePhotos = useCallback(async (userId: string): Promise<ProfilePhoto[]> => {
    try {
      const storedPhotos = localStorage.getItem(`moydate_photos_${userId}`);
      return storedPhotos ? JSON.parse(storedPhotos) : [];
    } catch (error) {
      console.error('Error getting profile photos:', error);
      return [];
    }
  }, []);

  // Upload a photo (mock - stores as base64 in localStorage)
  const uploadPhoto = useCallback(async (data: PhotoUploadData): Promise<ProfilePhoto | null> => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour télécharger des photos.",
        variant: "destructive",
      });
      return null;
    }

    // Validate file
    if (!ALLOWED_TYPES.includes(data.file.type)) {
      toast({
        title: "Type de fichier non supporté",
        description: "Formats acceptés: JPEG, PNG, WebP",
        variant: "destructive",
      });
      return null;
    }

    if (data.file.size > MAX_FILE_SIZE) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale est de 10 MB.",
        variant: "destructive",
      });
      return null;
    }

    // Check photo limit
    const currentPhotos = photos;
    if (currentPhotos.length >= MAX_PHOTOS) {
      toast({
        title: "Limite atteinte",
        description: `Vous ne pouvez avoir que ${MAX_PHOTOS} photos maximum.`,
        variant: "destructive",
      });
      return null;
    }

    setUploading(true);
    const uploadId = `upload-${Date.now()}`;
    setUploadProgress({ ...uploadProgress, [uploadId]: 0 });

    try {
      // Simulate upload progress
      await new Promise(resolve => setTimeout(resolve, 300));
      setUploadProgress({ ...uploadProgress, [uploadId]: 50 });

      // Convert to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(data.file);
      });

      setUploadProgress({ ...uploadProgress, [uploadId]: 100 });

      // Create photo object
      const newPhoto: ProfilePhoto = {
        id: `photo-${Date.now()}`,
        user_id: user.id,
        file_name: data.file.name,
        file_path: base64, // Store base64 directly
        file_size: data.file.size,
        mime_type: data.file.type,
        width: data.width,
        height: data.height,
        display_order: data.displayOrder ?? currentPhotos.length,
        is_primary: currentPhotos.length === 0, // First photo is primary
        is_verified: false,
        is_active: true,
        upload_source: 'web',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Save to localStorage
      const updatedPhotos = [...currentPhotos, newPhoto];
      localStorage.setItem(`moydate_photos_${user.id}`, JSON.stringify(updatedPhotos));
      setPhotos(updatedPhotos);

      toast({
        title: "Photo ajoutée",
        description: "Votre photo a été ajoutée avec succès.",
      });

      return newPhoto;
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Erreur d'upload",
        description: "Impossible de télécharger la photo.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
      const newProgress = { ...uploadProgress };
      delete newProgress[uploadId];
      setUploadProgress(newProgress);
    }
  }, [user, photos, uploadProgress, toast]);

  // Delete a photo
  const deletePhoto = useCallback(async (photoId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const updatedPhotos = photos.filter(p => p.id !== photoId);
      localStorage.setItem(`moydate_photos_${user.id}`, JSON.stringify(updatedPhotos));
      setPhotos(updatedPhotos);

      toast({
        title: "Photo supprimée",
        description: "Votre photo a été supprimée avec succès.",
      });

      return true;
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la photo.",
        variant: "destructive",
      });
      return false;
    }
  }, [user, photos, toast]);

  // Set primary photo
  const setPrimaryPhoto = useCallback(async (photoId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const updatedPhotos = photos.map(p => ({
        ...p,
        is_primary: p.id === photoId
      }));
      localStorage.setItem(`moydate_photos_${user.id}`, JSON.stringify(updatedPhotos));
      setPhotos(updatedPhotos);

      toast({
        title: "Photo principale mise à jour",
        description: "Votre photo principale a été modifiée.",
      });

      return true;
    } catch (error) {
      console.error('Error setting primary photo:', error);
      return false;
    }
  }, [user, photos, toast]);

  // Reorder photos
  const reorderPhotos = useCallback(async (photoIds: string[]): Promise<boolean> => {
    if (!user) return false;

    try {
      const photoMap = new Map(photos.map(p => [p.id, p]));
      const updatedPhotos = photoIds
        .map((id, index) => {
          const photo = photoMap.get(id);
          if (!photo) return null;
          return { ...photo, display_order: index };
        })
        .filter((p): p is ProfilePhoto => p !== null);

      localStorage.setItem(`moydate_photos_${user.id}`, JSON.stringify(updatedPhotos));
      setPhotos(updatedPhotos);

      return true;
    } catch (error) {
      console.error('Error reordering photos:', error);
      return false;
    }
  }, [user, photos]);

  return {
    photos,
    loading,
    uploading,
    uploadProgress,
    loadPhotos,
    getProfilePhotos,
    uploadPhoto,
    deletePhoto,
    setPrimaryPhoto,
    reorderPhotos,
    maxPhotos: MAX_PHOTOS,
    canUploadMore: photos.length < MAX_PHOTOS,
  };
};
