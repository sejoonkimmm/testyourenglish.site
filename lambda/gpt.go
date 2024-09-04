package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"regexp"
	"strings"
)

type Topic struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

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

func CallGPTTopicAPI() (map[string]Topic, error) {
	apiKey := os.Getenv("OPENAI_API_KEY")
	url := "https://api.openai.com/v1/chat/completions"

	requestBody := GPTRequest{
		Model: "gpt-4o-mini",
		Messages: []Message{
			{Role: "system", Content: "You are an English teacher. Create 4 topics to test English proficiency. Each topic should be structured as a JSON object. Each topic should include a title, a description, and a requirement to write more than 100 words. Return the topics in the following format: {\"topic1\": {\"title\": \"\", \"description\": \"\"}, \"topic2\": {\"title\": \"\", \"description\": \"\"}, \"topic3\": {\"title\": \"\", \"description\": \"\"}, \"topic4\": {\"title\": \"\", \"description\": \"\"}}."},
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
		content := gptResponse.Choices[0].Message.Content
		return parseTopics(content)
	}

	log.Printf("No topics found in GPT API response")
	return nil, fmt.Errorf("no response from GPT API")
}

func parseTopics(content string) (map[string]Topic, error) {
	topics := make(map[string]Topic)

	// Try parsing as JSON first
	err := json.Unmarshal([]byte(content), &topics)
	if err == nil {
		return topics, nil
	}

	// If JSON parsing fails, try extracting topics manually
	topicRegex := regexp.MustCompile(`(?i)Topic\s*(\d+):\s*(.+?)\s*Description:\s*(.+?)(?:\n|$)`)
	matches := topicRegex.FindAllStringSubmatch(content, -1)

	for _, match := range matches {
		if len(match) == 4 {
			topicNum := match[1]
			title := strings.TrimSpace(match[2])
			description := strings.TrimSpace(match[3])
			topics[fmt.Sprintf("topic%s", topicNum)] = Topic{
				Title:       title,
				Description: description,
			}
		}
	}

	if len(topics) == 0 {
		return nil, fmt.Errorf("failed to parse topics from GPT response")
	}

	return topics, nil
}
