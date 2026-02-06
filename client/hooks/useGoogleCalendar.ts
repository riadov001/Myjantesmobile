import { useState, useEffect, useCallback } from 'react';
import { Platform, Alert } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Reservation } from '@/types';

WebBrowser.maybeCompleteAuthSession();

const CALENDAR_TOKEN_KEY = '@myjantes_gcal_token';
const CALENDAR_EXPIRY_KEY = '@myjantes_gcal_expiry';
const CALENDAR_CONNECTED_KEY = '@myjantes_gcal_connected';
const SYNCED_EVENTS_KEY = '@myjantes_gcal_synced';

const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar.events';

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export function useGoogleCalendar() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'myjantes',
  });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID || '',
      scopes: ['profile', 'email', CALENDAR_SCOPE],
      redirectUri,
      responseType: AuthSession.ResponseType.Token,
      extraParams: {
        access_type: 'online',
        prompt: 'consent',
      },
    },
    discovery
  );

  useEffect(() => {
    loadConnectionState();
  }, []);

  useEffect(() => {
    if (response?.type === 'success' && response.params?.access_token) {
      const token = response.params.access_token;
      const expiresIn = parseInt(response.params.expires_in || '3600', 10);
      saveToken(token, expiresIn);
    }
  }, [response]);

  const loadConnectionState = async () => {
    try {
      const connected = await AsyncStorage.getItem(CALENDAR_CONNECTED_KEY);
      const token = await AsyncStorage.getItem(CALENDAR_TOKEN_KEY);
      const expiry = await AsyncStorage.getItem(CALENDAR_EXPIRY_KEY);

      if (connected === 'true' && token && expiry) {
        const expiryTime = parseInt(expiry, 10);
        if (Date.now() < expiryTime) {
          setIsConnected(true);
          setAccessToken(token);
        } else {
          setIsConnected(false);
          setAccessToken(null);
          await AsyncStorage.multiRemove([CALENDAR_TOKEN_KEY, CALENDAR_EXPIRY_KEY, CALENDAR_CONNECTED_KEY]);
        }
      }
    } catch (error) {
      console.error('Error loading calendar state:', error);
    }
  };

  const saveToken = async (token: string, expiresIn: number) => {
    try {
      const expiryTime = Date.now() + expiresIn * 1000;
      await AsyncStorage.setItem(CALENDAR_TOKEN_KEY, token);
      await AsyncStorage.setItem(CALENDAR_EXPIRY_KEY, expiryTime.toString());
      await AsyncStorage.setItem(CALENDAR_CONNECTED_KEY, 'true');
      setAccessToken(token);
      setIsConnected(true);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  };

  const ensureValidToken = async (): Promise<string | null> => {
    const expiry = await AsyncStorage.getItem(CALENDAR_EXPIRY_KEY);
    const token = await AsyncStorage.getItem(CALENDAR_TOKEN_KEY);

    if (token && expiry && Date.now() < parseInt(expiry, 10)) {
      return token;
    }

    const result = await promptAsync();
    if (result?.type === 'success' && result.params?.access_token) {
      const newToken = result.params.access_token;
      const expiresIn = parseInt(result.params.expires_in || '3600', 10);
      await saveToken(newToken, expiresIn);
      return newToken;
    }

    return null;
  };

  const connectCalendar = useCallback(async () => {
    if (!GOOGLE_CLIENT_ID) {
      Alert.alert('Erreur', 'Google Calendar n\'est pas configuré.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await promptAsync();
      if (result?.type === 'success') {
        Alert.alert('Connecté', 'Google Calendar est maintenant connecté. Vos réservations peuvent être synchronisées.');
      } else if (result?.type === 'cancel' || result?.type === 'dismiss') {
        // User cancelled
      } else {
        Alert.alert('Erreur', 'Impossible de se connecter à Google Calendar.');
      }
    } catch (error) {
      console.error('Calendar connect error:', error);
      Alert.alert('Erreur', 'Erreur lors de la connexion à Google Calendar.');
    } finally {
      setIsLoading(false);
    }
  }, [promptAsync]);

  const disconnectCalendar = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([
        CALENDAR_TOKEN_KEY,
        CALENDAR_EXPIRY_KEY,
        CALENDAR_CONNECTED_KEY,
        SYNCED_EVENTS_KEY,
      ]);
      setIsConnected(false);
      setAccessToken(null);
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  }, []);

  const createCalendarEvent = async (
    token: string,
    reservation: Reservation
  ): Promise<string | null> => {
    try {
      const resDate = new Date(reservation.date);
      let startHour = 9;
      let startMinute = 0;

      if (reservation.time) {
        const parts = reservation.time.split(':');
        startHour = parseInt(parts[0], 10) || 9;
        startMinute = parseInt(parts[1], 10) || 0;
      }

      const startDate = new Date(resDate);
      startDate.setHours(startHour, startMinute, 0, 0);

      const endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + 1);

      const event = {
        summary: `MyJantes - ${reservation.serviceName || 'Rendez-vous'}`,
        description: [
          `Service: ${reservation.serviceName || 'N/A'}`,
          reservation.notes ? `Notes: ${reservation.notes}` : '',
          `Statut: ${reservation.status}`,
          `Réf: ${reservation.id}`,
        ].filter(Boolean).join('\n'),
        start: {
          dateTime: startDate.toISOString(),
          timeZone: 'Europe/Paris',
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: 'Europe/Paris',
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 60 },
            { method: 'popup', minutes: 1440 },
          ],
        },
        colorId: '11',
      };

      const resp = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );

      if (!resp.ok) {
        const errorData = await resp.json();
        console.error('Calendar API error:', errorData);
        return null;
      }

      const data = await resp.json();
      return data.id;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      return null;
    }
  };

  const getSyncedEvents = async (): Promise<Record<string, string>> => {
    try {
      const stored = await AsyncStorage.getItem(SYNCED_EVENTS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  };

  const saveSyncedEvent = async (reservationId: string, eventId: string) => {
    try {
      const synced = await getSyncedEvents();
      synced[reservationId] = eventId;
      await AsyncStorage.setItem(SYNCED_EVENTS_KEY, JSON.stringify(synced));
    } catch (error) {
      console.error('Error saving synced event:', error);
    }
  };

  const addReservationToCalendar = useCallback(async (reservation: Reservation): Promise<boolean> => {
    setIsSyncing(true);
    try {
      const token = await ensureValidToken();
      if (!token) {
        Alert.alert(
          'Connexion requise',
          'Veuillez d\'abord connecter votre Google Calendar dans les paramètres du profil.'
        );
        return false;
      }

      const synced = await getSyncedEvents();
      if (synced[reservation.id]) {
        Alert.alert('Déjà synchronisé', 'Cette réservation est déjà dans votre Google Calendar.');
        return true;
      }

      const eventId = await createCalendarEvent(token, reservation);
      if (eventId) {
        await saveSyncedEvent(reservation.id, eventId);
        Alert.alert('Ajouté', 'La réservation a été ajoutée à votre Google Calendar.');
        return true;
      } else {
        Alert.alert('Erreur', 'Impossible d\'ajouter l\'événement au calendrier.');
        return false;
      }
    } catch (error) {
      console.error('Add to calendar error:', error);
      Alert.alert('Erreur', 'Erreur lors de l\'ajout au calendrier.');
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const syncAllReservations = useCallback(async (reservations: Reservation[]) => {
    setIsSyncing(true);
    try {
      const token = await ensureValidToken();
      if (!token) {
        Alert.alert(
          'Connexion requise',
          'Veuillez d\'abord connecter votre Google Calendar dans les paramètres du profil.'
        );
        return;
      }

      const synced = await getSyncedEvents();
      const upcoming = reservations.filter(r => {
        const resDate = new Date(r.date);
        return resDate >= new Date() && (r.status === 'confirmed' || r.status === 'pending') && !synced[r.id];
      });

      if (upcoming.length === 0) {
        Alert.alert('À jour', 'Toutes vos réservations sont déjà synchronisées.');
        return;
      }

      let successCount = 0;
      for (const reservation of upcoming) {
        const eventId = await createCalendarEvent(token, reservation);
        if (eventId) {
          await saveSyncedEvent(reservation.id, eventId);
          successCount++;
        }
      }

      Alert.alert(
        'Synchronisation terminée',
        `${successCount}/${upcoming.length} réservation(s) ajoutée(s) à votre Google Calendar.`
      );
    } catch (error) {
      console.error('Sync all error:', error);
      Alert.alert('Erreur', 'Erreur lors de la synchronisation.');
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const isReservationSynced = useCallback(async (reservationId: string): Promise<boolean> => {
    const synced = await getSyncedEvents();
    return !!synced[reservationId];
  }, []);

  return {
    isConnected,
    isLoading,
    isSyncing,
    connectCalendar,
    disconnectCalendar,
    addReservationToCalendar,
    syncAllReservations,
    isReservationSynced,
    isConfigured: !!GOOGLE_CLIENT_ID,
  };
}
