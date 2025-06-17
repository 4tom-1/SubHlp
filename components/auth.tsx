'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

export function Auth() {
  const { user, loading, signIn, signOut } = useAuth();

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span>{user.email}</span>
        <Button onClick={signOut} variant="outline">
          ログアウト
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={signIn}>
      Googleでログイン
    </Button>
  );
} 