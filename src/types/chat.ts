export interface SourceDetail {
  metadata: {
    url?: string;
    domain?: string | null;
  };
}
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  language?: string;
  source_details?: SourceDetail[];

}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  currentLanguage: string;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}