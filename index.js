#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "fs";
import path from "path";

const ROOT_DIR = path.join(process.cwd(), "workspace");
if (!fs.existsSync(ROOT_DIR)) fs.mkdirSync(ROOT_DIR);

const server = new McpServer({
  name: "File MCP Server",
  version: "1.0.0",
  description: "A simple MCP server to read, write, edit, and list files inside a folder."
});

// 🧾 TOOL 1: List files
server.registerTool(
  "list_files",
  {
    description: "List all files inside the workspace folder",
    inputSchema: z.object({}),
  },
  async () => {
    const files = fs.readdirSync(ROOT_DIR);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ files }, null, 2)
        }
      ]
    };
  }
);

// 📖 TOOL 2: Read a file
server.registerTool(
  "read_file",
  {
    description: "Read content of a file",
    inputSchema: z.object({
      filename: z.string().describe("Name of the file to read")
    }),
  },
  async ({ filename }) => {
    const filePath = path.join(ROOT_DIR, filename);
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filename}`);
    }
    const content = fs.readFileSync(filePath, "utf-8");
    return {
      content: [
        {
          type: "text",
          text: content
        }
      ]
    };
  }
);

// ✍️ TOOL 3: Write or overwrite file
server.registerTool(
  "write_file",
  {
    description: "Create or overwrite a file with given content",
    inputSchema: z.object({
      filename: z.string().describe("Name of the file to write"),
      content: z.string().describe("Content to write to the file")
    }),
  },
  async ({ filename, content }) => {
    const filePath = path.join(ROOT_DIR, filename);
    fs.writeFileSync(filePath, content, "utf-8");
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ success: true, message: `File '${filename}' written successfully` })
        }
      ]
    };
  }
);

// 🧠 TOOL 4: Edit specific lines
server.registerTool(
  "edit_file",
  {
    description: "Edit specific lines in an existing file",
    inputSchema: z.object({
      filename: z.string().describe("Name of the file to edit"),
      edits: z.array(
        z.object({
          line: z.number().min(1).describe("Line number to edit (1-indexed)"),
          newText: z.string().describe("New text for this line")
        })
      ).describe("Array of line edits to apply")
    }),
  },
  async ({ filename, edits }) => {
    const filePath = path.join(ROOT_DIR, filename);
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filename}`);
    }

    const lines = fs.readFileSync(filePath, "utf-8").split("\n");

    edits.forEach(({ line, newText }) => {
      const idx = line - 1;
      if (idx < 0 || idx >= lines.length) {
        throw new Error(`Invalid line number: ${line}. File has ${lines.length} lines.`);
      }
      lines[idx] = newText;
    });

    fs.writeFileSync(filePath, lines.join("\n"), "utf-8");
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ 
            success: true, 
            message: `Edited ${edits.length} line(s) in '${filename}'` 
          })
        }
      ]
    };
  }
);

// 🗑️ TOOL 5: Delete a file
server.registerTool(
  "delete_file",
  {
    description: "Delete a file by name",
    inputSchema: z.object({
      filename: z.string().describe("Name of the file to delete")
    }),
  },
  async ({ filename }) => {
    const filePath = path.join(ROOT_DIR, filename);
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filename}`);
    }
    fs.unlinkSync(filePath);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ success: true, message: `File '${filename}' deleted successfully` })
        }
      ]
    };
  }
);

// 🚀 Start the server over stdio transport
await server.connect(new StdioServerTransport());
// Don't log to console after connection - it interferes with stdio communication