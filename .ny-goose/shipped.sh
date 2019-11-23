#!/bin/bash

NY_S3_LINK=$(cat .ny-goose/ny-s3-link.txt)
CONTAINER_NAME=$(cat .ny-goose/ny-container-name.txt)

curl -X POST -H 'Content-type: application/json' -s $GOOSE_SLACK_WEBHOOK -d '{
	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Shipped: '${JOB_NAME}'"
			}
		},
		{
			"type": "section",
				"accessory": {
						"type": "image",
						"image_url": "https://cultofthepartyparrot.com/parrots/hd/dealwithitparrot.gif",
						"alt_text": "Shipped: '${JOB_NAME}'"
					},
			"fields": [
				{
					"type": "mrkdwn",
					"text": "*Branch:*\n '${BRANCH_NAME}'"
				}
			]
		}
	]
}'