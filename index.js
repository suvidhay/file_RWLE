#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import fs from "fs";
import path from "path";

const ROOT_DIR = path.join(process.cwd(), "workspace");
if (!fs.existsSync(ROOT_DIR)) fs.mkdirSync(ROOT_DIR);

// Create the server instance
const server = new Server(
  {
    name: "file-rwle",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tools array
const TOOLS = [
  {
    name: "list_files",
    description: "List all files inside the workspace folder",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "read_file",
    description: "Read content of a file",
    inputSchema: {
      type: "object",
      properties: {
        filename: {
          type: "string",
          description: "Name of the file to read",
        },
      },
      required: ["filename"],
    },
  },
  {
    name: "write_file",
    description: "Create or overwrite a file with given content",
    inputSchema: {
      type: "object",
      properties: {
        filename: {
          type: "string",
          description: "Name of the file to write",
        },
        content: {
          type: "string",
          description: "Content to write to the file",
        },
      },
      required: ["filename", "content"],
    },
  },
  {
    name: "edit_file",
    description: "Edit specific lines in an existing file",
    inputSchema: {
      type: "object",
      properties: {
        filename: {
          type: "string",
          description: "Name of the file to edit",
        },
        edits: {
          type: "array",
          description: "Array of line edits to apply",
          items: {
            type: "object",
            properties: {
              line: {
                type: "number",
                description: "Line number to edit (1-indexed)",
              },
              newText: {
                type: "string",
                description: "New text for this line",
              },
            },
            required: ["line", "newText"],
          },
        },
      },
      required: ["filename", "edits"],
    },
  },
  {
    name: "delete_file",
    description: "Delete a file by name",
    inputSchema: {
      type: "object",
      properties: {
        filename: {
          type: "string",
          description: "Name of the file to delete",
        },
      },
      required: ["filename"],
    },
  },
];

// Handle list_tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOLS,
  };
});

// Handle call_tool request
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "list_files": {
        const files = fs.readdirSync(ROOT_DIR);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ files }, null, 2),
            },
          ],
        };
      }

      case "read_file": {
        const filename = args.filename;
        const filePath = path.join(ROOT_DIR, filename);
        
        if (!fs.existsSync(filePath)) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({ error: `File not found: ${filename}` }),
              },
            ],
            isError: true,
          };
        }
        
        const content = fs.readFileSync(filePath, "utf-8");
        return {
          content: [
            {
              type: "text",
              text: content,
            },
          ],
        };
      }

      case "write_file": {
        const { filename, content } = args;
        const filePath = path.join(ROOT_DIR, filename);
        fs.writeFileSync(filePath, content, "utf-8");
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: `File '${filename}' written successfully`,
              }),
            },
          ],
        };
      }

      case "edit_file": {
        const { filename, edits } = args;
        const filePath = path.join(ROOT_DIR, filename);
        
        if (!fs.existsSync(filePath)) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({ error: `File not found: ${filename}` }),
              },
            ],
            isError: true,
          };
        }

        const lines = fs.readFileSync(filePath, "utf-8").split("\n");

        for (const edit of edits) {
          const idx = edit.line - 1;
          if (idx < 0 || idx >= lines.length) {
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    error: `Invalid line number: ${edit.line}. File has ${lines.length} lines.`,
                  }),
                },
              ],
              isError: true,
            };
          }
          lines[idx] = edit.newText;
        }

        fs.writeFileSync(filePath, lines.join("\n"), "utf-8");
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: `Edited ${edits.length} line(s) in '${filename}'`,
              }),
            },
          ],
        };
      }

      case "delete_file": {
        const filename = args.filename;
        const filePath = path.join(ROOT_DIR, filename);
        
        if (!fs.existsSync(filePath)) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({ error: `File not found: ${filename}` }),
              },
            ],
            isError: true,
          };
        }
        
        fs.unlinkSync(filePath);
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: `File '${filename}' deleted successfully`,
              }),
            },
          ],
        };
      }

      default:
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: `Unknown tool: ${name}` }),
            },
          ],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ error: error.message }),
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});