import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { Spacing, BorderRadius } from '@/constants/theme';

interface StatCardProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string | number;
  color?: string;
  onPress?: () => void;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function StatCard({ icon, label, value, color, onPress, trend }: StatCardProps) {
  const { theme } = useTheme();
  const iconColor = color || theme.primary;

  const content = (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.backgroundDefault },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
        <Feather name={icon} size={22} color={iconColor} />
      </View>
      <ThemedText type="h2" style={styles.value}>
        {value}
      </ThemedText>
      <View style={styles.labelRow}>
        <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
          {label}
        </ThemedText>
        {trend ? (
          <View style={styles.trendContainer}>
            <Feather
              name={trend.isPositive ? 'trending-up' : 'trending-down'}
              size={12}
              color={trend.isPositive ? theme.success : theme.error}
            />
            <ThemedText
              type="small"
              style={[
                styles.trendText,
                { color: trend.isPositive ? theme.success : theme.error },
              ]}
            >
              {trend.value}
            </ThemedText>
          </View>
        ) : null}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}>
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  value: {
    marginBottom: Spacing.xs,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {},
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
