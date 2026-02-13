'use client'

import { useState } from 'react'
import { Settings, Save, AlertCircle, CheckCircle } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    organizationName: 'Marine Department',
    email: 'admin@marinedept.gov',
    theme: 'dark',
    dataRetention: 90,
    autoBackup: true,
    notifications: true,
    twoFactor: false,
  })

  const [saved, setSaved] = useState(false)

  const handleChange = (key: string, value: unknown) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-background md:ml-64">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-accent">
              <Settings className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Settings</h1>
              <p className="text-sm text-muted-foreground">
                Manage your dashboard preferences and configuration
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {saved && (
          <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-sm text-green-600 font-medium">Settings saved successfully</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Organization Settings */}
          <section className="rounded-lg border border-border bg-secondary/20 p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Organization</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={settings.organizationName}
                  onChange={e => handleChange('organizationName', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={e => handleChange('email', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </section>

          {/* Display Settings */}
          <section className="rounded-lg border border-border bg-secondary/20 p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Display</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Theme</label>
                <select
                  value={settings.theme}
                  onChange={e => handleChange('theme', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="dark">Dark (Default)</option>
                  <option value="light">Light</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Data Management */}
          <section className="rounded-lg border border-border bg-secondary/20 p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Data Management</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Data Retention Period (Days)
                </label>
                <input
                  type="number"
                  value={settings.dataRetention}
                  onChange={e => handleChange('dataRetention', parseInt(e.target.value))}
                  min="30"
                  max="365"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Data older than this will be automatically archived
                </p>
              </div>
            </div>
          </section>

          {/* Security Settings */}
          <section className="rounded-lg border border-border bg-secondary/20 p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Security</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50">
                <div>
                  <h3 className="font-medium text-foreground">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.twoFactor}
                  onChange={e => handleChange('twoFactor', e.target.checked)}
                  className="w-5 h-5 rounded"
                />
              </div>
            </div>
          </section>

          {/* Backup & Recovery */}
          <section className="rounded-lg border border-border bg-secondary/20 p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Backup & Recovery</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50">
                <div>
                  <h3 className="font-medium text-foreground">Automatic Backups</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Daily automatic backup at 2:00 AM
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoBackup}
                  onChange={e => handleChange('autoBackup', e.target.checked)}
                  className="w-5 h-5 rounded"
                />
              </div>
              <button className="w-full px-4 py-2 rounded-lg border border-border hover:bg-secondary/50 transition-colors font-medium text-muted-foreground hover:text-foreground">
                Create Manual Backup
              </button>
            </div>
          </section>

          {/* Notifications */}
          <section className="rounded-lg border border-border bg-secondary/20 p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50">
                <div>
                  <h3 className="font-medium text-foreground">Email Notifications</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Receive updates about exports and system events
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={e => handleChange('notifications', e.target.checked)}
                  className="w-5 h-5 rounded"
                />
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="rounded-lg border border-red-500/30 bg-red-500/10 p-6">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-semibold text-foreground">Danger Zone</h2>
            </div>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors font-medium">
                Export All Data
              </button>
              <button className="w-full px-4 py-2 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors font-medium">
                Reset to Defaults
              </button>
              <button className="w-full px-4 py-2 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors font-medium">
                Delete All Data
              </button>
            </div>
          </section>

          {/* Save Button */}
          <div className="sticky bottom-0 flex gap-3 p-4 rounded-lg border border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <button
              onClick={handleSave}
              className="ml-auto inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors font-medium"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
