import { PROVIDERS, type Provider } from '../../config/constants';
import { AnthropicStrategy } from './anthropic-strategy';
import type { LLMProviderStrategy } from './llm-provider-strategy';
import { LMStudioStrategy } from './lmstudio-strategy';
import { OllamaStrategy } from './ollama-strategy';
import { OpenAIStrategy } from './openai-strategy';

/**
 * Factory for creating LLM provider strategies
 */
export class LLMStrategyFactory {
  private static strategies: Map<Provider, LLMProviderStrategy> = new Map([
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
  static getStrategy(provider: Provider): LLMProviderStrategy {
    const strategy = LLMStrategyFactory.strategies.get(provider);

    if (!strategy) {
      throw new Error(`Unsupported provider: ${provider}`);
    }

    return strategy;
  }

  /**
   * Get all available providers
   * @returns Array of supported provider types
   */
  static getAvailableProviders(): Provider[] {
    return Array.from(LLMStrategyFactory.strategies.keys());
  }

  /**
   * Register a new strategy (for extensibility)
   * @param provider - The provider type
   * @param strategy - The strategy implementation
   */
  static registerStrategy(provider: Provider, strategy: LLMProviderStrategy): void {
    LLMStrategyFactory.strategies.set(provider, strategy);
  }
}
