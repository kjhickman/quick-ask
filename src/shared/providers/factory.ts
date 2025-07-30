import { PROVIDERS, type ProviderType } from '../config/constants';
import { AnthropicStrategy } from './strategies/anthropic-strategy';
import { GeminiStrategy } from './strategies/gemini-strategy';
import { LMStudioStrategy } from './strategies/lmstudio-strategy';
import { MistralStrategy } from './strategies/mistral-strategy';
import { OllamaStrategy } from './strategies/ollama-strategy';
import { OpenAIStrategy } from './strategies/openai-strategy';
import type { LLMProviderStrategy } from './types';

const strategies: Map<ProviderType, LLMProviderStrategy> = new Map([
  [PROVIDERS.OPENAI, new OpenAIStrategy()],
  [PROVIDERS.ANTHROPIC, new AnthropicStrategy()],
  [PROVIDERS.LMSTUDIO, new LMStudioStrategy()],
  [PROVIDERS.OLLAMA, new OllamaStrategy()],
  [PROVIDERS.MISTRAL, new MistralStrategy()],
  [PROVIDERS.GEMINI, new GeminiStrategy()],
]);

export function getStrategy(provider: ProviderType): LLMProviderStrategy {
  const strategy = strategies.get(provider);

  if (!strategy) {
    throw new Error(`Unsupported provider: ${provider}`);
  }

  return strategy;
}

export function getAvailableProviders(): ProviderType[] {
  return Array.from(strategies.keys());
}

export function registerStrategy(provider: ProviderType, strategy: LLMProviderStrategy): void {
  strategies.set(provider, strategy);
}
