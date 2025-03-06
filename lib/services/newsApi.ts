import { Article, NewsApiResponse, NewsFilters } from '../types';

const API_KEY = process.env.NEXT_PUBLIC_NEWSAPI_KEY;
const BASE_URL = 'https://newsapi.org/v2';

export async function fetchNewsApiHeadlines(filters: NewsFilters = {}): Promise<Article[]> {
  try {
    // Check if API key is valid
    if (!API_KEY || API_KEY === 'your_newsapi_key_here') {
      console.warn('NewsAPI key not set properly');
      return [];
    }
    
    const { 
      query, 
      categories, 
      sources,
      fromDate,
      toDate,
      page = 1,
      pageSize = 10 // Reduced page size to avoid rate limits
    } = filters;
    
    const params = new URLSearchParams({
      apiKey: API_KEY || '',
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    
    if (query) params.append('q', query);
    if (sources?.length) params.append('sources', sources.join(','));
    if (categories?.length && categories[0]) params.append('category', categories[0]);
    if (fromDate) params.append('from', fromDate);
    if (toDate) params.append('to', toDate);
    
    const endpoint = query ? 'everything' : 'top-headlines';
    
    // Add country parameter if not using sources (they can't be used together)
    if (endpoint === 'top-headlines' && !sources?.length) {
      params.append('country', 'us');
    }
    
    const response = await fetch(`${BASE_URL}/${endpoint}?${params.toString()}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`NewsAPI error: ${response.status} - ${errorData.message || ''}`);
    }
    
    const data: NewsApiResponse = await response.json();
    
    if (data.status !== 'ok' || !data.articles) {
      console.warn('NewsAPI returned no articles or error status');
      return [];
    }
    
    return data.articles.map(article => ({
      id: `newsapi-${article.title.replace(/\s+/g, '-').toLowerCase()}`,
      title: article.title,
      description: article.description || '',
      content: article.content || '',
      url: article.url,
      imageUrl: article.urlToImage || '',
      source: article.source.name,
      author: article.author || undefined,
      category: categories?.length ? categories[0] : undefined,
      publishedAt: article.publishedAt,
      apiSource: 'newsapi',
    }));
  } catch (error) {
    console.error('Error fetching from NewsAPI:', error);
    return [];
  }
}

export async function fetchNewsApiSources(): Promise<string[]> {
  try {
    // Check if API key is valid
    if (!API_KEY || API_KEY === 'your_newsapi_key_here') {
      return [];
    }
    
    const response = await fetch(`${BASE_URL}/sources?apiKey=${API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`NewsAPI error fetching sources: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.sources) {
      return [];
    }
    
    // Return a limited list to reduce complexity
    return data.sources
      .map((source: { id: string; name: string }) => source.name)
      .slice(0, 20); // Only return top 20 sources
  } catch (error) {
    console.error('Error fetching sources from NewsAPI:', error);
    return [];
  }
}

export async function fetchNewsApiCategories(): Promise<string[]> {
  // NewsAPI has predefined categories
  return [
    'business',
    'technology',
    'sports',
    'science'
  ];
} 