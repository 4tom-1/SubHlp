'use client';

import { useAuth } from '@/app/contexts/AuthContext';
import { Button } from '@/components/ui/button';
// import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export function Auth() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <div className="h-10 w-24 animate-pulse bg-gray-200 rounded-md"></div>;
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        {/* <Avatar>
          <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
          <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
        </Avatar> */}
        <div className="text-sm">
          <div>{user.displayName || user.email}</div>
        </div>
        <Button onClick={logout} variant="outline">
          ログアウト
        </Button>
      </div>
    );
  }

  // ログインしていない場合は何も表示しない（ログインページにリダイレクトされるため）
  return null;
} 