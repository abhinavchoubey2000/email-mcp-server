import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import nodemailer from "nodemailer";
import XLSX from "xlsx";

const server = new McpServer(
	{
		name: "email",
		version: "1.0.0",
	},
	{		
		capabilities: {
			tools: {},
			resources: {},
			prompts: {},
		},
	}
);

// Tools

// Tool for sending emails via Gmail through nodemailer
server.tool(
	"send-email",
	"Sends the emails",
	{
		mailConfigurations: z.object({
			to: z.array(z.string()).describe("Emails of recipients."),
			subject: z.string().describe("Subject of the email"),
			body: z.string().describe("Main content of the email"),
		}),
	},
	async ({ mailConfigurations }) => {
		const { to, subject, body } = mailConfigurations;
		try {
			const transporter = await nodemailer.createTransport({
				host: "smtp.gmail.com",
				port: 587,
				auth: {
					user: process.env.GMAIL_USER_ID,
					pass: process.env.GMAIL_APP_PASSWORD,
				},
			});

			await transporter.sendMail({
				to: to,
				from: process.env.GMAIL_USER_ID,
				subject: subject,
				text: body,
			});

			return {
				content: [{ type: "text", text: "Mail sent successfully!" }],
			};
		} catch (error) {
			return {
				content: [{ type: "text", text: error.message }],
			};
		}
	}
);

// Resources

// Resource as Excel file containing names along with emails respectively
server.resource(
	"friends-data",
	"email://excel-data",
	{
		name: "Email Excel file",
		description: "Contains the names of recipients with their respective emails.",
		mimeType: "application/json",
	},
	async (uri) => {
		const workbook = XLSX.readFile("./email-data.xlsx");
		const worksheet = workbook.Sheets[workbook.SheetNames[0]];
		const data = XLSX.utils.sheet_to_json(worksheet);

		return {
			contents: [
				{
					uri: uri.href,
					text: JSON.stringify(data),
					mimeType: "application/json",
				},
			],
		};
	}
);

// Prompts

// Prompt for listing all the available recipients name with their email.
server.prompt(
	"list-emails",
	"Lists the email of recipients by their name.",
	async () => {
		return {
			messages: [
				{
					role: "user",
					content: {
						type: "text",
						text: "List all the available recipients names with their email ids in alphabetical order.",
					},
				},
			],
		};
	}
);

// Prompt for generating email for a trip plan
server.prompt(
	"trip-plan",
	"Sends email for planning a trip.",
	{
		nameOfRecipients: z.string().describe("Name of recipients to send email"),
		destination: z.string().describe("Destination of the trip"),
		noOfDays: z.string().describe("Number of days in a trip."),
		specialInstructions: z.string().describe("Any instruction in mail tone."),
	},
	async ({ nameOfRecipients, destination, noOfDays, specialInstructions }) => {
		const prompt = `Send an email to ${nameOfRecipients} telling them that I have planned a trip for ${destination} for ${noOfDays}. Convince them to go with me.
		
		${specialInstructions}`;

		return {
			messages: [
				{
					role: "user",
					content: {
						type: "text",
						text: prompt,
					},
				},
			],
		};
	}
);

// Connection initialization function
const start = async () => {
	const transport = new StdioServerTransport();
	await server.connect(transport);
};
start();
