#!/bin/bash
VOLUME=$PWD':/web-app/'
NY_API_HOST=$(cat .ny-goose/ny-api-host.txt)
NY_S3_BUCKET=$(cat .ny-goose/ny-s3-bucket.txt)
NY_S3_LINK=$(cat .ny-goose/ny-s3-link.txt)
CONTAINER_NAME=$(cat .ny-goose/ny-container-name.txt)

rm -fr $PWD'/dist/*'

curl -X POST -H 'Content-type: application/json' -s $GOOSE_SLACK_WEBHOOK -d '{
	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Shipping to EC2 Docker: Live"
			}
		},
		{
			"type": "section",
				"accessory": {
						"type": "image",
						"image_url": "https://cultofthepartyparrot.com/parrots/shipitparrot.gif",
						"alt_text": "Shipping to EC2 Docker: Live"
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


docker-compose -f docker-compose.yml -f docker-compose.live.yml up -d
