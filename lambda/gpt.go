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

// GPTRequest 구조체 정의
type GPTRequest struct {
	Model       string    `json:"model"`
	Messages    []Message `json:"messages"`
	Temperature float64   `json:"temperature"`
}

// Message 구조체 정의
type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// GPTResponse 구조체 정의
type GPTResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}

// GPT 채점 API 호출 함수
func CallGPTGradingAPI(answer string) (string, error) {
	apiKey := os.Getenv("OPENAI_API_KEY")
	url := "https://api.openai.com/v1/chat/completions"

	requestBody := GPTRequest{
		Model: "gpt-4o-mini",
		Messages: []Message{
			{Role: "system", Content: "You are a language proficiency evaluator. Assess the given answer based on CEFR and IELTS standards, identify any grammatical, lexical, or structural issues, and suggest improvements."},
			{Role: "user", Content: fmt.Sprintf("Answer: \"%s\"\n\n1. Assess the answer's proficiency level based on CEFR and IELTS.\n2. Identify any issues with grammar, vocabulary, or sentence structure.\n3. Provide suggestions to improve the answer.", answer)},
		},
		Temperature: 0.7,
	}

	jsonBody, err := json.Marshal(requestBody)
	if err != nil {
		log.Printf("Error marshaling request body: %v", err)
		return "", err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonBody))
	if err != nil {
		log.Printf("Error creating HTTP request: %v", err)
		return "", err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Error sending request to GPT API: %v", err)
		return "", err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Error reading GPT API response body: %v", err)
		return "", err
	}

	var gptResponse GPTResponse
	err = json.Unmarshal(body, &gptResponse)
	if err != nil {
		log.Printf("Error unmarshaling GPT API response: %v", err)
		return "", err
	}

	if len(gptResponse.Choices) > 0 {
		return gptResponse.Choices[0].Message.Content, nil
	}

	return "", fmt.Errorf("no response from GPT API")
}

func CallGPTTopicAPI() ([]string, error) {
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
		// Assuming the response is a single string with topics separated by newlines
		topics := strings.Split(gptResponse.Choices[0].Message.Content, "\n")
		return topics, nil
	}

	return nil, fmt.Errorf("no response from GPT API")
}
