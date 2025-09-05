import React from 'react';
import { ActivityIndicator } from 'react-native';

import { Text, View } from './index';

type Props = {
  isLoading?: boolean;
  message?: string;
};

export const EmptyList: React.FC<Props> = ({ isLoading, message }) => {
  return (
    <View className="items-center justify-center py-10">
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <Text className="text-neutral-500">{message ?? 'No items found'}</Text>
      )}
    </View>
  );
};

EmptyList.displayName = 'EmptyList';

