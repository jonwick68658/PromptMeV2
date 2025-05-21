
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));

const db = new Database("emails.db");
db.exec(`CREATE TABLE IF NOT EXISTS emails(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  address TEXT UNIQUE,
  ts DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

app.post("/api/email", (req, res) => {
  const { email } = req.body || {};
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ ok:false, error:"Invalid email" });
  }
  try {
    db.prepare("INSERT OR IGNORE INTO emails(address) VALUES (?)").run(email);
    return res.json({ ok:true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok:false });
  }
});

const guide = fs.readFileSync(path.join(__dirname,"prompting_guide.md"),"utf-8");

app.post("/api/chat", async (req,res)=>{
  const { messages } = req.body;
  if(!process.env.OPENAI_API_KEY) return res.status(500).json({error:"Missing key"});
  const devMessage = {role:"developer",content:guide};
  const payload = {
    model:"gpt-o3-2025-04-16",
    messages:[devMessage,...messages].slice(-30) // keep context trimmed
  };
  try{
    const ai = await fetch("https://api.openai.com/v1/chat/completions",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${process.env.OPENAI_API_KEY}`
      },
      body:JSON.stringify(payload)
    });
    const data = await ai.json();
    res.json(data);
  }catch(err){
    console.error(err);
    res.status(500).json({error:"openai fail"});
  }
});

app.get("*",(req,res)=> res.sendFile(path.join(__dirname,"dist","index.html")));

app.listen(PORT,"0.0.0.0",()=>console.log("Prompt Me running",PORT));
