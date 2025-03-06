import { Article, GuardianResponse, NewsFilters } from '../types';

const API_KEY = process.env.NEXT_PUBLIC_GUARDIAN_API_KEY;
const BASE_URL = 'https://content.guardianapis.com';

export async function fetchGuardianArticles(filters: NewsFilters = {}): Promise<Article[]> {
  try {
    const { 
      query, 
      categories, 
      fromDate,
      toDate,
      page = 1,
      pageSize = 20
    } = filters;
    
    const params = new URLSearchParams({
      'api-key': API_KEY || '',
      'page': page.toString(),
      'page-size': pageSize.toString(),
      'show-fields': 'headline,trailText,thumbnail,body,byline',
    });
    
    if (query) params.append('q', query);
    if (categories?.length) params.append('section', categories.join('|'));
    if (fromDate) params.append('from-date', fromDate);
    if (toDate) params.append('to-date', toDate);
    
    const response = await fetch(`${BASE_URL}/search?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Guardian API error: ${response.status}`);
    }
    
    const data: GuardianResponse = await response.json();
    
    return data.response.results.map(article => ({
      id: article.id,
      title: article.webTitle,
      description: article.fields?.trailText || '',
      content: article.fields?.body || '',
      url: article.webUrl,
      imageUrl: article.fields?.thumbnail || '',
      source: 'The Guardian',
      author: article.fields?.byline,
      category: article.sectionName,
      publishedAt: article.webPublicationDate,
      apiSource: 'guardian',
    }));
  } catch (error) {
    console.error('Error fetching from Guardian API:', error);
    return [];
  }
}

export async function fetchGuardianSections(): Promise<string[]> {
  try {
    const response = await fetch(`${BASE_URL}/sections?api-key=${API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`Guardian API error fetching sections: ${response.status}`);
    }
    
    const data = await response.json();
    return data.response.results.map((section: { id: string; webTitle: string }) => section.webTitle);
  } catch (error) {
    console.error('Error fetching sections from Guardian API:', error);
    return [];
  }
} 