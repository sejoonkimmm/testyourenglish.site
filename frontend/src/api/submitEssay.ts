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

  return await response.json();
};

export default submitEssay;
