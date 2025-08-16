import React from 'react'

export const Sidebar = ({ className = '', children, ...props }) => (
  <div className={`flex h-full w-64 flex-col border-r bg-background ${className}`} {...props}>
    {children}
  </div>
)

export const SidebarHeader = ({ className = '', children, ...props }) => (
  <div className={`flex h-16 items-center border-b px-6 ${className}`} {...props}>
    {children}
  </div>
)

export const SidebarContent = ({ className = '', children, ...props }) => (
  <div className={`flex-1 overflow-auto ${className}`} {...props}>
    {children}
  </div>
)

export const SidebarFooter = ({ className = '', children, ...props }) => (
  <div className={`border-t p-6 ${className}`} {...props}>
    {children}
  </div>
) 