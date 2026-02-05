import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/Button';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/contexts/AuthContext';
import { Spacing, BorderRadius } from '@/constants/theme';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await login();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <LinearGradient
        colors={isDark ? ['#1a0505', '#0f0f0f'] : ['#fef2f2', '#ffffff']}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={[styles.content, { paddingTop: insets.top + Spacing['4xl'] }]}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <ThemedText type="h1" style={styles.appName}>
            MyJantes
          </ThemedText>
          <ThemedText type="body" style={[styles.tagline, { color: theme.textSecondary }]}>
            Gestion professionnelle de votre garage
          </ThemedText>
        </View>

        <View style={styles.featuresContainer}>
          <FeatureItem
            icon="file-text"
            title="Devis et Factures"
            description="Gérez vos documents en un clic"
          />
          <FeatureItem
            icon="calendar"
            title="Réservations"
            description="Planifiez vos rendez-vous"
          />
          <FeatureItem
            icon="bell"
            title="Notifications"
            description="Restez informé en temps réel"
          />
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.xl }]}>
        <Button
          onPress={handleLogin}
          disabled={isLoading}
          style={[styles.loginButton, { backgroundColor: theme.primary }]}
        >
          {isLoading ? 'Connexion...' : 'Se connecter'}
        </Button>
        <ThemedText type="small" style={[styles.terms, { color: theme.textSecondary }]}>
          En vous connectant, vous acceptez nos conditions d'utilisation
        </ThemedText>
      </View>
    </View>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  description: string;
}) {
  const { theme } = useTheme();

  return (
    <View style={styles.featureItem}>
      <View style={[styles.featureIcon, { backgroundColor: `${theme.primary}15` }]}>
        <Feather name={icon} size={24} color={theme.primary} />
      </View>
      <View style={styles.featureText}>
        <ThemedText type="h4">{title}</ThemedText>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {description}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing['4xl'],
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: Spacing.lg,
  },
  appName: {
    marginBottom: Spacing.xs,
  },
  tagline: {
    textAlign: 'center',
  },
  featuresContainer: {
    gap: Spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
    gap: 2,
  },
  footer: {
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  loginButton: {
    width: '100%',
  },
  terms: {
    textAlign: 'center',
  },
});
