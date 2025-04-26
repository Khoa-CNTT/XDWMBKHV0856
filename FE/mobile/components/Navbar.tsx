import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NavbarItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
  onPress: () => void;
}

const NavbarItem: React.FC<NavbarItemProps> = ({ icon, label, active = false, onPress }) => {
  return (
    <TouchableOpacity
      className={`flex-1 items-center justify-center py-2 ${active ? 'border-t-2 border-blue-500' : ''}`}
      onPress={onPress}>
      <Ionicons name={icon} size={24} color={active ? '#3b82f6' : '#64748b'} />
      <Text className={`mt-1 text-xs ${active ? 'font-medium text-blue-500' : 'text-slate-500'}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

interface NavbarProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, onChangeTab }) => {
  return (
    <View className="flex-row border-t border-gray-200 bg-white shadow-sm">
      <NavbarItem
        icon="home-outline"
        label="Trang chủ"
        active={activeTab === 'home'}
        onPress={() => onChangeTab('home')}
      />
      <NavbarItem
        icon="search-outline"
        label="Tìm kiếm"
        active={activeTab === 'search'}
        onPress={() => onChangeTab('search')}
      />
      <NavbarItem
        icon="bookmark-outline"
        label="Khoá học"
        active={activeTab === 'courses'}
        onPress={() => onChangeTab('courses')}
      />
      <NavbarItem
        icon="person-outline"
        label="Cá nhân"
        active={activeTab === 'profile'}
        onPress={() => onChangeTab('profile')}
      />
    </View>
  );
};

export default Navbar;
