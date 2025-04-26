import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import Navbar from './components/Navbar';

import './global.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <View className="flex-1 items-center justify-center">
            <Text className="text-2xl font-bold">Trang chủ</Text>
          </View>
        );
      case 'search':
        return (
          <View className="flex-1 items-center justify-center">
            <Text className="text-2xl font-bold">Tìm kiếm</Text>
          </View>
        );
      case 'courses':
        return (
          <View className="flex-1 items-center justify-center">
            <Text className="text-2xl font-bold">Khoá học</Text>
          </View>
        );
      case 'profile':
        return (
          <View className="flex-1 items-center justify-center">
            <Text className="text-2xl font-bold">Cá nhân</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="auto" />
      {renderContent()}
      <Navbar activeTab={activeTab} onChangeTab={setActiveTab} />
    </SafeAreaView>
  );
}
