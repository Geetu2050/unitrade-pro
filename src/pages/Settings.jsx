import { useState } from 'react'
import { useUserStore } from '../store/useUserStore'
import { 
  UserIcon, 
  BellIcon, 
  ShieldCheckIcon, 
  CogIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline'

const Settings = () => {
  const { user } = useUserStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [showSuccess, setShowSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    firstName: '',
    lastName: '',
  })

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    tradeAlerts: true,
    priceAlerts: false,
    weeklyReports: true,
  })

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'preferences', name: 'Preferences', icon: CogIcon },
  ]

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSecurityChange = (e) => {
    setSecurityData({
      ...securityData,
      [e.target.name]: e.target.value,
    })
  }

  const handleNotificationChange = (e) => {
    setNotifications({
      ...notifications,
      [e.target.name]: e.target.checked,
    })
  }

  const handleSave = (section) => {
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
    
    // Here you would typically make an API call to save the settings
    console.log(`Saving ${section}:`, { profileData, securityData, notifications })
  }

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-dark-300 mb-2">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={profileData.firstName}
              onChange={handleProfileChange}
              className="input-field"
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-dark-300 mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={profileData.lastName}
              onChange={handleProfileChange}
              className="input-field"
              placeholder="Enter your last name"
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-dark-300 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={profileData.username}
              onChange={handleProfileChange}
              className="input-field"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-dark-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
              className="input-field"
              placeholder="Enter your email"
            />
          </div>
        </div>
      </div>
      <button
        onClick={() => handleSave('profile')}
        className="btn-primary"
      >
        Save Profile Changes
      </button>
    </div>
  )

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-dark-300 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="currentPassword"
                name="currentPassword"
                value={securityData.currentPassword}
                onChange={handleSecurityChange}
                className="input-field pr-12"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-dark-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={securityData.newPassword}
              onChange={handleSecurityChange}
              className="input-field"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-300 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={securityData.confirmPassword}
              onChange={handleSecurityChange}
              className="input-field"
              placeholder="Confirm new password"
            />
          </div>
        </div>
      </div>
      <button
        onClick={() => handleSave('security')}
        className="btn-primary"
      >
        Update Password
      </button>
    </div>
  )

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-4 bg-dark-800/50 rounded-lg">
              <div>
                <h4 className="text-white font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <p className="text-dark-400 text-sm">
                  {key === 'emailNotifications' && 'Receive notifications via email'}
                  {key === 'pushNotifications' && 'Receive push notifications in browser'}
                  {key === 'tradeAlerts' && 'Get notified when trades are executed'}
                  {key === 'priceAlerts' && 'Get notified when prices reach target levels'}
                  {key === 'weeklyReports' && 'Receive weekly portfolio performance reports'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name={key}
                  checked={value}
                  onChange={handleNotificationChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={() => handleSave('notifications')}
        className="btn-primary"
      >
        Save Notification Settings
      </button>
    </div>
  )

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Application Preferences</h3>
        <div className="space-y-6">
          <div className="p-4 bg-dark-800/50 rounded-lg">
            <h4 className="text-white font-medium mb-2">Theme</h4>
            <p className="text-dark-400 text-sm mb-4">Choose your preferred theme</p>
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg">
                Dark Mode
              </button>
              <button className="px-4 py-2 bg-dark-700 text-dark-300 rounded-lg hover:bg-dark-600">
                Light Mode
              </button>
            </div>
          </div>
          
          <div className="p-4 bg-dark-800/50 rounded-lg">
            <h4 className="text-white font-medium mb-2">Currency</h4>
            <p className="text-dark-400 text-sm mb-4">Default currency for displaying values</p>
            <select className="input-field w-48">
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="JPY">JPY - Japanese Yen</option>
            </select>
          </div>
          
          <div className="p-4 bg-dark-800/50 rounded-lg">
            <h4 className="text-white font-medium mb-2">Language</h4>
            <p className="text-dark-400 text-sm mb-4">Interface language</p>
            <select className="input-field w-48">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>
      </div>
      <button
        onClick={() => handleSave('preferences')}
        className="btn-primary"
      >
        Save Preferences
      </button>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-dark-400">Manage your account settings and preferences</p>
      </div>

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-neon-green text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-slide-up">
          <CheckCircleIcon className="w-6 h-6" />
          <span className="font-medium">Settings saved successfully!</span>
        </div>
      )}

      {/* Settings Tabs */}
      <div className="glass-effect rounded-2xl overflow-hidden">
        <div className="border-b border-dark-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-neon-blue text-neon-blue'
                    : 'border-transparent text-dark-400 hover:text-white hover:border-dark-600'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-8">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'security' && renderSecurityTab()}
          {activeTab === 'notifications' && renderNotificationsTab()}
          {activeTab === 'preferences' && renderPreferencesTab()}
        </div>
      </div>
    </div>
  )
}

export default Settings

