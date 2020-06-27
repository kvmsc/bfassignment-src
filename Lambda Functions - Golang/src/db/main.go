package db

import (
	"fmt"
	"github.com/aws/aws-sdk-go/aws"
    "github.com/aws/aws-sdk-go/aws/session"
    "github.com/aws/aws-sdk-go/service/dynamodb"
    "github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

type Event struct {
	EventId, UserId, EventTimestamp, EventName string
	EventDescription, EventStatus string
	EventSchedule EventScheduleStruct
}

type EventScheduleStruct struct {
	Start_time string
	Stop_time string
}

var db = dynamodb.New(session.New(), aws.NewConfig().WithRegion("us-east-1"))

func GetEvent(UserId, EventId string) (*[]Event, error) {
	
	input := &dynamodb.QueryInput{
		TableName: aws.String("Events"),
		KeyConditionExpression: aws.String("UserId = :uid"),
		FilterExpression: aws.String("EventId = :eid"),
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":uid": {
				S: aws.String(UserId),
			},
			":eid": {
				S: aws.String(EventId),
			},
		},
	}

	result, err := db.Query(input)
	if err != nil {
		return nil, err
	}

	if result.Items == nil {
		return nil, nil
	}
	//fmt.Println(result)
	events := new([]Event)
	err = dynamodbattribute.UnmarshalListOfMaps(result.Items, events)
	if err != nil {
		return nil, err
	}
	//fmt.Println(events)
	return events, nil
}

func GetAllEvents(UserId string) (*[]Event, error) {
	input := &dynamodb.QueryInput{
		TableName: aws.String("Events"),
		KeyConditionExpression: aws.String("UserId = :uid"),
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":uid": {
				S: aws.String(UserId),
			},
		},
		ScanIndexForward: aws.Bool(false),
	}

	result, err := db.Query(input)
	if err != nil {
		return nil, err
	}
	if result.Items == nil {
		return nil, nil
	}

	evnt := new([]Event)
	err = dynamodbattribute.UnmarshalListOfMaps(result.Items, evnt)
	if err != nil {
		return nil, err
	}
	
	return evnt, nil
}

func CreateEvent(newEvent *Event) (error) {
	item, err := dynamodbattribute.MarshalMap(newEvent)
	
	if err != nil {
		return err
	}
	
	input := &dynamodb.PutItemInput{
		Item: item,
		TableName: aws.String("Events"),
	}

	_, err = db.PutItem(input)
	if err != nil {
		return err
	}

	return nil

}

func UpdateEvent(event *Event) (error) {

	input := &dynamodb.UpdateItemInput{
		Key: map[string]*dynamodb.AttributeValue{
			"UserId" : { 
				S : aws.String(event.UserId),
			},
			"EventTimestamp" : { 
				S : aws.String(event.EventTimestamp),
			},
		},
		TableName: aws.String("Events"),
		UpdateExpression: aws.String("set EventName = :n, EventDescription = :d, EventStatus = :s, EventSchedule.Start_time = :s_time, EventSchedule.Stop_time = :e_time"),
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":n" : {
				S: aws.String(event.EventName),
			},
			":d" : {
				S: aws.String(event.EventDescription),
			},
			":s" : {
				S: aws.String(event.EventStatus),
			},
			":s_time" : {
				S: aws.String(event.EventSchedule.Start_time),
			},
			":e_time" : {
				S: aws.String(event.EventSchedule.Stop_time),
			},
		},
		ReturnValues: aws.String("UPDATED_NEW"),
	}
	
	_, err := db.UpdateItem(input)
	if err != nil {
		fmt.Println("Error in update!")
		return err
	}
	return nil
}