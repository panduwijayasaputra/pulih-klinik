'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowPathIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

export interface TableColumn<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface TableAction<T> {
  key: string;
  label: string | ((item: T) => string);
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  onClick: (item: T) => void;
  disabled?: (item: T) => boolean;
  loading?: (item: T) => boolean;
  show?: (item: T) => boolean;
}

export interface DataTableProps<T> {
  title: string;
  description?: string;
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  loading?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  filters?: {
    key: string;
    label: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
  }[];
  refreshAction?: {
    label: string;
    onClick: () => void;
    loading?: boolean;
  };
  createAction?: {
    label: string;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    onClick: () => void;
  };
}

export function DataTable<T extends { id: string }>({
  title,
  description,
  data,
  columns,
  actions = [],
  loading = false,
  emptyMessage = 'Tidak ada data yang ditemukan',
  loadingMessage = 'Memuat data...',
  searchPlaceholder = 'Cari...',
  searchKeys = [],
  filters = [],
  refreshAction,
  createAction,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');

  const filteredData = data.filter((item) => {
    if (!search.trim()) return true;
    
    return searchKeys.some((key) => {
      const value = item[key];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(search.toLowerCase());
      }
      return false;
    });
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex items-center gap-2">
            {refreshAction && (
              <Button
                onClick={refreshAction.onClick}
                disabled={refreshAction.loading}
                variant="outline"
                size="sm"
              >
                {refreshAction.loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2" />
                    Memperbarui...
                  </>
                ) : (
                  <>
                    <ArrowPathIcon className="w-4 h-4 mr-2" />
                    {refreshAction.label}
                  </>
                )}
              </Button>
            )}
            {createAction && (
              <Button
                onClick={createAction.onClick}
                variant="default"
                size="sm"
              >
                {createAction.icon && <createAction.icon className="w-4 h-4 mr-2" />}
                {createAction.label}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filters */}
        {(searchKeys.length > 0 || filters.length > 0) && (
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            {searchKeys.length > 0 && (
              <div className="relative md:flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-9"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
            <div className="flex gap-2">
              {filters.map((filter) => (
                <Select key={filter.key} value={filter.value} onValueChange={filter.onChange}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder={filter.label} />
                  </SelectTrigger>
                  <SelectContent>
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="text-left p-3 font-medium"
                    style={{ width: column.width }}
                  >
                    {column.header}
                  </th>
                ))}
                {actions.length > 0 && (
                  <th className="text-left p-3 font-medium">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="p-6 text-center text-gray-500" colSpan={columns.length + (actions.length > 0 ? 1 : 0)}>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600" />
                      <span>{loadingMessage}</span>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td className="p-6 text-center text-gray-500" colSpan={columns.length + (actions.length > 0 ? 1 : 0)}>
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    {columns.map((column) => (
                      <td key={column.key} className="p-3">
                        {column.render(item)}
                      </td>
                    ))}
                    {actions.length > 0 && (
                      <td className="p-3">
                        <div className="flex gap-2">
                          {actions
                            .filter((action) => !action.show || action.show(item))
                            .map((action) => {
                              const Icon = action.icon;
                              const isDisabled = action.disabled?.(item) || false;
                              const isLoading = action.loading?.(item) || false;

                              const label = typeof action.label === 'function' ? action.label(item) : action.label;
                              
                              return (
                                <Button
                                  key={action.key}
                                  size={action.size || 'sm'}
                                  variant={action.variant || 'outline'}
                                  onClick={() => action.onClick(item)}
                                  disabled={isDisabled || isLoading}
                                >
                                  {isLoading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                                  ) : (
                                    <>
                                      {Icon && <Icon className="w-4 h-4 mr-1" />}
                                      {label}
                                    </>
                                  )}
                                </Button>
                              );
                            })}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
