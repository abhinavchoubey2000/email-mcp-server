# Instructions for using Email MCP Server

## About this server
##### This MCP server allows you to send emails via Gmail by NodeMailer using SMPT server. This MCP server uses all three capabilities which a typical **Model Context Protocol** server provides which are:
- **Tools** - Built one tool which helps for sending the emails by nodemailer.
- **Resources** - Built one resources which is a excel file containing the names and emails of all the recipients to send emails. 
- **Prompts** - Built two prompts, one static prompt for listing the available users/recipients and second dynamic prompt for generating email for a trip plan.

## Prerequsites
- **Node Js** - To run the MCP server
- **VS Code/Cursor** AI - To test the MCP server

## Installation

- #### Clone the repository
     ``` bash
    git clone https://github.com/abhinavchoubey2000/email-mcp-server.git
    ```
- #### Install all the packages by writng following command in your terminal
    ``` bash
    npm install
    ```
- #### Install the **MCP Server** in your VS Code/Cursor AI

- #### After installing go to your MCP configuration.json file and add the **environment variables** and **cwd**(current working directory) of your index.js:
    ``` json

	"servers": {
		"email": {
			"type": "stdio",
			"command": "node",
			"args": ["absolute-path/index.js"],
			"cwd": "absolute-path", // Important for resource
			"env": { // Environment variables
				"GMAIL_APP_PASSWORD": "<YOUR_GMAIL_APP_PASSWORD>",
				"GMAIL_USER_ID":"<YOUR_EMAIL_ID>"
			}
		}
	},
    ```
- #### At last open your **email-data.xlsx** file and add names and emails of the recipient and save the file, for example:
    | name | email
    |----------|----------|
    | abhinav    | abc@gmail.com   | 
    | sam    | xyz@gmail.com   |
    | harry    | pqr@gmail.com   | 

## Usage
### Open your copilot in VS or respective agent in cursor AI and from chatbox(specially for VS Code) select your **resource** from MCP Server resources and type **/mcp**, and you will find your **prompts** there, select any one of them, it will automatically be added in your input box.

### Some prompt examples:
- _List all the available recipients names with their email ids in alphabetical order._
- _Send an email to abhinav and sam telling them that I have planned a trip for goa for 3 days. Convince them to go with me._    
- _Send an email to Sam telling that I am not comming to office._

