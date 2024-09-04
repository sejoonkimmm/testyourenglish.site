package main

import (
	"context"
	"encoding/json"
	"log"

	"github.com/aws/aws-lambda-go/events"
)

func HandleCheckRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var req Request
	err := json.Unmarshal([]byte(request.Body), &req)
	if err != nil {
		log.Printf("Error unmarshaling request: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: 400, Body: "Invalid request body"}, nil
	}

	feedback, err := CallGPTGradingAPI(req.Text)
	if err != nil {
		log.Printf("Error calling GPT API: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Error calling GPT API"}, nil
	}

	feedbackResponse, err := json.Marshal(feedback)
	if err != nil {
		log.Printf("Error marshaling feedback response: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Error marshaling response"}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(feedbackResponse), // 직렬화된 JSON 문자열을 응답 바디로 반환
		Headers: map[string]string{
			"Content-Type":                 "application/json",
			"Access-Control-Allow-Origin":  "*",
			"Access-Control-Allow-Methods": "POST,OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
		},
	}, nil
}
