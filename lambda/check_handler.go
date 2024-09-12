package main

import (
	"context"
	"encoding/json"
	"errors"
	"log"

	"github.com/aws/aws-lambda-go/events"
)

var (
	ErrInappropriateContent = errors.New("inappropriate or off-topic content")
)

func HandleCheckRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var req GradingRequest
	err := json.Unmarshal([]byte(request.Body), &req)
	if err != nil {
		return errorResponse(400, "Invalid request body")
	}

	if req.Text == "" || req.Topic == "" {
		return errorResponse(400, "Both text and topic are required")
	}

	feedback, err := CallGPTGradingAPI(req)
	if err != nil {
		if errors.Is(err, ErrInappropriateContent) {
			return errorResponse(422, "Inappropriate or off-topic content")
		}
		log.Printf("Error calling GPT API: %v", err)
		return errorResponse(500, "Error processing request")
	}

	return jsonResponse(200, feedback)
}

func errorResponse(statusCode int, message string) (events.APIGatewayProxyResponse, error) {
	return events.APIGatewayProxyResponse{
		StatusCode: statusCode,
		Body:       message,
		Headers: map[string]string{
			"Content-Type":                 "application/json",
			"Access-Control-Allow-Origin":  "*",
			"Access-Control-Allow-Methods": "POST,OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
		},
	}, nil
}

func jsonResponse(statusCode int, data interface{}) (events.APIGatewayProxyResponse, error) {
	body, err := json.Marshal(data)
	if err != nil {
		return errorResponse(500, "Error marshaling response")
	}

	return events.APIGatewayProxyResponse{
		StatusCode: statusCode,
		Body:       string(body),
		Headers: map[string]string{
			"Content-Type":                 "application/json",
			"Access-Control-Allow-Origin":  "*",
			"Access-Control-Allow-Methods": "POST,OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
		},
	}, nil
}
