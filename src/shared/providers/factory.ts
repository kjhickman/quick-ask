import { PROVIDERS, type Provider } from '../config/constants';
import { AnthropicStrategy } from './strategies/anthropic-strategy';
import { LMStudioStrategy } from './strategies/lmstudio-strategy';
import { OllamaStrategy } from './strategies/ollama-strategy';
import { OpenAIStrategy } from './strategies/openai-strategy';
import type { LLMProviderStrategy } from './types';

const strategies: Map<Provider, LLMProviderStrategy> = new Map([
  [PROVIDERS.OPENAI, new OpenAIStrategy()],
  [PROVIDERS.ANTHROPIC, new AnthropicStrategy()],
  [PROVIDERS.LMSTUDIO, new LMStudioStrategy()],
  [PROVIDERS.OLLAMA, new OllamaStrategy()],
]);

export function getStrategy(provider: Provider): LLMProviderStrategy {
  const strategy = strategies.get(provider);

  if (!strategy) {
    throw new Error(`Unsupported provider: ${provider}`);
  }

  return strategy;
}

export function getAvailableProviders(): Provider[] {
  return Array.from(strategies.keys());
}

export function registerStrategy(provider: Provider, strategy: LLMProviderStrategy): void {
  strategies.set(provider, strategy);
}
