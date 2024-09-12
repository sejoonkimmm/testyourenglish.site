package main

import (
	"context"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

type Request struct {
	Text string `json:"text"`
}

type GradingResponse struct {
	CEFR         string `json:"cefr"`
	IELTS        string `json:"ielts"`
	Feedback     string `json:"feedback"`
	Vocabulary   string `json:"vocabulary"`
	Grammar      string `json:"grammar"`
	Improvements string `json:"improvements"`
}

func HandleRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// 경로에 따라 다른 기능을 처리
	switch request.Path {
	case "/check":
		return HandleCheckRequest(ctx, request)
	case "/topics":
		return HandleTopicsRequest(ctx, request)
	default:
		return events.APIGatewayProxyResponse{StatusCode: 404, Body: "Not Found"}, nil
	}
}

func main() {
	lambda.Start(HandleRequest)
}
