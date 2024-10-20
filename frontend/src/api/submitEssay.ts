import useTopicStore from '../store/useTopicStore';

const submitEssay = async ({ requestBody }: { requestBody: { topic: string, text: string } }) => {
  const response = await fetch('https://we6jyg97u7.execute-api.eu-central-1.amazonaws.com/prod/check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  console.log("response:", response);

  if (!response.ok) {
    throw new Error('Failed to submit essay');
  }

  const data = await response.json();
  console.log("data:",data);

  const { selectedTopicIndex, setSolved, setScores } = useTopicStore.getState();

  setSolved(selectedTopicIndex, true);
  setScores(selectedTopicIndex, data?.CEFR, data?.IELTS);

  return data;
};

export default submitEssay;
