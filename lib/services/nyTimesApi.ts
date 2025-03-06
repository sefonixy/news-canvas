import { Article, NYTimesResponse, NewsFilters } from '../types';

const API_KEY = process.env.NEXT_PUBLIC_NYTIMES_API_KEY;
const BASE_URL = 'https://api.nytimes.com/svc/search/v2';

// Add delay function to help with rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simple cache for NY Times responses to reduce API calls
let responseCache: {
  timestamp: number;
  data: Article[];
} | null = null;

// Cache validity duration (10 minutes)
const CACHE_DURATION = 10 * 60 * 1000;

export async function fetchNYTimesArticles(filters: NewsFilters = {}): Promise<Article[]> {
  try {
    // Use cached response if available and recent
    if (responseCache && (Date.now() - responseCache.timestamp < CACHE_DURATION)) {
      console.log('Using cached NY Times response to avoid rate limits');
      return responseCache.data;
    }
    
    const { 
      query, 
      categories, 
      fromDate,
      toDate,
      page = 1
    } = filters;
    
    // Check if API key is valid
    if (!API_KEY || API_KEY === 'your_nytimes_api_key_here') {
      console.warn('NY Times API key not set properly');
      return [];
    }
    
    const params = new URLSearchParams({
      'api-key': API_KEY || '',
      'page': page.toString(),
    });
    
    if (query) params.append('q', query);
    if (categories?.length) params.append('fq', `news_desk:(${categories.join(' ')})`);
    if (fromDate) params.append('begin_date', fromDate.replace(/-/g, ''));
    if (toDate) params.append('end_date', toDate.replace(/-/g, ''));
    
    // Add a small number of results to minimize rate limit issues
    params.append('limit', '3');
    
    // Add random delay before request to help with rate limiting
    await delay(Math.random() * 1000);
    
    // Try the request with a improved retry mechanism for rate limits
    let response;
    let retries = 0;
    const maxRetries = 3;
    
    while (retries <= maxRetries) {
      response = await fetch(`${BASE_URL}/articlesearch.json?${params.toString()}`);
      
      if (response.status !== 429) break; // If not rate limited, break out
      
      // If rate limited, wait and retry with longer delay
      retries++;
      if (retries <= maxRetries) {
        const waitTime = retries * 5000; // 5 seconds, 10 seconds, 15 seconds...
        console.log(`Rate limited by NY Times API, retrying in ${waitTime/1000} seconds...`);
        await delay(waitTime);
      }
    }
    
    if (!response?.ok) {
      throw new Error(`NY Times API error: ${response?.status}`);
    }
    
    const data: NYTimesResponse = await response.json();
    
    // If no docs returned or undefined, return empty array
    if (!data.response?.docs || data.response.docs.length === 0) {
      return [];
    }
    
    const articles = data.response.docs.map(article => {
      // Find the main image if available
      const mainImage = article.multimedia?.find(media => media.type === 'image');
      const imageUrl = mainImage 
        ? `https://www.nytimes.com/${mainImage.url}` 
        : '';
        
      return {
        id: article._id,
        title: article.headline.main,
        description: article.snippet,
        content: article.snippet, // Use snippet as content since lead_paragraph isn't available
        url: article.web_url,
        imageUrl,
        source: 'The New York Times',
        author: article.byline?.original?.replace('By ', '') || undefined,
        category: article.section_name,
        publishedAt: article.pub_date,
        apiSource: 'nytimes' as const,
      };
    });
    
    // Save response to cache
    responseCache = {
      timestamp: Date.now(),
      data: articles
    };
    
    return articles;
  } catch (error) {
    console.error('Error fetching from NY Times API:', error);
    
    // Return cached data on error if available, even if older than normal threshold
    if (responseCache) {
      console.log('Returning cached NY Times data after error');
      return responseCache.data;
    }
    
    return [];
  }
}

export async function fetchNYTimesCategories(): Promise<string[]> {
  // NY Times has predefined sections/news_desks
  // Return a smaller set to reduce API calls initially
  return [
    'Politics',
    'World'
  ];
} 