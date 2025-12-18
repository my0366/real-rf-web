import React, { useEffect, useState } from 'react';
import { Button, Input, Textarea, Card } from '../components/ui';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

const STORAGE_KEY = 'rf_notes_v1';

const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setNotes(JSON.parse(raw));
    } catch (e) {
      console.error('로컬스토리지에서 메모를 불러오는 중 오류', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error('로컬스토리지에 저장 중 오류', e);
    }
  }, [notes]);

  const addNote = () => {
    if (!title.trim() && !content.trim()) return;
    const newNote: Note = {
      id: String(Date.now()),
      title: title.trim() || '제목 없음',
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };
    setNotes(prev => [newNote, ...prev]);
    setTitle('');
    setContent('');
  };

  const deleteNote = (id: string) => {
    if (!confirm('이 메모를 삭제할까요?')) return;
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const filtered = notes.filter(
    n =>
      n.title.toLowerCase().includes(query.toLowerCase()) ||
      n.content.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="page-header">
          <h1 className="page-title">내 기록</h1>
          <p className="page-subtitle">배운 내용을 기록하고 복습하세요</p>
        </div>
        <Input
          placeholder="검색..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="sm:max-w-sm"
        />
      </div>

      <Card className="card-standard">
        <h3 className="text-lg font-semibold mb-4">새 메모 추가</h3>
        <div className="space-y-3">
          <Input
            placeholder="제목 (선택)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addNote()}
          />
          <Textarea
            placeholder="내용을 입력하세요"
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={6}
          />
          <div className="flex gap-2">
            <Button onClick={addNote}>➕ 저장</Button>
            <Button
              variant="secondary"
              onClick={() => {
                setTitle('');
                setContent('');
              }}
            >
              취소
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="bg-gray-50 px-4 md:px-6 py-4 border-b border-gray-200 -m-4 md:-m-6 mb-4 md:mb-6">
          <h3 className="text-lg font-semibold">내 메모 ({filtered.length})</h3>
        </div>

        {filtered.length === 0 ? (
          <div className="state-empty">
            <p className="state-empty-title">저장된 메모가 없습니다</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {filtered.map(note => (
              <div key={note.id} className="p-4 md:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-medium truncate">
                        {note.title}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {new Date(note.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                      {note.content}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteNote(note.id)}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default NotesPage;
