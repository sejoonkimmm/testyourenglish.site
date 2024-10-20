import TopicInterface from '../interfaces/TopicInterface';

const fetchTopicsFromServer = async (): Promise<TopicInterface[]> => {
  try {
    const response = await fetch(
      'https://we6jyg97u7.execute-api.eu-central-1.amazonaws.com/prod/topics',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: 'value' }),
      }
    );
    const data = await response.json();
    console.log("data:",data);
    if (typeof data === 'object' && data !== null) {
      const topics: TopicInterface[] = [];
      for (const key in data) {
        const topic = data[key];
        if (typeof topic === 'object' && topic !== null && 'title' in topic && 'description' in topic) {
          topics.push({
            title: String(topic.title),
            description: String(topic.description),
            isSolved: false,
          });
        }
      }
      console.log("topics:",topics);
      return topics;
    } else {
      console.error('Unexpected data format:', data);
      throw new Error('Unexpected data format');
    }
  } catch (error) {
    console.error('Failed to fetch topics:', error);
    throw error;
  }
};

export default fetchTopicsFromServer;
