import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '@/screens/LoginScreen';
import ClientTabNavigator from '@/navigation/ClientTabNavigator';
import QuoteDetailScreen from '@/screens/client/QuoteDetailScreen';
import InvoiceDetailScreen from '@/screens/client/InvoiceDetailScreen';
import { useScreenOptions } from '@/hooks/useScreenOptions';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/useTheme';

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  QuoteDetail: { quoteId: string };
  InvoiceDetail: { invoiceId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();
  const { isAuthenticated, isLoading } = useAuth();
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.backgroundRoot }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {isAuthenticated ? (
        <>
          <Stack.Screen
            name="Main"
            component={ClientTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="QuoteDetail"
            component={QuoteDetailScreen}
            options={{
              headerTitle: 'Détail du devis',
              presentation: 'card',
            }}
          />
          <Stack.Screen
            name="InvoiceDetail"
            component={InvoiceDetailScreen}
            options={{
              headerTitle: 'Détail de la facture',
              presentation: 'card',
            }}
          />
        </>
      ) : (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}
