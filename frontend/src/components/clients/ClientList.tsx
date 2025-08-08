'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Client } from '@/types/client';
import { ClientStatusEnum } from '@/types/enums';
import { 
  EyeIcon,
  PencilIcon,
  UserPlusIcon,
  ArchiveBoxIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

export interface ClientListProps {
  clients?: Client[];
  onView?: (clientId: string) => void;
  onEdit?: (clientId: string) => void;
  onAssign?: (clientId: string) => void;
  onArchive?: (clientId: string) => void;
}

const STATUS_LABEL: Record<string, string> = {
  [ClientStatusEnum.Active]: 'Aktif',
  [ClientStatusEnum.Inactive]: 'Tidak Aktif',
  [ClientStatusEnum.Completed]: 'Selesai',
  [ClientStatusEnum.Pending]: 'Menunggu',
};

const getStatusBadge = (status: Client['status']) => {
  switch (status) {
    case ClientStatusEnum.Active:
      return <Badge variant="success">{STATUS_LABEL[status]}</Badge>;
    case ClientStatusEnum.Completed:
      return <Badge variant="outline">{STATUS_LABEL[status]}</Badge>;
    case ClientStatusEnum.Pending:
      return <Badge variant="warning">{STATUS_LABEL[status]}</Badge>;
    case ClientStatusEnum.Inactive:
    default:
      return <Badge variant="destructive">{STATUS_LABEL[status] ?? status}</Badge>;
  }
};

export const ClientList: React.FC<ClientListProps> = ({
  clients: clientsProp,
  onView,
  onEdit,
  onAssign,
  onArchive,
}) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | Client['status']>('all');

  // Temporary mock if no clients passed
  const mockClients: Client[] = useMemo(() => (
    [
      {
        id: 'c-001',
        name: 'Andi Wijaya',
        age: 29,
        gender: 'male' as Client['gender'],
        phone: '+62-812-1111-2222',
        email: 'andi@example.com',
        occupation: 'Karyawan',
        education: 'Bachelor',
        address: 'Jl. Sudirman No. 1, Jakarta',
        status: 'active',
        joinDate: '2024-01-20',
        totalSessions: 3,
        primaryIssue: 'Kecemasan',
        progress: 40,
      },
      {
        id: 'c-002',
        name: 'Siti Rahma',
        age: 34,
        gender: 'female' as Client['gender'],
        phone: '+62-812-3333-4444',
        email: 'siti@example.com',
        occupation: 'Wiraswasta',
        education: 'Master',
        address: 'Jl. Asia Afrika No. 7, Bandung',
        status: 'pending',
        joinDate: '2024-02-02',
        totalSessions: 0,
        primaryIssue: 'Depresi',
        progress: 0,
      },
    ]
  ), []);

  const clients = clientsProp ?? mockClients;

  const filtered = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = status === 'all' ? true : c.status === status;
    return matchesSearch && matchesStatus;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Klien</CardTitle>
        <CardDescription>Kelola klien, lihat detail, dan atur penugasan therapist</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative md:flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari nama, email, atau telepon..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Select value={status} onValueChange={(v) => setStatus(v as any)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                {Object.values(ClientStatusEnum).map((s) => (
                  <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left p-3 font-medium">Klien</th>
                <th className="text-left p-3 font-medium">Kontak</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Bergabung</th>
                <th className="text-left p-3 font-medium">Sesi</th>
                <th className="text-left p-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td className="p-6 text-center text-gray-500" colSpan={6}>
                    Tidak ada klien yang cocok
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <div className="font-medium text-gray-900">{c.name}</div>
                      <div className="text-xs text-gray-500">{c.primaryIssue}</div>
                    </td>
                    <td className="p-3">
                      <div>{c.phone}</div>
                      <div className="text-xs text-gray-500">{c.email}</div>
                    </td>
                    <td className="p-3">{getStatusBadge(c.status)}</td>
                    <td className="p-3 text-gray-600">{new Date(c.joinDate).toLocaleDateString('id-ID')}</td>
                    <td className="p-3 text-gray-600">{c.totalSessions}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => onView ? onView(c.id) : null}>
                          <EyeIcon className="w-4 h-4 mr-1" /> Lihat
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => onEdit ? onEdit(c.id) : null}>
                          <PencilIcon className="w-4 h-4 mr-1" /> Ubah
                        </Button>
                        <Button size="sm" onClick={() => onAssign ? onAssign(c.id) : null}>
                          <UserPlusIcon className="w-4 h-4 mr-1" /> Assign
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => onArchive ? onArchive(c.id) : null}>
                          <ArchiveBoxIcon className="w-4 h-4 mr-1" /> Arsipkan
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientList;


