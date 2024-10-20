import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import TopicInterface from '../interfaces/TopicInterface';
import fetchTopicsFromServer from '../api/fetchTopicsFromServer';

interface TopicStore {
  topics: TopicInterface[];
  selectedTopicIndex: number;
  fetchTopics: (topics: TopicInterface[]) => void;
  setSolved: (index: number, isSolved: boolean) => void;
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
      refreshTopics: (): void => {
        set((state) => {
          const { topics, selectedTopicIndex } = state;
          if (topics[selectedTopicIndex]?.isSolved) {
            const remainingTopics: TopicInterface[] = topics.filter(
              (topic) => !topic.isSolved
            );
            if (remainingTopics.length === 0) {
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
              return {
                topics,
                selectedTopicIndex: Math.floor(Math.random() * remainingTopics.length),
              };
            }
          } else {
            console.error('Cannot refresh. The current topic is not solved yet.');
            return {};
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