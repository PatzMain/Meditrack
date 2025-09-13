import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit, Save, X, Camera, Key, Bell, Globe, Eye, EyeOff } from 'lucide-react';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
  department?: string;
  position?: string;
  date_joined: string;
  last_login?: string;
  avatar?: string;
  bio?: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: boolean;
    email_notifications: boolean;
  };
}

const Profile = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Get current user from localStorage
  useEffect(() => {
    const getCurrentUser = () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          const defaultProfile: UserProfile = {
            id: user.id || '1',
            full_name: user.full_name || 'User',
            email: user.email || 'user@example.com',
            phone: user.phone || '',
            address: user.address || '',
            role: user.role || 'staff',
            department: user.department || '',
            position: user.position || '',
            date_joined: user.date_joined || new Date().toISOString(),
            last_login: user.last_login || new Date().toISOString(),
            avatar: user.avatar || '',
            bio: user.bio || '',
            preferences: {
              theme: 'light',
              language: 'en',
              notifications: true,
              email_notifications: true
            }
          };
          setProfile(defaultProfile);
          setEditedProfile(defaultProfile);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    getCurrentUser();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({ ...profile! });
  };

  const handleSave = () => {
    if (editedProfile) {
      setProfile(editedProfile);
      // Update localStorage
      try {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...currentUser, ...editedProfile };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Error saving profile:', error);
      }
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile! });
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      alert('New passwords do not match');
      return;
    }
    if (passwords.new.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    // Here you would normally make an API call to change the password
    alert('Password changed successfully!');
    setPasswords({ current: '', new: '', confirm: '' });
    setShowPasswordChange(false);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (editedProfile) {
          setEditedProfile({ ...editedProfile, avatar: result });
        } else if (profile) {
          setProfile({ ...profile, avatar: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'superadmin': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'doctor': return 'bg-green-100 text-green-800';
      case 'nurse': return 'bg-teal-100 text-teal-800';
      case 'staff': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 0, name: 'Profile Info', icon: User },
    { id: 1, name: 'Security', icon: Key },
    { id: 2, name: 'Preferences', icon: Bell },
    { id: 3, name: 'Activity', icon: Globe }
  ];

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  const ProfileInfoTab = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <div className="flex items-start space-x-6">
          <div className="relative">
            <div className="h-24 w-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              {(editedProfile?.avatar || profile.avatar) ? (
                <img src={editedProfile?.avatar || profile.avatar} alt="Profile" className="h-24 w-24 rounded-full object-cover" />
              ) : (
                <User className="h-12 w-12 text-white" />
              )}
            </div>
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 hover:bg-blue-600 transition-colors cursor-pointer"
            >
              <Camera className="h-4 w-4 text-white" />
            </label>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{profile.full_name}</h2>
                <div className="flex items-center space-x-3 mt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(profile.role)}`}>
                    <Shield className="h-4 w-4 mr-1" />
                    {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                  </span>
                  {profile.department && (
                    <span className="text-sm text-gray-600">• {profile.department}</span>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {isEditing ? (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={editedProfile?.bio || ''}
                  onChange={(e) => setEditedProfile({ ...editedProfile!, bio: e.target.value })}
                  rows={3}
                  placeholder="Tell us about yourself..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            ) : (
              <p className="text-gray-600 mt-4">{profile.bio || 'No bio provided yet.'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedProfile?.email || ''}
                  onChange={(e) => setEditedProfile({ ...editedProfile!, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center text-gray-900">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  {profile.email}
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedProfile?.phone || ''}
                  onChange={(e) => setEditedProfile({ ...editedProfile!, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center text-gray-900">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  {profile.phone || 'Not provided'}
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              {isEditing ? (
                <textarea
                  value={editedProfile?.address || ''}
                  onChange={(e) => setEditedProfile({ ...editedProfile!, address: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-start text-gray-900">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                  {profile.address || 'Not provided'}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile?.position || ''}
                  onChange={(e) => setEditedProfile({ ...editedProfile!, position: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profile.position || 'Not specified'}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile?.department || ''}
                  onChange={(e) => setEditedProfile({ ...editedProfile!, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profile.department || 'Not specified'}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Joined</label>
              <div className="flex items-center text-gray-900">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                {new Date(profile.date_joined).toLocaleDateString()}
              </div>
            </div>
            
            {profile.last_login && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Login</label>
                <p className="text-gray-900">{new Date(profile.last_login).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const SecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Password & Security</h3>
        
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <Key className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Keep your account secure by using a strong password and enabling two-factor authentication.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Password</h4>
              <p className="text-sm text-gray-600">Last changed 30 days ago</p>
            </div>
            <button
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Change Password
            </button>
          </div>
          
          {showPasswordChange && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-4">Change Password</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPasswords.current ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPasswords.new ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPasswords.confirm ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                    </button>
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={handlePasswordChange}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Update Password
                  </button>
                  <button
                    onClick={() => setShowPasswordChange(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const PreferencesTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Theme</h4>
              <p className="text-sm text-gray-600">Choose your preferred theme</p>
            </div>
            <select
              value={profile.preferences.theme}
              onChange={(e) => setProfile({ 
                ...profile, 
                preferences: { ...profile.preferences, theme: e.target.value as 'light' | 'dark' | 'system' }
              })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Language</h4>
              <p className="text-sm text-gray-600">Select your preferred language</p>
            </div>
            <select
              value={profile.preferences.language}
              onChange={(e) => setProfile({ 
                ...profile, 
                preferences: { ...profile.preferences, language: e.target.value }
              })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="fil">Filipino</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Push Notifications</h4>
              <p className="text-sm text-gray-600">Receive notifications in the app</p>
            </div>
            <button
              onClick={() => setProfile({ 
                ...profile, 
                preferences: { ...profile.preferences, notifications: !profile.preferences.notifications }
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                profile.preferences.notifications ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  profile.preferences.notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Email Notifications</h4>
              <p className="text-sm text-gray-600">Receive notifications via email</p>
            </div>
            <button
              onClick={() => setProfile({ 
                ...profile, 
                preferences: { ...profile.preferences, email_notifications: !profile.preferences.email_notifications }
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                profile.preferences.email_notifications ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  profile.preferences.email_notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ActivityTab = () => {
    const mockActivities = [
      { id: 1, action: 'Profile Updated', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), type: 'update', details: 'Updated contact information' },
      { id: 2, action: 'Password Changed', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), type: 'security', details: 'Password successfully changed' },
      { id: 3, action: 'Login', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), type: 'login', details: 'Logged in from Chrome on Windows' },
      { id: 4, action: 'Profile Viewed', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), type: 'view', details: 'Profile page accessed' },
      { id: 5, action: 'Settings Updated', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), type: 'update', details: 'Notification preferences updated' },
      { id: 6, action: 'Login', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), type: 'login', details: 'Logged in from Chrome on Windows' },
    ];

    const getActivityIcon = (type: string) => {
      switch (type) {
        case 'login': return <User className="h-4 w-4" />;
        case 'security': return <Key className="h-4 w-4" />;
        case 'update': return <Edit className="h-4 w-4" />;
        case 'view': return <Eye className="h-4 w-4" />;
        default: return <Globe className="h-4 w-4" />;
      }
    };

    const getActivityColor = (type: string) => {
      switch (type) {
        case 'login': return 'bg-green-100 text-green-600';
        case 'security': return 'bg-red-100 text-red-600';
        case 'update': return 'bg-blue-100 text-blue-600';
        case 'view': return 'bg-gray-100 text-gray-600';
        default: return 'bg-gray-100 text-gray-600';
      }
    };

    return (
      <div className="space-y-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {mockActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{activity.action}</h4>
                    <span className="text-sm text-gray-500">
                      {activity.timestamp.toLocaleDateString()} at {activity.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{activity.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Login Sessions */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Globe className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Current Session</h4>
                  <p className="text-sm text-gray-600">Chrome on Windows • {new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Active</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Globe className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Previous Session</h4>
                  <p className="text-sm text-gray-600">Chrome on Windows • {new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-red-100 text-red-600 hover:bg-red-200 rounded-full text-sm font-medium transition-colors">
                Revoke
              </button>
            </div>
          </div>
        </div>

        {/* Account Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 text-center">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Member Since</h4>
            <p className="text-sm text-gray-600 mt-1">{new Date(profile.date_joined).toLocaleDateString()}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 text-center">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <User className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Total Logins</h4>
            <p className="text-sm text-gray-600 mt-1">127 times</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 text-center">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Security Score</h4>
            <p className="text-sm text-gray-600 mt-1">Excellent</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-3 tracking-tight">👤 User Profile</h1>
                <p className="text-blue-100 text-lg">Manage your account settings and preferences</p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <User className="h-16 w-16 text-white/90 mx-auto mb-2" />
                  <p className="text-sm text-blue-100 text-center">Profile Settings</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-8 -right-8 opacity-20">
            <User className="h-32 w-32 text-white" />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white rounded-2xl p-2 shadow-xl border border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 flex-1 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">{tab.name}</span>
                <span className="sm:hidden">Tab {tab.id + 1}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 0 && <ProfileInfoTab />}
          {activeTab === 1 && <SecurityTab />}
          {activeTab === 2 && <PreferencesTab />}
          {activeTab === 3 && <ActivityTab />}
        </div>
      </div>
    </div>
  );
};

export default Profile;