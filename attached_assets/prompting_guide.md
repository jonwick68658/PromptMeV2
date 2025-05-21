# Prompting Playbook — GPT-4.1 & o-Series (o3, o4-mini)

> **Purpose**  
> Elite-quality prompt templates for both GPT “doers” and o‑series “planners”.

## 1 Quick-Pick Matrix
| Priority | Task | Model | API | Note |
|---|---|---|---|---|
| Speed/$ | well‑defined | GPT‑4.1 | Chat/Response | <1 s latency |
| Accuracy | complex plan | o3 | **Response** | asks clarifying Qs |
| Agent flow | planner+doer | o3→GPT | Responses | store=true |
| Vision+reason | charts/images | o1 | Chat | vision support |

## 2 Master Templates
### GPT‑4.1 Chat
```text
{role:"developer",content:`# Identity…# Instructions…## PERSISTENCE…## TOOL CALLING…## PLANNING…# Context…`}
{role:"user",content:"<REQUEST>"}
```
### GPT‑4.1 Response
```text
# Identity …
# Instructions …
# Examples …
# Context …
```
### o‑Series Response
```text
# Identity…
# Instructions…
Formatting re-enabled
```

## 3 Agentic Reminders
```
## PERSISTENCE
Keep going until solved.
## TOOL CALLING
Use tools, never hallucinate.
## PLANNING
Think internally, hide CoT.
```

## 4 Best Practices
* Simple, direct prompts; avoid explicit CoT for o‑series.  
* Use Markdown/XML delimiters.  
* Echo critical rules top & bottom for long prompts.  
* Zero‑shot first; add few‑shot only if necessary.

## 5 Common Snippets
*Structured JSON*
```json
{"title":"","tags":[]}
```
*Diff*
```diff
@@ file.js @@
- old
+ new
```

## 6 Checklist
- Identity present  
- Instructions w/ agent reminders  
- Model pick noted  
- Delimiters OK  
- Examples align  
- No CoT for o‑series  
- Constraints echoed (if long)

*2025‑05‑21* Initial release.
