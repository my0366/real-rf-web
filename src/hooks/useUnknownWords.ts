import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createSupabaseClient } from '../supabaseClient';
import type { UnknownWordWithQuestion } from '../types/unknownWord';

// Query Keys
export const UNKNOWN_WORDS_QUERY_KEY = ['unknownWords'] as const;

// 모르는 단어 목록 가져오기
export const useUnknownWords = (onlyUnlearned = false) => {
  return useQuery({
    queryKey: [...UNKNOWN_WORDS_QUERY_KEY, onlyUnlearned],
    queryFn: async (): Promise<UnknownWordWithQuestion[]> => {
      const supabase = createSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('unknown_words')
        .select(
          `
          *,
          question:questions(
            *,
            topic:topics(id, name)
          )
        `
        )
        .eq('user_id', user.id)
        .order('marked_at', { ascending: false });

      if (onlyUnlearned) {
        query = query.eq('is_learned', false);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data as unknown as UnknownWordWithQuestion[]) || [];
    },
  });
};

// 특정 질문이 모르는 단어로 표시되어 있는지 확인
export const useIsUnknownWord = (questionId: string) => {
  return useQuery({
    queryKey: [...UNKNOWN_WORDS_QUERY_KEY, 'check', questionId],
    queryFn: async (): Promise<boolean> => {
      const supabase = createSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return false;

      const { data, error } = await supabase
        .from('unknown_words')
        .select('id')
        .eq('user_id', user.id)
        .eq('question_id', questionId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
      return !!data;
    },
    enabled: !!questionId,
  });
};

// 모르는 단어 추가
export const useAddUnknownWord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questionId: string) => {
      const supabase = createSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('unknown_words')
        .insert([{ user_id: user.id, question_id: questionId }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UNKNOWN_WORDS_QUERY_KEY });
    },
  });
};

// 모르는 단어 제거
export const useRemoveUnknownWord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questionId: string) => {
      const supabase = createSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('unknown_words')
        .delete()
        .eq('user_id', user.id)
        .eq('question_id', questionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UNKNOWN_WORDS_QUERY_KEY });
    },
  });
};

// 학습 완료 표시
export const useMarkAsLearned = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questionId: string) => {
      const supabase = createSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('unknown_words')
        .update({
          is_learned: true,
          learned_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .eq('question_id', questionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UNKNOWN_WORDS_QUERY_KEY });
    },
  });
};

// 복습 카운트 증가
export const useIncrementReviewCount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questionId: string) => {
      const supabase = createSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('Not authenticated');

      // 현재 review_count 가져오기
      const { data: current, error: fetchError } = await supabase
        .from('unknown_words')
        .select('review_count')
        .eq('user_id', user.id)
        .eq('question_id', questionId)
        .single();

      if (fetchError) throw fetchError;

      // review_count 증가
      const { error } = await supabase
        .from('unknown_words')
        .update({
          review_count: (current?.review_count || 0) + 1,
          last_reviewed_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .eq('question_id', questionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UNKNOWN_WORDS_QUERY_KEY });
    },
  });
};

// 통계 정보 가져오기
export const useUnknownWordsStats = () => {
  return useQuery({
    queryKey: [...UNKNOWN_WORDS_QUERY_KEY, 'stats'],
    queryFn: async () => {
      const supabase = createSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('unknown_words')
        .select('is_learned')
        .eq('user_id', user.id);

      if (error) throw error;

      const total = data.length;
      const learned = data.filter(w => w.is_learned).length;
      const unlearned = total - learned;

      return { total, learned, unlearned };
    },
  });
};
