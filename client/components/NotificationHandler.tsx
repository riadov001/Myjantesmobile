import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useNavigation, NavigationContainerRef } from '@react-navigation/native';
import { useReservations } from '@/hooks/useApi';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useAuth } from '@/contexts/AuthContext';

export function NotificationHandler({ navigationRef }: { navigationRef: React.RefObject<NavigationContainerRef<any> | null> }) {
  const { user } = useAuth();
  const { isEnabled, scheduleAppointmentReminder } = usePushNotifications();
  const { data: reservations } = useReservations();
  const scheduledRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!isEnabled || !reservations || Platform.OS === 'web') return;

    const upcomingReservations = reservations.filter(r => {
      const resDate = new Date(r.date);
      return resDate > new Date() && (r.status === 'confirmed' || r.status === 'pending');
    });

    for (const reservation of upcomingReservations) {
      const key = `${reservation.id}`;
      if (scheduledRef.current.has(key)) continue;

      const resDate = new Date(reservation.date);
      if (reservation.time) {
        const [hours, minutes] = reservation.time.split(':').map(Number);
        resDate.setHours(hours || 0, minutes || 0, 0, 0);
      }

      scheduleAppointmentReminder(
        reservation.id,
        reservation.serviceName || 'votre service',
        resDate,
        60,
      );

      scheduleAppointmentReminder(
        reservation.id,
        reservation.serviceName || 'votre service',
        resDate,
        1440,
      );

      scheduledRef.current.add(key);
    }
  }, [isEnabled, reservations]);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response: Notifications.NotificationResponse) => {
      const data = response.notification.request.content.data;
      if (!navigationRef.current) return;

      try {
        if (data?.type === 'reservation_reminder' && data?.reservationId) {
          if (user?.role === 'admin' || user?.role === 'superadmin') {
            navigationRef.current.navigate('AdminReservations');
          } else {
            navigationRef.current.navigate('Main', { screen: 'ReservationsTab' });
          }
        } else if (data?.type === 'quote_update' && data?.quoteId) {
          navigationRef.current.navigate('QuoteDetail', { quoteId: data.quoteId });
        } else if (data?.type === 'invoice_update' && data?.invoiceId) {
          navigationRef.current.navigate('InvoiceDetail', { invoiceId: data.invoiceId });
        }
      } catch (error) {
        console.error('Notification navigation error:', error);
      }
    });

    return () => subscription.remove();
  }, [navigationRef, user]);

  return null;
}
