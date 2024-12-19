import { Message, SourceDetail } from '../types/chat';

// const AI_QUERY_API_URL = 'https://ai-query.onpointsoft.com/api';

const AI_QUERY_API_URL = 'http://192.168.1.14:8000/api';
interface AIQueryResponse {
  response: string;
  error?: string;
}                         

export async function getMedicalResponse(
  userMessage: string,
  language: string,
  collectionName: string,
  source_details?: SourceDetail[]
): Promise<Message> {
  try {
    console.log('Sending request to API:', {
      url: AI_QUERY_API_URL,
      message: userMessage,
      language,
      collectionName,
      source_details,
    });

    const response = await fetch(AI_QUERY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: userMessage,
        language: language,
        collection_name: "clinicaltrac", 
      }),
    });

    console.log('API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: { answer?: string; error?: string } = await response.json();
    console.log('API Response Data:', data);

    if (data.error) {
      console.error('API Error:', data.error);
      throw new Error(data.error);
    }

    if (!data.answer) {
      console.error('Empty response from API');
      throw new Error('Empty response from API');
    }

    return {
      id: Date.now().toString(),
      content: data.answer, // Correct key used
      role: 'assistant',
      timestamp: new Date(),
      language,
      source_details: data.source_details || [], // Handle undefined or missing source_details

    };
  } catch (error) {
    console.error('Error calling AI Query API:', error);

    return {
      id: Date.now().toString(),
      content: `I apologize, but I'm having trouble processing your request at the moment. Error: ${
        error instanceof Error ? error.message : 'Unknown error'
      }. Please try again in a few moments.`,
      role: 'assistant',
      timestamp: new Date(),
      language,
    };
  }
}

