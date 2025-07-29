import { PROVIDERS, type Provider } from '../../config/constants';
import { AnthropicStrategy } from './anthropic-strategy';
import type { LLMProviderStrategy } from './llm-provider-strategy';
import { LMStudioStrategy } from './lmstudio-strategy';
import { OllamaStrategy } from './ollama-strategy';
import { OpenAIStrategy } from './openai-strategy';

// Private strategy map
const strategies: Map<Provider, LLMProviderStrategy> = new Map([
  [PROVIDERS.OPENAI, new OpenAIStrategy()],
  [PROVIDERS.ANTHROPIC, new AnthropicStrategy()],
  [PROVIDERS.LMSTUDIO, new LMStudioStrategy()],
  [PROVIDERS.OLLAMA, new OllamaStrategy()],
]);

/**
 * Get a strategy for the specified provider
 * @param provider - The LLM provider
 * @returns The corresponding strategy
 * @throws Error if provider is not supported
 */
export function getStrategy(provider: Provider): LLMProviderStrategy {
  const strategy = strategies.get(provider);

  if (!strategy) {
    throw new Error(`Unsupported provider: ${provider}`);
  }

  return strategy;
}

/**
 * Get all available providers
 * @returns Array of supported provider types
 */
export function getAvailableProviders(): Provider[] {
  return Array.from(strategies.keys());
}

/**
 * Register a new strategy (for extensibility)
 * @param provider - The provider type
 * @param strategy - The strategy implementation
 */
export function registerStrategy(provider: Provider, strategy: LLMProviderStrategy): void {
  strategies.set(provider, strategy);
}

// Default export for backward compatibility
export const LLMStrategyFactory = {
  getStrategy,
  getAvailableProviders,
  registerStrategy,
};
