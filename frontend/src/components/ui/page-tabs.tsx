'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export interface TabItem {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

export interface PageTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (value: string) => void;
  className?: string;
  tabsListClassName?: string;
  tabsContentClassName?: string;
  gridCols?: number;
  showIcons?: boolean;
}

export const PageTabs: React.FC<PageTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className,
  tabsListClassName,
  tabsContentClassName,
  gridCols = tabs.length,
  showIcons = true,
}) => {
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={onTabChange} 
      className={cn("w-full", className)}
    >
      <TabsList 
        className={cn(
          "grid w-full lg:w-fit lg:flex lg:space-x-1",
          {
            "grid-cols-1": gridCols === 1,
            "grid-cols-2": gridCols === 2,
            "grid-cols-3": gridCols === 3,
            "grid-cols-4": gridCols === 4,
            "grid-cols-5": gridCols === 5,
            "grid-cols-6": gridCols === 6,
          },
          tabsListClassName
        )}
      >
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <TabsTrigger 
              key={tab.value}
              value={tab.value} 
              className="flex items-center gap-2"
            >
              {showIcons && IconComponent && (
                <IconComponent className="w-4 h-4" />
              )}
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent 
          key={tab.value}
          value={tab.value} 
          className={cn("mt-6", tabsContentClassName)}
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default PageTabs;
