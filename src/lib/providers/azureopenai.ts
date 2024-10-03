import { AzureChatOpenAI, AzureOpenAIEmbeddings } from '@langchain/openai';
import {
  getAzureOpenAIApiKey,
  getAzureOpenAIInstance,
  getAzureOpenAIDeployment,
  getAzureOpenAIModel,
  getAzureOpenAIAPIVersion,
} from '../../config';
import {
  getAzureOpenAIEmbeddingApiKey,
  getAzureOpenAIEmbeddingDeployment,
  getAzureOpenAIEmbeddingApiVersion,
  getAzureOpenAIEmbeddingInstance,
} from '../../config';
import logger from '../../utils/logger';

export const loadAzureOpenAIChatModels = async () => {
  const AzureOpenAIModel = getAzureOpenAIModel();
  const AzureOpenAIApiKey = getAzureOpenAIApiKey();
  const AzureOpenAIInstance = getAzureOpenAIInstance();
  const AzureOpenAIDeployment = getAzureOpenAIDeployment();
  const AzureOpenAIApiVersion = getAzureOpenAIAPIVersion();

  if (!AzureOpenAIApiKey) return {};

  try {
    const chatModels = {
      'gpt-4o': {
        displayName: 'GPT-4o',
        model: new AzureChatOpenAI({
          model: AzureOpenAIModel,
          azureOpenAIApiKey: AzureOpenAIApiKey,
          azureOpenAIApiInstanceName: AzureOpenAIInstance,
          azureOpenAIApiDeploymentName: AzureOpenAIDeployment,
          azureOpenAIApiVersion: AzureOpenAIApiVersion,
          temperature: 0,
        }),
      },
    };
    logger.info("Returned GPT-4o from AzureOpenAI")
    return chatModels;
  } catch (err) {
    logger.error(`Error loading AzureOpenAI models: ${err}`);
    return {};
  }
};

export const loadAzureOpenAIEmbeddingsModels = async () => {
  const AzureOpenAIEmbeddingApiKey = getAzureOpenAIEmbeddingApiKey();
  const AzureOpenAIEmbeddingDeployment = getAzureOpenAIEmbeddingDeployment();
  const AzureOpenAIEmbeddingApiVersion = getAzureOpenAIEmbeddingApiVersion();
  const AzureOpenAIEmbeddingInstance = getAzureOpenAIEmbeddingInstance();

  if (!AzureOpenAIEmbeddingApiKey) return {};

  try {
    const embeddingModels = {
      'text-embedding-3-small': {
        displayName: 'Text Embedding 3 Small',
        model: new AzureOpenAIEmbeddings({
          azureOpenAIApiKey: AzureOpenAIEmbeddingApiKey,
          azureOpenAIApiInstanceName: AzureOpenAIEmbeddingInstance,
          azureOpenAIApiEmbeddingsDeploymentName:
            AzureOpenAIEmbeddingDeployment,
          azureOpenAIApiVersion: AzureOpenAIEmbeddingApiVersion,
        }),
      },
    };
    logger.info('Returned text-embedding-3-small from AzureOpenAIEmbeddings');
    return embeddingModels;
  } catch (err) {
    logger.error(`Error loading AzureOpenAI embeddings model: ${err}`);
    return {};
  }
};
