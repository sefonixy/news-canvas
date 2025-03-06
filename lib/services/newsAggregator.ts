import { Article, NewsFilters } from '../types';
import { fetchNewsApiHeadlines } from './newsApi';
import { fetchGuardianArticles } from './guardianApi';
import { fetchNYTimesArticles } from './nyTimesApi';

export async function fetchAllArticles(filters: NewsFilters = {}): Promise<Article[]> {
  try {
    const apiStatus = {
      newsapi: true,
      guardian: true,
      nytimes: true
    };
    
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
    
    if (!apiStatus.newsapi && !apiStatus.guardian && !apiStatus.nytimes) {
      console.error('All news sources failed to load');
    }
    
    const allArticles = [...newsApiArticles, ...guardianArticles, ...nyTimesArticles];
    
    const sourceCounts = {
      newsapi: newsApiArticles.length,
      guardian: guardianArticles.length,
      nytimes: nyTimesArticles.length,
      total: newsApiArticles.length + guardianArticles.length + nyTimesArticles.length
    };
    console.log('Article sources distribution:', sourceCounts);
    
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
  
  if (filters.query && filters.query.trim() !== '') {
    const query = filters.query.toLowerCase();
    filteredArticles = filteredArticles.filter(article => 
      article.title.toLowerCase().includes(query) || 
      article.description.toLowerCase().includes(query) ||
      article.content.toLowerCase().includes(query)
    );
  }
  
  if (filters.sources && filters.sources.length > 0) {
    filteredArticles = filteredArticles.filter(article => 
      filters.sources?.includes(article.source)
    );
  }
  
  if (filters.categories && filters.categories.length > 0) {
    filteredArticles = filteredArticles.filter(article => 
      article.category && filters.categories?.includes(article.category)
    );
  }
  
  if (filters.authors && filters.authors.length > 0) {
    filteredArticles = filteredArticles.filter(article => 
      article.author && filters.authors?.includes(article.author)
    );
  }
  
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
  const allArticles = await fetchAllArticles(filters);
  
  let personalizedArticles = allArticles;
  
  if (
    preferences.preferredSources.length > 0 ||
    preferences.preferredCategories.length > 0 ||
    preferences.preferredAuthors.length > 0
  ) {
    const scoredArticles = allArticles.map(article => {
      let score = 0;
      
      if (preferences.preferredSources.includes(article.source)) {
        score += 3;
      }
      
      if (article.category && preferences.preferredCategories.includes(article.category)) {
        score += 2;
      }
      
      if (article.author && preferences.preferredAuthors.includes(article.author)) {
        score += 1;
      }
      
      return { article, score };
    });
    
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