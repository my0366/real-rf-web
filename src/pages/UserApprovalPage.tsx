import { useState, useEffect } from 'react';
import { createSupabaseClient } from '../supabaseClient';
import type { UserStatus } from '../types/admin';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const supabase = createSupabaseClient(true); // Service role for admin operations

export default function UserApprovalPage() {
  const [users, setUsers] = useState<UserStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_status')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '사용자 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const activateUser = async (userId: string, userEmail: string) => {
    try {
      const { error } = await supabase
        .from('user_status')
        .update({
          is_active: true,
          activated_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      // 사용자 목록 새로고침
      await fetchUsers();
      alert(`${userEmail} 사용자가 활성화되었습니다.`);
    } catch (err) {
      alert(err instanceof Error ? err.message : '사용자 활성화에 실패했습니다.');
    }
  };

  const deactivateUser = async (userId: string, userEmail: string) => {
    if (!confirm(`${userEmail} 사용자를 비활성화하시겠습니까?`)) return;

    try {
      const { error } = await supabase
        .from('user_status')
        .update({
          is_active: false,
          deactivated_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      // 사용자 목록 새로고침
      await fetchUsers();
      alert(`${userEmail} 사용자가 비활성화되었습니다.`);
    } catch (err) {
      alert(err instanceof Error ? err.message : '사용자 비활성화에 실패했습니다.');
    }
  };

  const updateNotes = async (userId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('user_status')
        .update({
          notes,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      // 사용자 목록 새로고침
      await fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : '메모 업데이트에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">사용자 목록을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">사용자 승인 관리</h1>

      <div className="grid gap-6">
        {users.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-gray-500">등록된 사용자가 없습니다.</p>
          </Card>
        ) : (
          users.map((user) => (
            <UserStatusCard
              key={user.id}
              user={user}
              onActivate={activateUser}
              onDeactivate={deactivateUser}
              onUpdateNotes={updateNotes}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface UserStatusCardProps {
  user: UserStatus;
  onActivate: (userId: string, userEmail: string) => void;
  onDeactivate: (userId: string, userEmail: string) => void;
  onUpdateNotes: (userId: string, notes: string) => void;
}

function UserStatusCard({ user, onActivate, onDeactivate, onUpdateNotes }: UserStatusCardProps) {
  const [notes, setNotes] = useState(user.notes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const handleSaveNotes = () => {
    onUpdateNotes(user.user_id, notes);
    setIsEditingNotes(false);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('ko-KR');
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">{user.email}</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">사용자 ID:</span> {user.user_id}
            </div>
            <div>
              <span className="font-medium">상태:</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                user.is_active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {user.is_active ? '활성' : '비활성'}
              </span>
            </div>
            <div>
              <span className="font-medium">생성일:</span> {formatDate(user.created_at)}
            </div>
            <div>
              <span className="font-medium">수정일:</span> {formatDate(user.updated_at)}
            </div>
            {user.activated_at && (
              <div>
                <span className="font-medium">활성화일:</span> {formatDate(user.activated_at)}
              </div>
            )}
            {user.activated_by && (
              <div>
                <span className="font-medium">활성화자:</span> {user.activated_by}
              </div>
            )}
            {user.deactivated_at && (
              <div>
                <span className="font-medium">비활성화일:</span> {formatDate(user.deactivated_at)}
              </div>
            )}
            {user.deactivated_by && (
              <div>
                <span className="font-medium">비활성화자:</span> {user.deactivated_by}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 ml-4">
          {user.is_active ? (
            <Button
              variant="danger"
              onClick={() => onDeactivate(user.user_id, user.email)}
            >
              비활성화
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => onActivate(user.user_id, user.email)}
            >
              활성화
            </Button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-sm">메모:</span>
          {isEditingNotes ? (
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveNotes}>
                저장
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setNotes(user.notes || '');
                  setIsEditingNotes(false);
                }}
              >
                취소
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditingNotes(true)}
            >
              편집
            </Button>
          )}
        </div>

        {isEditingNotes ? (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md resize-none"
            rows={3}
            placeholder="사용자에 대한 메모를 입력하세요..."
          />
        ) : (
          <div className="p-2 bg-gray-50 rounded-md min-h-[60px]">
            {user.notes || '메모가 없습니다.'}
          </div>
        )}
      </div>
    </Card>
  );
}
