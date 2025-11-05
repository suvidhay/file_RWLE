# 🗂️ File_RWLE — MCP File Server

A simple **Model Context Protocol (MCP)** server built using **Node.js** that allows you to **read, write, list, edit, and delete files** inside a workspace folder.

---

## 🚀 Features

- 📄 **List files** inside a workspace  
- 📖 **Read files** with full content access  
- ✍️ **Write/Create files** with custom content  
- ✏️ **Edit specific lines** in existing files  
- 🗑️ **Delete files** when needed  
- 🧩 **Works seamlessly** with MCP-compatible clients like Claude Desktop and Cursor  

---

## 🧠 How It Works

This MCP server uses the `@modelcontextprotocol/sdk` library to expose five powerful tools:

1. `list_files` - Lists all files in the workspace
2. `read_file` - Reads and returns file content
3. `write_file` - Creates or overwrites a file
4. `edit_file` - Edits specific lines in a file
5. `delete_file` - Deletes a file from the workspace

These tools can be accessed through any MCP-compatible client (like **Cursor** or **Claude Desktop**).

---

## 📦 Quick Start (Using npm package)

The easiest way to use this MCP server is through npm:

### Step 1: Add to your MCP configuration

Add this to your `claude_desktop_config.json` or MCP settings file:

```json
{
  "mcpServers": {
    "file_rwle": {
      "command": "npx",
      "args": ["-y", "mcp-file-rwle"]
    }
  }
}
```

### Step 2: Restart your MCP client

Restart **Claude Desktop** or **Cursor** and the server will be automatically downloaded and started!

### Step 3: Use it!

Your AI assistant can now:
- Create files in your workspace
- Read and edit existing files
- List all files in the workspace
- Delete files when needed

---

## 🛠️ Local Development Setup

Want to modify or contribute? Follow these steps:

### Step 1: Clone the repository

```bash
git clone https://github.com/suvidhay/File_RWLE.git
cd File_RWLE
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Test locally

```bash
npm start
```

The server will start and create a `workspace` folder in your current directory if it doesn't exist.

---

## 🧪 Manual Testing

You can test file operations directly in Node.js:

```bash
node
```

Then run these commands:

```javascript
import fs from "fs";
import path from "path";

const ROOT_DIR = path.join(process.cwd(), "workspace");

// Create a test file
fs.writeFileSync(path.join(ROOT_DIR, "test.txt"), "Hello MCP!");

// List files
console.log(fs.readdirSync(ROOT_DIR)); // ['test.txt']

// Read the file
console.log(fs.readFileSync(path.join(ROOT_DIR, "test.txt"), "utf-8")); // Hello MCP!
```

---

## 🌍 Publishing Your Own Version

Want to publish your modified version to npm?

### Step 1: Update package.json

Change the package name to something unique:

```json
{
  "name": "your-mcp-file-server",
  "version": "1.0.0",
  ...
}
```

### Step 2: Login to npm

```bash
npm login
```

### Step 3: Publish

```bash
npm publish --access public
```

### Step 4: Use your package

```json
{
  "mcpServers": {
    "my_file_server": {
      "command": "npx",
      "args": ["-y", "your-mcp-file-server"]
    }
  }
}
```

---

## 📂 Workspace Folder

- All file operations happen inside a `workspace` folder
- The folder is automatically created in your current working directory
- Files are isolated to this folder for safety

---

## 🔧 Configuration Locations

### For Claude Desktop:

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Linux:**
```
~/.config/Claude/claude_desktop_config.json
```

### For Cursor:

Check Cursor's MCP settings in the application preferences.

---

## 🐛 Troubleshooting

### Server not connecting?

1. Make sure you've restarted your MCP client after adding the configuration
2. Check that Node.js is installed: `node --version`
3. Verify the configuration JSON syntax is correct

### Files not appearing?

- The `workspace` folder is created in the directory where the server runs
- Check the working directory of your MCP client

### Permission errors?

- Ensure you have write permissions in the directory
- On macOS/Linux, you might need to allow terminal access in System Preferences

---

## 🛡️ Available Tools

### 1. `list_files`
Lists all files in the workspace folder.

**Input:** None  
**Output:** Array of filenames

---

### 2. `read_file`
Reads the content of a specific file.

**Input:**
- `filename` (string): Name of the file to read

**Output:** File content as text

---

### 3. `write_file`
Creates a new file or overwrites an existing one.

**Input:**
- `filename` (string): Name of the file
- `content` (string): Content to write

**Output:** Success confirmation

---

### 4. `edit_file`
Edits specific lines in an existing file.

**Input:**
- `filename` (string): Name of the file to edit
- `edits` (array): Array of `{ line: number, newText: string }` objects

**Output:** Success confirmation with number of lines edited

---

### 5. `delete_file`
Deletes a file from the workspace.

**Input:**
- `filename` (string): Name of the file to delete

**Output:** Success confirmation

---

## 📝 Example Usage

Once configured, you can ask your AI assistant:

> "Can you create a file called notes.txt with 'Hello World'?"

> "List all files in my workspace"

> "Read the contents of notes.txt"

> "Edit line 1 of notes.txt to say 'Hello MCP!'"

> "Delete the file notes.txt"

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🧑‍💻 Author

**Suvidha Yadav**

- GitHub: [@suvidhay](https://github.com/suvidhay)
- Package: [mcp-file-rwle](https://www.npmjs.com/package/mcp-file-rwle)

---

## 🙏 Acknowledgments

- Built with [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/sdk)
- Uses [Zod](https://github.com/colinhacks/zod) for schema validation

---


