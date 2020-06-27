package main

import (
	"db"
	"errors_helper"
	"fmt"
	"time"
	"net/http"
	"encoding/json"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-lambda-go/events"
	"github.com/google/uuid"
)

func show(req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	eventjson := req.Body

	bodymap := map[string]json.RawMessage{}
	bodyerr := json.Unmarshal([]byte(eventjson),&bodymap)
	if bodyerr != nil {
		return errors_helper.ClientError(http.StatusBadRequest) //BadRequest
	}

	newEvent := new(db.Event)
	eventerr := json.Unmarshal(bodymap["item"], newEvent)

	if eventerr != nil {
		return errors_helper.ClientError(http.StatusBadRequest) //BadRequest
	}

	//If UserId was not received
	if newEvent.UserId == "" {
		return errors_helper.ClientError(http.StatusBadRequest) //BadRequest
	}

	//Setting the timestamp and EventId
	newEvent.EventTimestamp = fmt.Sprint(time.Now().UTC().Unix())
	
	newuuid, _ := uuid.NewUUID()
	newEvent.EventId = newuuid.String()

	

	err := db.CreateEvent(newEvent)
	if err != nil { 
		return errors_helper.InternalServerError(err)
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
