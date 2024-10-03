import fs from 'fs';
import path from 'path';
import toml from '@iarna/toml';
import { string } from 'zod';

const configFileName = 'config.toml';

interface Config {
  GENERAL: {
    PORT: number;
    SIMILARITY_MEASURE: string;
  };
  API_KEYS: {
    OPENAI: string;
    GROQ: string;
    ANTHROPIC: string;
  };
  API_ENDPOINTS: {
    SEARXNG: string;
    OLLAMA: string;
  };
  AZURE_OPENAI: {
    AZURE_OPENAI_MODEL: string;
    AZURE_OPENAI_API_KEY: string;
    AZURE_OPENAI_INSTANCE: string;
    AZURE_OPENAI_DEPLOYMENT: string;
    AZURE_OPENAI_API_VERSION: string;
  };
  AZURE_OPENAI_EMBEDDING: {
    AZURE_OPENAI_EMBEDDING_API_KEY: string;
    AZURE_OPENAI_EMBEDDING_INSTANCE: string;
    AZURE_OPENAI_EMBEDDING_DEPLOYMENT: string;
    AZURE_OPENAI_EMBEDDING_API_VERSION: string;
  }
}

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

const loadConfig = () =>
  toml.parse(
    fs.readFileSync(path.join(__dirname, `../${configFileName}`), 'utf-8'),
  ) as any as Config;

export const getPort = () => loadConfig().GENERAL.PORT;

export const getSimilarityMeasure = () =>
  loadConfig().GENERAL.SIMILARITY_MEASURE;

export const getOpenaiApiKey = () => loadConfig().API_KEYS.OPENAI;

export const getGroqApiKey = () => loadConfig().API_KEYS.GROQ;

export const getAnthropicApiKey = () => loadConfig().API_KEYS.ANTHROPIC;

export const getSearxngApiEndpoint = () =>
  process.env.SEARXNG_API_URL || loadConfig().API_ENDPOINTS.SEARXNG;

export const getOllamaApiEndpoint = () => loadConfig().API_ENDPOINTS.OLLAMA;

// For AzureOpenAI
export const getAzureOpenAIModel = () => loadConfig().AZURE_OPENAI.AZURE_OPENAI_MODEL;
export const getAzureOpenAIApiKey = () => loadConfig().AZURE_OPENAI.AZURE_OPENAI_API_KEY;
export const getAzureOpenAIInstance = () => loadConfig().AZURE_OPENAI.AZURE_OPENAI_INSTANCE;
export const getAzureOpenAIDeployment = () => loadConfig().AZURE_OPENAI.AZURE_OPENAI_DEPLOYMENT;
export const getAzureOpenAIAPIVersion = () => loadConfig().AZURE_OPENAI.AZURE_OPENAI_API_VERSION;

// For AzureOpenAI Embeddings
export const getAzureOpenAIEmbeddingApiKey = () => loadConfig().AZURE_OPENAI_EMBEDDING.AZURE_OPENAI_EMBEDDING_API_KEY;
export const getAzureOpenAIEmbeddingInstance = () => loadConfig().AZURE_OPENAI_EMBEDDING.AZURE_OPENAI_EMBEDDING_INSTANCE;
export const getAzureOpenAIEmbeddingDeployment = () => loadConfig().AZURE_OPENAI_EMBEDDING.AZURE_OPENAI_EMBEDDING_DEPLOYMENT;
export const getAzureOpenAIEmbeddingApiVersion = () => loadConfig().AZURE_OPENAI_EMBEDDING.AZURE_OPENAI_EMBEDDING_API_VERSION;



export const updateConfig = (config: RecursivePartial<Config>) => {
  const currentConfig = loadConfig();

  for (const key in currentConfig) {
    if (!config[key]) config[key] = {};

    if (typeof currentConfig[key] === 'object' && currentConfig[key] !== null) {
      for (const nestedKey in currentConfig[key]) {
        if (
          !config[key][nestedKey] &&
          currentConfig[key][nestedKey] &&
          config[key][nestedKey] !== ''
        ) {
          config[key][nestedKey] = currentConfig[key][nestedKey];
        }
      }
    } else if (currentConfig[key] && config[key] !== '') {
      config[key] = currentConfig[key];
    }
  }

  fs.writeFileSync(
    path.join(__dirname, `../${configFileName}`),
    toml.stringify(config),
  );
};
