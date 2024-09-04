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
		log.Printf("Error unmarshaling request: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: 400, Body: "Invalid request body"}, nil
	}

	gptResponse, err := callGPTAPI(req.Text)
	if err != nil {
		log.Printf("Error calling GPT API: %v", err)
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

	log.Printf("GPT API Request Body: %+v", requestBody)

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

	log.Printf("Sending GPT API request to %s", url)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Error sending request to GPT API: %v", err)
		return "", err
	}
	defer resp.Body.Close()

	log.Printf("GPT API Response Status: %s", resp.Status)

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Error reading GPT API response body: %v", err)
		return "", err
	}

	log.Printf("GPT API Response Body: %s", body)

	var gptResponse GPTResponse
	err = json.Unmarshal(body, &gptResponse)
	if err != nil {
		log.Printf("Error unmarshaling GPT API response: %v", err)
		return "", err
	}

	if len(gptResponse.Choices) > 0 {
		log.Printf("GPT API Response Choice: %+v", gptResponse.Choices[0].Message.Content)
		return gptResponse.Choices[0].Message.Content, nil
	}

	log.Printf("No response from GPT API")
	return "", fmt.Errorf("no response from GPT API")
}

func main() {
	lambda.Start(HandleRequest)
}
