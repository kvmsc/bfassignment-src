package main

import (
	"db"
	"errors_helper"
	"encoding/json"
	"net/http"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-lambda-go/events"
)

func show(req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	//get event body
	eventjson := req.Body
	bodymap := map[string]json.RawMessage{}
	bodyerr := json.Unmarshal([]byte(eventjson),&bodymap)
	if bodyerr != nil {
		return errors_helper.ClientError(http.StatusBadRequest)
	}

	updateEventObj := new(db.Event)
	eventerr := json.Unmarshal(bodymap["item"],updateEventObj)
	if eventerr != nil {
		return errors_helper.ClientError(http.StatusBadRequest)
	}

	updateerr := db.UpdateEvent(updateEventObj)
	if updateerr != nil {
		return errors_helper.InternalServerError(updateerr)
	}

	return events.APIGatewayProxyResponse {
		StatusCode: http.StatusOK,
		Headers: map[string]string{
			"Access-Control-Allow-Origin": "*",
		},
	}, nil
}

func main() {
	lambda.Start(show)
}