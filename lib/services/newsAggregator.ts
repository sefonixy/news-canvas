import { Article, NewsFilters } from '../types';
import { fetchNewsApiHeadlines } from './newsApi';
import { fetchGuardianArticles } from './guardianApi';
import { fetchNYTimesArticles } from './nyTimesApi';

export async function fetchAllArticles(filters: NewsFilters = {}): Promise<Article[]> {
  try {
    // Track API statuses to log any issues
    const apiStatus = {
      newsapi: true,
      guardian: true,
      nytimes: true
    };
    
    // Fetch from each source individually with error handling
    let newsApiArticles: Article[] = [];
    let guardianArticles: Article[] = [];
    let nyTimesArticles: Article[] = [];
    
    try {
      newsApiArticles = await fetchNewsApiHeadlines(filters);
    } catch (error) {
      console.error('NewsAPI source failed:', error);
      apiStatus.newsapi = false;
    }
    
    try {
      guardianArticles = await fetchGuardianArticles(filters);
    } catch (error) {
      console.error('Guardian source failed:', error);
      apiStatus.guardian = false;
    }
    
    try {
      nyTimesArticles = await fetchNYTimesArticles(filters);
    } catch (error) {
      console.error('NY Times source failed:', error);
      apiStatus.nytimes = false;
    }
    
    // Log if all APIs failed
    if (!apiStatus.newsapi && !apiStatus.guardian && !apiStatus.nytimes) {
      console.error('All news sources failed to load');
    }
    
    // Combine all articles that were successfully fetched
    const allArticles = [...newsApiArticles, ...guardianArticles, ...nyTimesArticles];
    
    // For debugging - log the source distribution
    const sourceCounts = {
      newsapi: newsApiArticles.length,
      guardian: guardianArticles.length,
      nytimes: nyTimesArticles.length,
      total: newsApiArticles.length + guardianArticles.length + nyTimesArticles.length
    };
    console.log('Article sources distribution:', sourceCounts);
    
    // Sort by date (most recent first)
    return allArticles.sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  } catch (error) {
    console.error('Error fetching combined articles:', error);
    return [];
  }
}

export async function filterArticles(
  articles: Article[],
  filters: NewsFilters
): Promise<Article[]> {
  let filteredArticles = [...articles];
  
  // Apply search query filtering if provided
  if (filters.query && filters.query.trim() !== '') {
    const query = filters.query.toLowerCase();
    filteredArticles = filteredArticles.filter(article => 
      article.title.toLowerCase().includes(query) || 
      article.description.toLowerCase().includes(query) ||
      article.content.toLowerCase().includes(query)
    );
  }
  
  // Apply source filtering if provided
  if (filters.sources && filters.sources.length > 0) {
    filteredArticles = filteredArticles.filter(article => 
      filters.sources?.includes(article.source)
    );
  }
  
  // Apply category filtering if provided
  if (filters.categories && filters.categories.length > 0) {
    filteredArticles = filteredArticles.filter(article => 
      article.category && filters.categories?.includes(article.category)
    );
  }
  
  // Apply author filtering if provided
  if (filters.authors && filters.authors.length > 0) {
    filteredArticles = filteredArticles.filter(article => 
      article.author && filters.authors?.includes(article.author)
    );
  }
  
  // Apply date range filtering if provided
  if (filters.fromDate) {
    const fromDate = new Date(filters.fromDate);
    filteredArticles = filteredArticles.filter(article => 
      new Date(article.publishedAt) >= fromDate
    );
  }
  
  if (filters.toDate) {
    const toDate = new Date(filters.toDate);
    toDate.setHours(23, 59, 59, 999); // End of day
    filteredArticles = filteredArticles.filter(article => 
      new Date(article.publishedAt) <= toDate
    );
  }
  
  return filteredArticles;
}

export async function getPersonalizedFeed(
  filters: NewsFilters,
  preferences: { preferredSources: string[], preferredCategories: string[], preferredAuthors: string[] }
): Promise<Article[]> {
  // First get all articles
  const allArticles = await fetchAllArticles(filters);
  
  // Apply personalization
  let personalizedArticles = allArticles;
  
  // If user has preferences, prioritize those articles
  if (
    preferences.preferredSources.length > 0 ||
    preferences.preferredCategories.length > 0 ||
    preferences.preferredAuthors.length > 0
  ) {
    // Calculate a "relevance score" for each article based on user preferences
    const scoredArticles = allArticles.map(article => {
      let score = 0;
      
      // Source matching
      if (preferences.preferredSources.includes(article.source)) {
        score += 3;
      }
      
      // Category matching
      if (article.category && preferences.preferredCategories.includes(article.category)) {
        score += 2;
      }
      
      // Author matching
      if (article.author && preferences.preferredAuthors.includes(article.author)) {
        score += 1;
      }
      
      return { article, score };
    });
    
    // Sort by score (high to low) and then by date (most recent first)
    personalizedArticles = scoredArticles
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return new Date(b.article.publishedAt).getTime() - new Date(a.article.publishedAt).getTime();
      })
      .map(item => item.article);
  }
  
  return personalizedArticles;
} 