package main

import (
	"context"
	"encoding/json"
	"log"

	"github.com/aws/aws-lambda-go/events"
)

func HandleTopicsRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	topics, err := CallGPTTopicAPI()
	if err != nil {
		log.Printf("Error calling GPT API: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Error generating topics"}, nil
	}

	topicsResponse, err := json.Marshal(topics)
	if err != nil {
		log.Printf("Error marshaling topics response: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Error marshaling response"}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(topicsResponse),
		Headers: map[string]string{
			"Content-Type":                 "application/json",
			"Access-Control-Allow-Origin":  "*",
			"Access-Control-Allow-Methods": "POST,OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
		},
	}, nil
}
