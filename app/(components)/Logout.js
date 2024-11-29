'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/Authcontext';

export default function Logout() {
  const { logOut, currentUser } = useAuth();
  const pathname = usePathname();

  if (!currentUser) {
    return null;
  }

  if (pathname === '/') {
    return (
      <Link href={'/dashboard'}>
        <button>go to dashboard</button>
      </Link>
    );
  }

  return (
    <div>
        <button onClick={logOut}>Logout</button>
    </div>
  );
}