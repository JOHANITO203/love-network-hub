import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  city?: string;
  country?: string;
  region?: string;
  timestamp: number;
}

export interface LocationStats {
  total_profiles_with_location: number;
  profiles_within_5km: number;
  profiles_within_25km: number;
  profiles_within_50km: number;
  avg_distance_km: number;
}

export interface GeolocationPreferences {
  allow_location_sharing: boolean;
  show_distance: boolean;
  max_distance_km: number;
  use_precise_location: boolean;
}

export const useGeolocation = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [location, setLocation] = useState<LocationData | null>(null);
  const [locationStats, setLocationStats] = useState<LocationStats | null>(null);
  const [preferences, setPreferences] = useState<GeolocationPreferences>({
    allow_location_sharing: true,
    show_distance: true,
    max_distance_km: 50,
    use_precise_location: true,
  });
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState<PermissionState>('prompt');
  const [watchId, setWatchId] = useState<number | null>(null);

  // Check geolocation permission
  const checkPermission = useCallback(async () => {
    if ('permissions' in navigator) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        setPermission(result.state);

        // Listen for permission changes
        result.onchange = () => setPermission(result.state);

        return result.state;
      } catch (error) {
        console.error('Error checking geolocation permission:', error);
        return 'denied';
      }
    }
    return 'prompt';
  }, []);

  // Request geolocation permission and get current position
  const requestLocation = useCallback(async (options?: PositionOptions) => {
    if (!navigator.geolocation) {
      toast({
        title: "Géolocalisation non supportée",
        description: "Votre navigateur ne supporte pas la géolocalisation.",
        variant: "destructive",
      });
      return null;
    }

    setLoading(true);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: preferences.use_precise_location,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
          ...options,
        });
      });

      const locationData: LocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
      };

      // Try to get readable location using reverse geocoding
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${locationData.latitude}&longitude=${locationData.longitude}&localityLanguage=fr`
        );

        if (response.ok) {
          const geoData = await response.json();
          locationData.city = geoData.city || geoData.locality;
          locationData.country = geoData.countryName;
          locationData.region = geoData.principalSubdivision;
        }
      } catch (geoError) {
        console.warn('Could not get readable location:', geoError);
      }

      setLocation(locationData);

      // Save to database if user is logged in
      if (user && preferences.allow_location_sharing) {
        await updateLocationInDatabase(locationData);
      }

      setPermission('granted');

      toast({
        title: "Position mise à jour",
        description: locationData.city
          ? `Votre position a été mise à jour à ${locationData.city}`
          : "Votre position a été mise à jour",
      });

      return locationData;

    } catch (error) {
      console.error('Geolocation error:', error);

      if (error.code === 1) { // PERMISSION_DENIED
        setPermission('denied');
        toast({
          title: "Permission refusée",
          description: "Autorisez la géolocalisation pour améliorer vos matches.",
          variant: "destructive",
        });
      } else if (error.code === 2) { // POSITION_UNAVAILABLE
        toast({
          title: "Position indisponible",
          description: "Impossible de déterminer votre position actuelle.",
          variant: "destructive",
        });
      } else if (error.code === 3) { // TIMEOUT
        toast({
          title: "Délai dépassé",
          description: "La localisation prend trop de temps. Réessayez.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur de géolocalisation",
          description: "Une erreur est survenue lors de la localisation.",
          variant: "destructive",
        });
      }

      return null;
    } finally {
      setLoading(false);
    }
  }, [user, preferences, toast]);

  // Update location in database
  const updateLocationInDatabase = useCallback(async (locationData: LocationData) => {
    if (!user) return false;

    try {
      const { error } = await supabase.rpc('update_user_location', {
        latitude_param: locationData.latitude,
        longitude_param: locationData.longitude,
        accuracy_param: locationData.accuracy,
        city_param: locationData.city,
        country_param: locationData.country,
        region_param: locationData.region,
      });

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error updating location in database:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder votre position.",
        variant: "destructive",
      });
      return false;
    }
  }, [user, toast]);

  // Start watching location changes
  const startWatching = useCallback((options?: PositionOptions) => {
    if (!navigator.geolocation || watchId !== null) return;

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };

        setLocation(locationData);

        // Update database every 5 minutes or if moved more than 1km
        if (user && preferences.allow_location_sharing) {
          updateLocationInDatabase(locationData);
        }
      },
      (error) => {
        console.error('Watch position error:', error);
      },
      {
        enableHighAccuracy: preferences.use_precise_location,
        timeout: 30000,
        maximumAge: 300000, // 5 minutes
        ...options,
      }
    );

    setWatchId(id);
  }, [user, preferences, watchId, updateLocationInDatabase]);

  // Stop watching location changes
  const stopWatching = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  }, [watchId]);

  // Load location preferences
  const loadPreferences = useCallback(async () => {
    if (!user) return;

    try {
      // Load from user_preferences table
      const { data: userPrefs, error: prefsError } = await supabase
        .from('user_preferences')
        .select('max_distance_km, use_precise_location, show_distance')
        .eq('user_id', user.id)
        .maybeSingle();

      // Load from profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('allow_location_sharing, latitude, longitude, location_city, location_updated_at')
        .eq('user_id', user.id)
        .maybeSingle();

      if (prefsError) throw prefsError;
      if (profileError) throw profileError;

      if (userPrefs || profile) {
        setPreferences(prev => ({
          ...prev,
          max_distance_km: userPrefs?.max_distance_km ?? prev.max_distance_km,
          use_precise_location: userPrefs?.use_precise_location ?? prev.use_precise_location,
          show_distance: userPrefs?.show_distance ?? prev.show_distance,
          allow_location_sharing: profile?.allow_location_sharing ?? prev.allow_location_sharing,
        }));

        // Set current location if available in database
        if (profile?.latitude && profile?.longitude) {
          setLocation({
            latitude: profile.latitude,
            longitude: profile.longitude,
            city: profile.location_city,
            timestamp: new Date(profile.location_updated_at || 0).getTime(),
          });
        }
      }
    } catch (error) {
      console.error('Error loading location preferences:', error);
    }
  }, [user]);

  // Update preferences
  const updatePreferences = useCallback(async (updates: Partial<GeolocationPreferences>) => {
    if (!user) return false;

    try {
      // Update user_preferences table
      if ('max_distance_km' in updates || 'use_precise_location' in updates || 'show_distance' in updates) {
        const { error: prefsError } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            max_distance_km: updates.max_distance_km,
            use_precise_location: updates.use_precise_location,
            show_distance: updates.show_distance,
          });

        if (prefsError) throw prefsError;
      }

      // Update profiles table
      if ('allow_location_sharing' in updates) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            allow_location_sharing: updates.allow_location_sharing,
          })
          .eq('user_id', user.id);

        if (profileError) throw profileError;
      }

      setPreferences(prev => ({ ...prev, ...updates }));

      toast({
        title: "Préférences mises à jour",
        description: "Vos préférences de géolocalisation ont été sauvegardées.",
      });

      return true;
    } catch (error) {
      console.error('Error updating location preferences:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les préférences.",
        variant: "destructive",
      });
      return false;
    }
  }, [user, toast]);

  // Load location statistics
  const loadLocationStats = useCallback(async () => {
    if (!user || !location) return;

    try {
      const { data, error } = await supabase.rpc('get_location_stats');

      if (error) throw error;

      if (data && data.length > 0) {
        setLocationStats(data[0]);
      }
    } catch (error) {
      console.error('Error loading location stats:', error);
    }
  }, [user, location]);

  // Calculate distance between two coordinates
  const calculateDistance = useCallback((
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  // Clear location data
  const clearLocation = useCallback(async () => {
    setLocation(null);
    stopWatching();

    if (user) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            latitude: null,
            longitude: null,
            location_accuracy: null,
            location_updated_at: null,
            location_city: null,
            location_country: null,
            location_region: null,
          })
          .eq('user_id', user.id);

        if (error) throw error;

        toast({
          title: "Position supprimée",
          description: "Votre position a été supprimée de votre profil.",
        });
      } catch (error) {
        console.error('Error clearing location:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer votre position.",
          variant: "destructive",
        });
      }
    }
  }, [user, toast, stopWatching]);

  // Initialize
  useEffect(() => {
    checkPermission();
    if (user) {
      loadPreferences();
    }
  }, [user, checkPermission, loadPreferences]);

  // Load stats when location changes
  useEffect(() => {
    if (location && user) {
      loadLocationStats();
    }
  }, [location, user, loadLocationStats]);

  return {
    location,
    locationStats,
    preferences,
    loading,
    permission,
    watchId: watchId !== null,
    requestLocation,
    startWatching,
    stopWatching,
    updatePreferences,
    loadLocationStats,
    calculateDistance,
    clearLocation,
  };
};