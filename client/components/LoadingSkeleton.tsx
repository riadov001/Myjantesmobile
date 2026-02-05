import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { BorderRadius, Spacing } from '@/constants/theme';

interface LoadingSkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function LoadingSkeleton({
  width = '100%',
  height = 20,
  borderRadius = BorderRadius.xs,
  style,
}: LoadingSkeletonProps) {
  const { theme, isDark } = useTheme();
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: isDark ? theme.backgroundTertiary : theme.backgroundSecondary,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

export function QuoteCardSkeleton() {
  return (
    <View style={styles.cardSkeleton}>
      <View style={styles.cardHeader}>
        <LoadingSkeleton width={120} height={16} />
        <LoadingSkeleton width={80} height={24} borderRadius={BorderRadius.full} />
      </View>
      <LoadingSkeleton width="60%" height={14} style={{ marginTop: Spacing.sm }} />
      <LoadingSkeleton width="40%" height={14} style={{ marginTop: Spacing.xs }} />
      <View style={styles.cardFooter}>
        <LoadingSkeleton width={100} height={20} />
      </View>
    </View>
  );
}

export function InvoiceCardSkeleton() {
  return (
    <View style={styles.cardSkeleton}>
      <View style={styles.cardHeader}>
        <LoadingSkeleton width={100} height={16} />
        <LoadingSkeleton width={70} height={24} borderRadius={BorderRadius.full} />
      </View>
      <LoadingSkeleton width="50%" height={14} style={{ marginTop: Spacing.sm }} />
      <View style={styles.cardFooter}>
        <LoadingSkeleton width={80} height={20} />
        <LoadingSkeleton width={100} height={14} />
      </View>
    </View>
  );
}

export function StatCardSkeleton() {
  return (
    <View style={styles.statSkeleton}>
      <LoadingSkeleton width={40} height={40} borderRadius={BorderRadius.sm} />
      <LoadingSkeleton width="60%" height={24} style={{ marginTop: Spacing.sm }} />
      <LoadingSkeleton width="40%" height={14} style={{ marginTop: Spacing.xs }} />
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {},
  cardSkeleton: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  statSkeleton: {
    padding: Spacing.lg,
    alignItems: 'flex-start',
  },
});
