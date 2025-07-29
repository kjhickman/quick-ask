/**
 * Application constants and configuration
 */

export const API_ENDPOINTS = {
  OPENAI: 'https://api.openai.com/v1/chat/completions',
  ANTHROPIC: 'https://api.anthropic.com/v1/messages',
  LMSTUDIO: 'http://localhost:1234/v1/chat/completions',
  OLLAMA: 'http://localhost:11434/api/chat',
} as const;

export const DEFAULT_MODELS = {
  openai: 'gpt-4o-mini',
  anthropic: 'claude-3-5-haiku-latest',
  lmstudio: 'google/gemma-3-4b',
  ollama: 'gemma3:4b',
} as const;

export const PROVIDERS = {
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
  LMSTUDIO: 'lmstudio',
  OLLAMA: 'ollama',
} as const;

export const UI_CONSTANTS = {
  OMNIBOX_KEYWORD: 'ask',
  EXTENSION_NAME: 'QuickAsk',
  DEFAULT_TIMEOUT: 30000, // 30 seconds
  MAX_RESPONSE_LENGTH: 10000,
  SYSTEM_PROMPT:
    "You are a helpful AI assistant. Provide clear, concise, and accurate responses. When answering technical questions, be specific and include practical examples when appropriate. You can only answer the question, there will be no follow up question so don't ask a question at the end.",
} as const;

export const ERROR_MESSAGES = {
  NO_API_KEY: 'Please configure your API key in the extension popup',
  API_ERROR: 'Failed to get response from API',
  NETWORK_ERROR: 'Network error occurred',
  TIMEOUT_ERROR: 'Request timed out',
  LMSTUDIO_SERVER_ERROR:
    'Local LM Studio server is not running. Please start LM Studio and ensure the server is running on port 1234.',
  OLLAMA_SERVER_ERROR:
    'Ollama server is not running. Please start Ollama and ensure the server is running on port 11434.',
} as const;

// Type definitions
export type Provider = (typeof PROVIDERS)[keyof typeof PROVIDERS];
export type ApiEndpoint = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS];
export type DefaultModel = (typeof DEFAULT_MODELS)[keyof typeof DEFAULT_MODELS];
export type ErrorMessage = (typeof ERROR_MESSAGES)[keyof typeof ERROR_MESSAGES];

// Configuration interface
export interface ApiConfig {
  provider: Provider;
  apiKey: string;
  model?: string;
}

// Request configuration interface
export interface RequestConfig {
  url: string;
  headers: Record<string, string>;
  body: Record<string, unknown>;
}

// API response interfaces
export interface OpenAIChoice {
  delta?: {
    content?: string;
  };
}

export interface OpenAIResponse {
  choices?: OpenAIChoice[];
}

export interface AnthropicDelta {
  text?: string;
}

export interface AnthropicResponse {
  type?: string;
  delta?: AnthropicDelta;
}

export interface OllamaMessage {
  role?: string;
  content?: string;
}

export interface OllamaResponse {
  model?: string;
  created_at?: string;
  message?: OllamaMessage;
  done?: boolean;
}
