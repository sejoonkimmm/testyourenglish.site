package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math"
	"net/http"
	"os"
	"regexp"
	"strconv"
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

type GradingRequest struct {
	Text  string `json:"text"`
	Topic string `json:"topic"`
}

type GPTErrorResponse struct {
	Error string `json:"error"`
}

func CallGPTGradingAPI(request GradingRequest) (map[string]string, error) {
	apiKey := os.Getenv("OPENAI_API_KEY")
	url := "https://api.openai.com/v1/chat/completions"

	requestBody := GPTRequest{
		Model: "gpt-4",
		Messages: []Message{
			{Role: "system", Content: `You are an English language proficiency evaluator. Assess the given answer based on the provided topic. 
			If the answer is off-topic, contains inappropriate content, or is impossible to grade, respond with only: {"error": "invalid_content"}.
			Otherwise, provide feedback in the following JSON format:

			{
				"CEFR": "B1/B2/etc",
				"IELTS": "5.5/6.0/etc",
				"feedback": "Your detailed feedback here, including specific suggestions for improvement.",
				"vocabulary": ["word1", "word2", "word3"],
				"grammar": ["grammar point 1", "grammar point 2"],
				"improvements": ["suggestion 1", "suggestion 2"]
			}

			Ensure that the CEFR level is one of: A1, A2, B1, B2 (not exceeding B2-High).
			Ensure that the IELTS score is between 1.0 and 7.0 in 0.5 increments.
			Keep the feedback concise to save tokens.`},
			{Role: "user", Content: fmt.Sprintf("Topic: %s\n\nAnswer: %s\n\nProvide the assessment in the specified JSON format.", request.Topic, request.Text)},
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

		// Check for error response
		var errorResp GPTErrorResponse
		if err := json.Unmarshal([]byte(content), &errorResp); err == nil && errorResp.Error == "invalid_content" {
			return nil, ErrInappropriateContent
		}

		return parseStructuredResponse(content)
	}

	return nil, fmt.Errorf("no response from GPT API")
}

func parseStructuredResponse(content string) (map[string]string, error) {
	var response map[string]interface{}
	err := json.Unmarshal([]byte(content), &response)
	if err != nil {
		log.Printf("Error parsing structured response: %v", err)
		return nil, err
	}

	result := make(map[string]string)

	validCEFR := map[string]bool{"A1": true, "A2": true, "B1": true, "B2": true}
	if cefr, ok := response["CEFR"].(string); ok && validCEFR[cefr] {
		result["CEFR"] = cefr
	} else {
		result["CEFR"] = "N/A"
	}

	if ielts, ok := response["IELTS"].(string); ok {
		score, err := strconv.ParseFloat(ielts, 64)
		if err == nil && score >= 1.0 && score <= 7.0 && math.Mod(score*2, 1) == 0 {
			result["IELTS"] = ielts
		} else {
			result["IELTS"] = "N/A"
		}
	} else {
		result["IELTS"] = "N/A"
	}

	if feedback, ok := response["feedback"].(string); ok {
		result["feedback"] = feedback
	} else {
		result["feedback"] = "No feedback provided"
	}

	if vocabulary, ok := response["vocabulary"].([]interface{}); ok {
		vocabStrings := make([]string, len(vocabulary))
		for i, v := range vocabulary {
			vocabStrings[i] = fmt.Sprintf("%v", v)
		}
		result["vocabulary"] = strings.Join(vocabStrings, ", ")
	} else {
		result["vocabulary"] = "No vocabulary suggestions"
	}

	if grammar, ok := response["grammar"].([]interface{}); ok {
		grammarStrings := make([]string, len(grammar))
		for i, g := range grammar {
			grammarStrings[i] = fmt.Sprintf("%v", g)
		}
		result["grammar"] = strings.Join(grammarStrings, ", ")
	} else {
		result["grammar"] = "No grammar points"
	}

	if improvements, ok := response["improvements"].([]interface{}); ok {
		improvementStrings := make([]string, len(improvements))
		for i, imp := range improvements {
			improvementStrings[i] = fmt.Sprintf("%v", imp)
		}
		result["improvements"] = strings.Join(improvementStrings, ", ")
	} else {
		result["improvements"] = "No improvement suggestions"
	}

	return result, nil
}

func CallGPTTopicAPI() (map[string]Topic, error) {
	apiKey := os.Getenv("OPENAI_API_KEY")
	url := "https://api.openai.com/v1/chat/completions"
	requestBody := GPTRequest{
		Model: "gpt-4o-mini",
		Messages: []Message{
			{
				Role: "system",
				Content: `You are an English teacher. Create 4 topics to test English proficiency. Respond in the following format exactly:
	
	Topic 1: [Title]
	Description: [Description]
	
	Topic 2: [Title]
	Description: [Description]
	
	Topic 3: [Title]
	Description: [Description]
	
	Topic 4: [Title]
	Description: [Description]
	
	Do not include any other text in your response.`,
			},
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
