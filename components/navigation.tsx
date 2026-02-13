'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  TrendingUp,
  FileText,
  Download,
  Settings,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
  { href: '/analytics', label: 'Analytics', icon: <TrendingUp className="w-5 h-5" /> },
  { href: '/documents', label: 'Documents', icon: <FileText className="w-5 h-5" /> },
  { href: '/export', label: 'Export', icon: <Download className="w-5 h-5" /> },
  { href: '/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
]

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav
        className={cn(
          'fixed left-0 top-0 h-screen w-64 bg-secondary/50 border-r border-border p-6 transition-transform duration-300 md:translate-x-0 z-40',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 mt-12 md:mt-0">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-accent">
            <BarChart3 className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-foreground">IAnSI</h1>
            <p className="text-xs text-muted-foreground">Dashboard</p>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="space-y-2">
          {navItems.map(item => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Footer Info */}
        <div className="absolute bottom-6 left-6 right-6 p-4 rounded-lg border border-border bg-background/50">
          <p className="text-xs text-muted-foreground font-medium uppercase">
            Marine Department
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Intelligence & Analysis System
          </p>
        </div>
      </nav>

      {/* Main content offset */}
      <div className="md:ml-64" />
    </>
  )
}
