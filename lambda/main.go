package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

type Request struct {
	Text string `json:"text"`
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

func HandleRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	if request.Body == "" {
		log.Printf("Received empty body")
		return events.APIGatewayProxyResponse{StatusCode: 400, Body: "Empty request body"}, nil
	}

	log.Printf("Received request body: %s", request.Body)

	var req Request
	err := json.Unmarshal([]byte(request.Body), &req)
	if err != nil {
		log.Printf("Error unmarshaling request: %v", err) // 에러 로그 추가
		return events.APIGatewayProxyResponse{StatusCode: 400, Body: "Invalid request body"}, nil
	}

	gptResponse, err := callGPTAPI(req.Text)
	if err != nil {
		log.Printf("Error calling GPT API: %v", err) // 에러 로그 추가
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Error calling GPT API"}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       gptResponse,
		Headers: map[string]string{
			"Content-Type":                 "application/json",
			"Access-Control-Allow-Origin":  "*",
			"Access-Control-Allow-Methods": "POST,OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
		},
	}, nil
}

func callGPTAPI(prompt string) (string, error) {
	apiKey := os.Getenv("OPENAI_API_KEY")
	url := "https://api.openai.com/v1/chat/completions"

	requestBody := GPTRequest{
		Model: "gpt-4o-mini",
		Messages: []Message{
			{Role: "system", Content: "You are a language proficiency evaluator. Assess the given text based on CEFR and IELTS standards, identify any grammatical, lexical, or structural issues, and suggest improvements."},
			{Role: "user", Content: fmt.Sprintf("Text: \"%s\"\n\n1. Assess the text's proficiency level based on CEFR and IELTS.\n2. Identify any issues with grammar, vocabulary, or sentence structure.\n3. Provide suggestions to improve the text.", prompt)},
		},
		Temperature: 0.7,
	}

	jsonBody, err := json.Marshal(requestBody)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonBody))
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	var gptResponse GPTResponse
	err = json.Unmarshal(body, &gptResponse)
	if err != nil {
		return "", err
	}

	if len(gptResponse.Choices) > 0 {
		return gptResponse.Choices[0].Message.Content, nil
	}

	return "", fmt.Errorf("no response from GPT API")
}

func main() {
	lambda.Start(HandleRequest)
}
