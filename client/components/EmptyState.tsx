import React from 'react';
import { View, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/Button';
import { Spacing } from '@/constants/theme';

interface EmptyStateProps {
  image: ImageSourcePropType;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  image,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} resizeMode="contain" />
      <ThemedText type="h3" style={styles.title}>
        {title}
      </ThemedText>
      {description ? (
        <ThemedText type="small" style={styles.description}>
          {description}
        </ThemedText>
      ) : null}
      {actionLabel && onAction ? (
        <Button onPress={onAction} style={styles.button}>
          {actionLabel}
        </Button>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['3xl'],
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: Spacing.xl,
    opacity: 0.8,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  description: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: Spacing.xl,
  },
  button: {
    paddingHorizontal: Spacing['3xl'],
  },
});
