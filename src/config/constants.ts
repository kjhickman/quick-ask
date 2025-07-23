/**
 * Application constants and configuration
 */

export const API_ENDPOINTS = {
  OPENAI: 'https://api.openai.com/v1/chat/completions',
  ANTHROPIC: 'https://api.anthropic.com/v1/messages',
  LOCAL: 'http://localhost:11434/api/chat',
} as const;

export const DEFAULT_MODELS = {
  openai: 'gpt-4o-mini',
  anthropic: 'claude-3-5-haiku-latest',
  local: 'local-model',
} as const;

export const PROVIDERS = {
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
  LOCAL: 'local',
} as const;

export const UI_CONSTANTS = {
  OMNIBOX_KEYWORD: 'ask',
  EXTENSION_NAME: 'QuickAsk',
  DEFAULT_TIMEOUT: 30000, // 30 seconds
  MAX_RESPONSE_LENGTH: 10000,
} as const;

export const STORAGE_KEYS = {
  CONFIG: 'quickask_config',
  HISTORY: 'quickask_history',
} as const;

export const ERROR_MESSAGES = {
  NO_API_KEY: 'Please configure your API key in the extension popup',
  API_ERROR: 'Failed to get response from API',
  NETWORK_ERROR: 'Network error occurred',
  TIMEOUT_ERROR: 'Request timed out',
} as const;

// Type definitions
export type Provider = (typeof PROVIDERS)[keyof typeof PROVIDERS];
export type ApiEndpoint = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS];
export type DefaultModel = (typeof DEFAULT_MODELS)[keyof typeof DEFAULT_MODELS];
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
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

export interface LocalMessage {
  content?: string;
}

export interface LocalResponse {
  message?: LocalMessage;
}
