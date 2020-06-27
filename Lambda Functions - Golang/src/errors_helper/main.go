package errors_helper

import (
	"log"
	"net/http"
	"github.com/aws/aws-lambda-go/events"	
)

func ClientError(errCode int) (events.APIGatewayProxyResponse, error) {
	return events.APIGatewayProxyResponse {
		StatusCode: errCode,
		Body: http.StatusText(errCode),
		Headers: map[string]string{
			"Access-Control-Allow-Origin": "*",
		},
	}, nil
}

func InternalServerError(err error) (events.APIGatewayProxyResponse, error) {
	log.Println("#ERROR " + err.Error())
	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusInternalServerError,
		Body: http.StatusText(http.StatusInternalServerError),
		Headers: map[string]string{
			"Access-Control-Allow-Origin": "*",
		},
	}, nil
}