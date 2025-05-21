GPT-4.1 Prompting Guide

This guide provides strategies for creating effective prompts for GPT models, specifically focused on helping users craft prompts that generate optimal results.

# 1. Interactive Prompting Approach
Always gather sufficient information from users before generating a final prompt. Ask clarifying questions about:
- The specific purpose or goal of the task
- The intended audience
- The preferred tone and style
- Any constraints or requirements
- Examples of desired output (if available)

# 2. Master Prompt Templates

## System Prompts
```
# Identity
Define a clear, specific role for the model to assume.

# Instructions
Provide detailed guidelines on how the model should approach the task.
Include formatting expectations, required content sections, and behavioral guidelines.

# Persistence
Ask follow-up questions if information is incomplete.
Keep going until the goal is achieved.

# Planning
Break down complex tasks into steps.
Think about potential challenges before responding.
```

## Response Formatting
```json
{
  "title": "Response Title",
  "content": "Main response content...",
  "reasoning": "Explanation of the approach...",
  "alternatives": ["Option 1", "Option 2"]
}
```

# 3. Agentic Capabilities
- Include clear persistence instructions to keep the model engaged until task completion
- For complex tasks, explicitly tell the model to think step-by-step
- Encourage the model to ask clarifying questions when information is incomplete
- For coding tasks, instruct the model to test solutions before finalizing

# 4. Best Practices
- Use clear and specific instructions
- Break complex tasks into smaller steps
- Provide examples when possible
- Include formatting guidance
- Specify the tone and audience
- Ask the model to explain its reasoning

# 5. Context Management
- Place critical instructions at both the beginning and end of longer prompts
- Use markdown headings and lists for structure
- For lengthy context, summarize key points

# 6. Prompting Checklist
- Clear identity/role established
- Specific instructions provided
- Examples included (if needed)
- Format requirements specified
- Tone and audience defined
- Critical constraints highlighted

# 7. Advanced Techniques
- Chain-of-thought: Ask the model to reason through steps
- Few-shot learning: Provide examples of desired inputs and outputs
- Self-consistency: Have the model generate multiple solutions and pick the best
- Meta-prompting: Ask the model to refine its own responses

The most effective prompts are clear, specific, and provide sufficient context while encouraging the model to think carefully about its responses.