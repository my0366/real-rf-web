import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createSupabaseClient } from '../supabaseClient';
import type { QuestionWithTopic } from '../types/question';
import type { Topic } from '../types/topic.ts';

// Query Keys
export const QUERY_KEYS = {
  topics: ['topics'] as const,
  questions: ['questions'] as const,
  testQuestions: (topicId?: string) => ['testQuestions', topicId] as const,
};

// Topics 관련 훅들
export const useTopics = () => {
  return useQuery({
    queryKey: QUERY_KEYS.topics,
    queryFn: async (): Promise<Topic[]> => {
      const { data, error } = await createSupabaseClient()
        .from('topics')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useCreateTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      category,
    }: {
      name: string;
      category: string;
    }) => {
      const { error } = await createSupabaseClient()
        .from('topics')
        .insert([{ name: name.trim(), category }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.topics });
    },
  });
};

export const useCreateTopicsBulk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      topicNames,
      category,
    }: {
      topicNames: string[];
      category: string;
    }) => {
      const { error } = await createSupabaseClient()
        .from('topics')
        .insert(topicNames.map(name => ({ name, category })));
      if (error) throw error;
      return topicNames.length;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.topics });
    },
  });
};

export const useUpdateTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      category,
    }: {
      id: string;
      name: string;
      category: string;
    }) => {
      const { error } = await createSupabaseClient()
        .from('topics')
        .update({ name: name.trim(), category })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.topics });
    },
  });
};

export const useDeleteTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (topicId: string) => {
      const { error } = await createSupabaseClient()
        .from('topics')
        .delete()
        .eq('id', topicId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.topics });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.testQuestions() });
    },
  });
};

// Test Questions 관련 훅들
export const useTestQuestions = (topicIds?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.testQuestions(topicIds),
    queryFn: async (): Promise<QuestionWithTopic[]> => {
      let query = createSupabaseClient().from('questions').select(`
        *,
        topic:topics(id, name)
      `);

      if (topicIds) {
        // 쉼표로 구분된 문자열을 배열로 변환
        const topicIdArray = topicIds.split(',').filter(id => id.trim());

        if (topicIdArray.length === 1) {
          // 단일 주제인 경우
          query = query.eq('topic_id', topicIdArray[0]);
        } else if (topicIdArray.length > 1) {
          // 다중 주제인 경우 - in 연산자 사용
          query = query.in('topic_id', topicIdArray);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data as QuestionWithTopic[]) || [];
    },
    enabled: false, // 수동으로 실행
  });
};

// Questions CRUD 관련 훅들
export const useQuestions = (filterTopicIds?: string) => {
  return useQuery({
    queryKey: ['questions', filterTopicIds],
    queryFn: async () => {
      let query = createSupabaseClient()
        .from('questions')
        .select(
          `
        *,
        topic:topics(id, name)
      `
        )
        .order('created_at', { ascending: true });

      if (filterTopicIds) {
        // 쉼표로 구분된 문자열을 배열로 변환
        const topicIdArray = filterTopicIds.split(',').filter(id => id.trim());

        if (topicIdArray.length === 1) {
          // 단일 주제인 경우
          query = query.eq('topic_id', topicIdArray[0]);
        } else if (topicIdArray.length > 1) {
          // 다중 주제인 경우 - in 연산자 사용
          query = query.in('topic_id', topicIdArray);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data as QuestionWithTopic[]) || [];
    },
  });
};

export const useSearchQuestions = (
  searchTerm: string,
  filterTopicIds?: string
) => {
  return useQuery({
    queryKey: ['questions', 'search', searchTerm, filterTopicIds],
    queryFn: async () => {
      let query = createSupabaseClient()
        .from('questions')
        .select(
          `
        *,
        topic:topics(id, name)
      `
        )
        .order('created_at', { ascending: true });

      if (filterTopicIds) {
        // 쉼표로 구분된 문자열을 배열로 변환
        const topicIdArray = filterTopicIds.split(',').filter(id => id.trim());

        if (topicIdArray.length === 1) {
          // 단일 주제인 경우
          query = query.eq('topic_id', topicIdArray[0]);
        } else if (topicIdArray.length > 1) {
          // 다중 주제인 경우 - in 연산자 사용
          query = query.in('topic_id', topicIdArray);
        }
      }

      // 검색어가 있으면 content 또는 english 필드에서 검색
      if (searchTerm.trim()) {
        query = query.or(
          `content.ilike.%${searchTerm}%,english.ilike.%${searchTerm}%`
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data as QuestionWithTopic[]) || [];
    },
    enabled: !!searchTerm.trim(), // 검색어가 있을 때만 실행
  });
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (question: {
      topic_id: string;
      content: string;
      english?: string | null;
    }) => {
      const { error } = await createSupabaseClient()
        .from('questions')
        .insert([question]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.testQuestions() });
    },
  });
};

export const useCreateQuestionsBulk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      questions: Array<{
        topic_id: string;
        content: string;
        english?: string | null;
      }>
    ) => {
      const { error } = await createSupabaseClient()
        .from('questions')
        .insert(questions);
      if (error) throw error;
      return questions.length;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.testQuestions() });
    },
  });
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      content,
      english,
    }: {
      id: string;
      content: string;
      english?: string | null;
    }) => {
      const { error } = await createSupabaseClient()
        .from('questions')
        .update({ content: content.trim(), english: english?.trim() || null })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.testQuestions() });
    },
  });
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questionId: string) => {
      const { error } = await createSupabaseClient()
        .from('questions')
        .delete()
        .eq('id', questionId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.testQuestions() });
    },
  });
};
