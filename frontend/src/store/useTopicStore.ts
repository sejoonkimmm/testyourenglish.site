import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import TopicInterface from '../interfaces/TopicInterface';
import fetchTopicsFromServer from '../api/fetchTopicsFromServer';

interface TopicStore {
  topics: TopicInterface[];
  selectedTopicIndex: number;
  fetchTopics: (topics: TopicInterface[]) => void;
  setSolved: (index: number, isSolved: boolean) => void;
  setScores: (index: number, cefrScore: string, ieltsScore: string) => void;
  refreshTopics: () => void;
  lastUpdated: string;
}

const useTopicStore = create(
  persist<TopicStore>(
    (set) => ({
      topics: [] as TopicInterface[],
      selectedTopicIndex: 0,
      lastUpdated: '',
      fetchTopics: (topics: TopicInterface[]): void => {
        const currentTime = new Date().toLocaleString();
        set(() => ({
          topics: topics,
          selectedTopicIndex: Math.floor(Math.random() * topics.length),
          lastUpdated: currentTime,
        }));
      },
      setSolved: (index: number, isSolved: boolean): void =>
        set((state) => {
          const updatedTopics: TopicInterface[] = [...state.topics];
          updatedTopics[index].isSolved = isSolved;
          return {
            topics: updatedTopics,
          };
        }),
      setScores: (index: number, cefrScore: string, ieltsScore: string): void =>
        set((state) => {
          const updatedTopics: TopicInterface[] = [...state.topics];
          updatedTopics[index].cefrScore = cefrScore;
          updatedTopics[index].ieltsScore = ieltsScore;
          return {
            topics: updatedTopics,
          };
        }),
      refreshTopics: (): void => {
        set((state) => {
          const { topics } = state;

          // 모든 토픽 중 해결되지 않은 토픽 목록을 가져옴
          const remainingTopics: TopicInterface[] = topics.filter(
            (topic) => !topic.isSolved
          );

          if (remainingTopics.length === 0) {
            // 해결되지 않은 토픽이 없으면 새 토픽을 서버에서 불러옴
            fetchTopicsFromServer()
              .then((newTopics) => {
                const currentTime = new Date().toLocaleString();
                set(() => ({
                  topics: newTopics,
                  selectedTopicIndex: Math.floor(Math.random() * newTopics.length),
                  lastUpdated: currentTime,
                }));
              })
              .catch((error) => {
                console.error('Failed to fetch new topics:', error);
              });
            return {};
          } else {
            // 해결되지 않은 토픽 중에서 임의로 선택
            const unsolvedIndex = Math.floor(Math.random() * remainingTopics.length);
            const unsolvedTopic = remainingTopics[unsolvedIndex];
            
            // 해당 토픽의 원래 인덱스를 찾아 selectedTopicIndex 설정
            const selectedIndex = topics.findIndex(topic => topic.title === unsolvedTopic.title);

            return {
              topics,
              selectedTopicIndex: selectedIndex,
            };
          }
        });
      },
    }),
    {
      name: 'topic-storage',
      storage: {
        getItem: async (name) => {
          const item = localStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);

export default useTopicStore;