package main

import (
	"db"
	"errors_helper"
	"net/http"
	"encoding/json"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-lambda-go/events"
)

func show(req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	//Get UserID from cognito
	UserId := req.QueryStringParameters["uid"]
	if UserId == "" {
		return errors_helper.ClientError(http.StatusBadRequest)
	}

	
	res, err := db.GetAllEvents(UserId)
	//Unable to Query - 500 Error
	if err != nil {
		return errors_helper.InternalServerError(err)
	}


	event_json, _ := json.Marshal(res)

	return events.APIGatewayProxyResponse {
		StatusCode: http.StatusOK,
		Headers: map[string]string{
			"Access-Control-Allow-Origin": "*",
		},
		Body: string(event_json),
	}, nil
}

func main() {
	lambda.Start(show)
}