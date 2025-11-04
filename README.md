# 🗂️ File_RWLE — MCP File Server

A simple **Model Context Protocol (MCP)** server built using **Node.js** that allows you to **read, write, list, and edit files** inside a workspace folder.

---

## 🚀 Features

- 📄 List files inside a workspace  
- 🖋️ Read and write files  
- ✏️ Edit existing files  
- 🧩 Works as a local MCP server for your setup  

---

## 🧠 How It Works

This MCP server uses the `@modelcontextprotocol/sdk` library to expose tools like:
- `listFiles`
- `readFile`
- `writeFile`
- `editFile`

These tools can then be accessed through any MCP-compatible client (like Cursor or Claude Desktop).

---

## ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/suvidhay/File_RWLE.git
cd File_RWLE

# Install dependencies
npm install

# Run the MCP server
npm start

✅ You should see:

File MCP Server started successfully!


⸻

🧪 Local Testing

You can test file operations in Node REPL:

node
> import fs from "fs";
> import path from "path";
> const ROOT_DIR = path.join(process.cwd(), "workspace");
> fs.writeFileSync(path.join(ROOT_DIR, "test.txt"), "Hello MCP!");
> console.log(fs.readdirSync(ROOT_DIR)); // ['test.txt']
> console.log(fs.readFileSync(path.join(ROOT_DIR, "test.txt"), "utf-8")); // Hello MCP!


⸻

🌍 Publish to npm

If you want to share this server as an npm package:

npm login
npm publish --access public


⸻

🧩 Example mcp.json Configuration

Add this to your MCP configuration:

{
  "mcpServers": {
    "file_rwle": {
      "command": "npx",
      "args": ["-y", "file_rwle"]
    }
  }
}


⸻

🧑‍💻 Author

Suvidha Yadav
💼 GitHub￼
