import React, { useState } from 'react';
import { Button, Select, Textarea, Input, Card } from './ui';
import * as XLSX from 'xlsx';
import {
  useTopics,
  useCreateQuestion,
  useCreateQuestionsBulk,
} from '../hooks/useQuestions';

// 검색어 하이라이트 컴포넌트
const QuestionForm: React.FC = () => {
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [content, setContent] = useState('');
  const [english, setEnglish] = useState('');
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [showExcelUpload, setShowExcelUpload] = useState(false);
  const [excelPreview, setExcelPreview] = useState<
    Array<{ content: string; english?: string }>
  >([]);

  // React Query 훅들
  const { data: topics = [], isLoading: topicsLoading } = useTopics();
  const createQuestion = useCreateQuestion();
  const createQuestionsBulk = useCreateQuestionsBulk();

  // 첫 번째 주제를 기본값으로 설정
  React.useEffect(() => {
    if (topics.length > 0 && !selectedTopicId) {
      setSelectedTopicId(topics[0].id);
    }
  }, [topics, selectedTopicId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTopicId || !content.trim()) return;

    try {
      await createQuestion.mutateAsync({
        topic_id: selectedTopicId,
        content: content.trim(),
        english: english.trim() || null,
      });

      setContent('');
      setEnglish('');
    } catch (error) {
      console.error('질문 등록 중 오류:', error);
    }
  };

  const bulkAddQuestions = async () => {
    if (!selectedTopicId || !content.trim()) return;

    const questions = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        const cleanLine = line.replace(/^\d+\.\s*/, '');
        let koreanContent = cleanLine;
        let englishTranslation = null;

        if (cleanLine.includes('|')) {
          const parts = cleanLine.split('|').map(part => part.trim());
          if (parts.length >= 2) {
            koreanContent = parts[0];
            englishTranslation = parts[1];
          }
        }

        return {
          topic_id: selectedTopicId,
          content: koreanContent,
          english: englishTranslation,
        };
      });

    if (questions.length === 0) return;

    try {
      await createQuestionsBulk.mutateAsync(questions);
      setContent('');
      setEnglish('');
      setShowBulkAdd(false);
    } catch (error) {
      console.error('일괄 질문 등록 중 오류:', error);
    }
  };

  // 엑셀 파일 처리 함수
  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        // 첫 번째 시트 읽기
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, {
          header: 1,
        }) as unknown[][];

        // 헤더 제외하고 데이터 파싱
        const questions = jsonData
          .slice(1) // 첫 번째 행(헤더) 제외
          .filter(row => row[0] && String(row[0]).trim()) // 첫 번째 열(단어)이 있는 행만
          .map(row => ({
            content: String(row[0]).trim(),
            english: row[1] ? String(row[1]).trim() : undefined,
          }));

        setExcelPreview(questions);
      } catch (error) {
        console.error('엑셀 파일 읽기 오류:', error);
        alert('엑셀 파일을 읽는 중 오류가 발생했습니다.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // 엑셀 데이터 일괄 등록
  const uploadExcelQuestions = async () => {
    if (!selectedTopicId || excelPreview.length === 0) return;

    const questions = excelPreview.map(item => ({
      topic_id: selectedTopicId,
      content: item.content,
      english: item.english || null,
    }));

    try {
      await createQuestionsBulk.mutateAsync(questions);
      setExcelPreview([]);
      setShowExcelUpload(false);
      // 파일 input 초기화
      const fileInput = document.getElementById(
        'excel-upload'
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('엑셀 일괄 질문 등록 중 오류:', error);
    }
  };

  // 엑셀 템플릿 다운로드 함수
  const downloadExcelTemplate = () => {
    const wb = XLSX.utils.book_new();
    const wsData = [
      ['단어', '뜻'],
      ['안녕하세요', 'Hello'],
      ['감사합니다', 'Thank you'],
      ['좋은 아침입니다', 'Good morning'],
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // 열 너비 설정
    ws['!cols'] = [{ wch: 20 }, { wch: 30 }];

    XLSX.utils.book_append_sheet(wb, ws, '질문 목록');
    XLSX.writeFile(wb, '질문_업로드_템플릿.xlsx');
  };

  // 로딩 상태
  if (topicsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-2xl mb-2">⏳</div>
          <p className="text-gray-600">주제를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* 헤더와 모드 토글 */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          질문 관리
        </h2>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={!showBulkAdd && !showExcelUpload ? 'primary' : 'secondary'}
            icon="📝"
            size="sm"
            onClick={() => {
              setShowBulkAdd(false);
              setShowExcelUpload(false);
            }}
          >
            개별 등록
          </Button>

          <Button
            variant={showBulkAdd ? 'primary' : 'secondary'}
            icon="📋"
            size="sm"
            onClick={() => {
              setShowBulkAdd(true);
              setShowExcelUpload(false);
            }}
          >
            일괄 등록
          </Button>

          <Button
            variant={showExcelUpload ? 'primary' : 'secondary'}
            icon="📂"
            size="sm"
            onClick={() => {
              setShowExcelUpload(true);
              setShowBulkAdd(false);
            }}
          >
            엑셀 업로드
          </Button>
        </div>
      </div>

      {/* 성공/에러 메시지 */}
      {createQuestion.isSuccess && (
        <Card variant="success" padding="md">
          <div className="flex items-center gap-2">
            <span className="text-lg">✅</span>
            <span className="font-medium">
              질문이 성공적으로 등록되었습니다!
            </span>
          </div>
        </Card>
      )}

      {createQuestionsBulk.isSuccess && (
        <Card variant="success" padding="md">
          <div className="flex items-center gap-2">
            <span className="text-lg">✅</span>
            <span className="font-medium">
              {createQuestionsBulk.data}개의 질문이 성공적으로 등록되었습니다!
            </span>
          </div>
        </Card>
      )}

      {/* 개별 질문 등록 */}
      {!showBulkAdd && !showExcelUpload && (
        <Card variant="primary" padding="lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            📝 개별 질문 등록
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="주제 선택"
              icon="📚"
              value={selectedTopicId}
              onChange={e => setSelectedTopicId(e.target.value)}
              required
            >
              <option value="">주제를 선택하세요</option>
              {topics.map(topic => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </Select>

            <Textarea
              label="질문 내용"
              icon="💬"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="질문 내용을 입력하세요"
              rows={4}
              required
            />

            <Input
              label="영어 (선택사항)"
              icon="🌍"
              value={english}
              onChange={e => setEnglish(e.target.value)}
              placeholder="영어 번역을 입력하세요"
            />

            <Button
              type="submit"
              disabled={!selectedTopicId || !content.trim()}
              loading={createQuestion.isPending}
              icon="✨"
              className="w-full"
            >
              질문 등록
            </Button>
          </form>
        </Card>
      )}

      {/* 일괄 질문 등록 */}
      {showBulkAdd && !showExcelUpload && (
        <Card variant="success" padding="lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            📋 일괄 질문 등록
          </h3>
          <div className="space-y-4">
            <Select
              label="주제 선택"
              icon="📚"
              value={selectedTopicId}
              onChange={e => setSelectedTopicId(e.target.value)}
            >
              <option value="">주제를 선택하세요</option>
              {topics.map(topic => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </Select>

            <Textarea
              label="질문 내용 (한 줄에 하나씩)"
              icon="📝"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="질문 내용을 한 줄에 하나씩 입력하세요&#10;예시:&#10;1. 고마워 | Thank you&#10;2. 천만에요 | You're welcome&#10;3. 많은도움이됐어 | That was very helpful&#10;4. ~해줘서 고마워"
              rows={8}
              helpText="숫자로 시작하는 번호는 자동으로 제거됩니다. | 구분자로 영어 번역을 추가할 수 있습니다."
            />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                <strong>💡 일괄 등록 팁:</strong> 각 줄에서{' '}
                <code className="bg-blue-100 px-1 rounded">|</code> 문자로
                한국어와 영어를 구분할 수 있습니다.
                <br />
                영어가 없는 질문은 한국어만 입력하면 됩니다.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="success"
                onClick={bulkAddQuestions}
                disabled={!selectedTopicId || !content.trim()}
                loading={createQuestionsBulk.isPending}
                icon="📋"
                className="flex-1"
              >
                일괄 등록
              </Button>
              <Button variant="secondary" onClick={() => setShowBulkAdd(false)}>
                취소
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* 엑셀 파일 업로드 */}
      {showExcelUpload && (
        <Card variant="primary" padding="lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            📂 엑셀 파일 일괄 등록
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-2">
                주제에 해당하는 질문을 엑셀 파일로 업로드하여 일괄 등록할 수
                있습니다.
              </p>
              <p className="text-xs text-gray-400">
                • 엑셀 파일의 첫 번째 시트에 질문 데이터를 입력하세요.
                <br />• 첫 번째 열(A열)에는 "단어" 또는 질문 내용을, 두 번째
                열(B열)에는 "뜻" 또는 영어 번역을 입력하세요.
                <br />• 첫 번째 행은 헤더로 간주되어 자동으로 제외됩니다.
                <br />• 파일 업로드 후 미리보기에서 내용을 확인하고 등록할 수
                있습니다.
              </p>
            </div>

            <Select
              label="주제 선택"
              icon="📚"
              value={selectedTopicId}
              onChange={e => setSelectedTopicId(e.target.value)}
            >
              <option value="">주제를 선택하세요</option>
              {topics.map(topic => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </Select>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                icon="⬆️"
                onClick={() => document.getElementById('excel-upload')?.click()}
                className="flex-1"
                disabled={!selectedTopicId}
              >
                엑셀 파일 선택
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowExcelUpload(false);
                  setExcelPreview([]);
                  const fileInput = document.getElementById(
                    'excel-upload'
                  ) as HTMLInputElement;
                  if (fileInput) fileInput.value = '';
                }}
              >
                취소
              </Button>
            </div>

            <input
              id="excel-upload"
              type="file"
              accept=".xlsx, .xls"
              onChange={handleExcelUpload}
              className="hidden"
            />

            {excelPreview.length > 0 && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h4 className="text-md font-semibold text-gray-800">
                    📊 엑셀 미리보기 ({excelPreview.length}개 항목)
                  </h4>
                </div>
                <div className="p-4 max-h-96 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          번호
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          질문 내용 (단어)
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          영어 번역 (뜻)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {excelPreview.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-500">
                            {idx + 1}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-700">
                            {item.content}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-600 italic">
                            {item.english || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    <strong>{excelPreview.length}개</strong>의 질문이
                    등록됩니다.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setExcelPreview([]);
                        const fileInput = document.getElementById(
                          'excel-upload'
                        ) as HTMLInputElement;
                        if (fileInput) fileInput.value = '';
                      }}
                    >
                      취소
                    </Button>
                    <Button
                      variant="success"
                      onClick={uploadExcelQuestions}
                      loading={createQuestionsBulk.isPending}
                      disabled={!selectedTopicId}
                    >
                      엑셀 데이터 등록
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                variant="ghost"
                icon="⬇️"
                onClick={downloadExcelTemplate}
                className="mt-4"
              >
                엑셀 템플릿 다운로드
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* 도움말 */}
      <Card variant="warning" padding="md">
        <h4 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center gap-2">
          💡 도움말
        </h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• 주제를 먼저 생성한 후 질문을 등록해주세요</li>
          <li>• 일괄 등록시 한 줄에 하나의 질문을 입력하세요</li>
          <li>• 영어 번역은 선택사항입니다</li>
          <li>• 등록된 질문은 "질문" 메뉴에서 확인할 수 있습니다</li>
        </ul>
      </Card>
    </div>
  );
};

export default QuestionForm;
