import { InvokeLLM } from './agent/printyourfit/printyourfit/src/api/geminiClient.js';
import { browse_web } from '/workspace/poke/web/browse_web.ts';

export async function parseFashionUrl(url: string) {
  // 1. Scrape the URL
  const pageContent = await browse_web({ url });
  
  // 2. Define Schema for structured extraction
  const schema = {
    type: 'object',
    properties: {
      item_details: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          type: { type: 'string' },
          materials: { type: 'string' },
          price: { type: 'string' }
        }
      },
      eco_swaps: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            desc: { type: 'string' },
            link: { type: 'string' },
            material_benefit: { type: 'string' }
          }
        }
      },
      diy_math: {
        type: 'object',
        properties: {
          fabric_needed: { type: 'string' },
          cost_savings: { type: 'string' },
          instructions: { type: 'string' }
        }
      }
    }
  };

  const prompt = \`
    Analyze the following webpage content for a fashion item.
    URL: \${url}
    Content: \${pageContent.substring(0, 10000)}
    
    Tasks:
    1. Extract item name, type (hoodie, dress, etc.), materials, and price.
    2. Suggest 2 eco-friendly/ethical brand swaps for this specific item.
    3. Provide DIY "math" and instructions: estimate how much organic/sustainable fabric would be needed to remake this and a brief instruction.
    
    Return the data in the specified JSON format.
  \`;

  const result = await InvokeLLM({
    prompt,
    response_json_schema: schema
  });

  return result;
}
