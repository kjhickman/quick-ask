import { PROVIDERS, type Provider } from '../../config/constants';
import { AnthropicStrategy } from './anthropic-strategy';
import type { LLMProviderStrategy } from './llm-provider-strategy';
import { LMStudioStrategy } from './lmstudio-strategy';
import { OllamaStrategy } from './ollama-strategy';
import { OpenAIStrategy } from './openai-strategy';

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

export const LLMStrategyFactory = {
  getStrategy,
  getAvailableProviders,
  registerStrategy,
};
