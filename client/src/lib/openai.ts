import { apiRequest } from "./queryClient";
import { Message } from "@shared/schema";

/**
 * Sends a chat request to the OpenAI API through our backend
 */
export async function sendChatRequest(messages: Message[], platform?: string, model?: string) {
  try {
    const response = await apiRequest("POST", "/api/chat", { messages, platform, model });
    return await response.json();
  } catch (error) {
    console.error("Error sending chat request:", error);
    throw error;
  }
}
