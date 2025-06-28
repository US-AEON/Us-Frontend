import React from 'react';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: 'none',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          title: '도움말',
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          title: '마이페이지',
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="workspace"
        options={{
          title: '워크스페이스',
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="record"
        options={{
          title: '녹음',
          tabBarButton: () => null,
        }}
      />
    </Tabs>
  );
} 