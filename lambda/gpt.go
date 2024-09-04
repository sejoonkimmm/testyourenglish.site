package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"
)

type GPTRequest struct {
	Model       string    `json:"model"`
	Messages    []Message `json:"messages"`
	Temperature float64   `json:"temperature"`
}

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type GPTResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}

func CallGPTGradingAPI(answer string) (map[string]string, error) {
	apiKey := os.Getenv("OPENAI_API_KEY")
	url := "https://api.openai.com/v1/chat/completions"

	requestBody := GPTRequest{
		Model: "gpt-4o-mini",
		Messages: []Message{
			{Role: "system", Content: "You are an English language proficiency evaluator. Assess the given answer, but the proficiency level should not exceed CEFR B2-High or IELTS 7.0. Provide feedback in a simple way. The feedback should include specific sentence corrections and vocabulary suggestions, and explain why these changes improve the answer. Avoid using special characters like ** or ##."},
			{Role: "user", Content: fmt.Sprintf("Answer: \"%s\"\n\n1. Provide a CEFR level and IELTS score.\n2. Give specific suggestions for improving the grammar, sentence structure, and vocabulary. 3. Explain why these changes make the answer better.", answer)},
		},
		Temperature: 0.7,
	}

	jsonBody, err := json.Marshal(requestBody)
	if err != nil {
		log.Printf("Error marshaling request body: %v", err)
		return nil, err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonBody))
	if err != nil {
		log.Printf("Error creating HTTP request: %v", err)
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Error sending request to GPT API: %v", err)
		return nil, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Error reading GPT API response body: %v", err)
		return nil, err
	}

	var gptResponse GPTResponse
	err = json.Unmarshal(body, &gptResponse)
	if err != nil {
		log.Printf("Error unmarshaling GPT API response: %v", err)
		return nil, err
	}

	if len(gptResponse.Choices) > 0 {
		response := map[string]string{
			"CEFR":     extractCEFR(gptResponse.Choices[0].Message.Content),
			"IELTS":    extractIELTS(gptResponse.Choices[0].Message.Content),
			"feedback": gptResponse.Choices[0].Message.Content,
		}
		return response, nil
	}

	return nil, fmt.Errorf("no response from GPT API")
}

func extractCEFR(feedback string) string {
	if strings.Contains(feedback, "CEFR: B2") {
		return "B2"
	}
	return "N/A"
}

func extractIELTS(feedback string) string {
	if strings.Contains(feedback, "IELTS: 6.5") {
		return "6.5"
	}
	return "N/A"
}

func CallGPTTopicAPI() (map[string]string, error) {
	apiKey := os.Getenv("OPENAI_API_KEY")
	url := "https://api.openai.com/v1/chat/completions"

	requestBody := GPTRequest{
		Model: "gpt-4o-mini",
		Messages: []Message{
			{Role: "system", Content: "You are an English teacher. Create 4 topics to test English proficiency. Each topic should include the sentence 'You must write more than 100 words.'"},
		},
		Temperature: 0.7,
	}

	jsonBody, err := json.Marshal(requestBody)
	if err != nil {
		log.Printf("Error marshaling request body: %v", err)
		return nil, err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonBody))
	if err != nil {
		log.Printf("Error creating HTTP request: %v", err)
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Error sending request to GPT API: %v", err)
		return nil, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Error reading GPT API response body: %v", err)
		return nil, err
	}

	var gptResponse GPTResponse
	err = json.Unmarshal(body, &gptResponse)
	if err != nil {
		log.Printf("Error unmarshaling GPT API response: %v", err)
		return nil, err
	}

	if len(gptResponse.Choices) > 0 {
		rawTopics := strings.Split(gptResponse.Choices[0].Message.Content, "\n")
		topics := make(map[string]string)

		var currentTopic string
		var topicCount int

		for _, line := range rawTopics {
			line = strings.TrimSpace(line)
			if strings.HasPrefix(line, "Topic") {
				topicCount++
				currentTopic = fmt.Sprintf("topic%d", topicCount)
				topics[currentTopic] = line
			} else if currentTopic != "" && line != "" {
				topics[currentTopic] += " " + line
			}
		}
		return topics, nil
	}

	return nil, fmt.Errorf("no response from GPT API")
}
