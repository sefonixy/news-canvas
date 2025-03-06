'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DebugInfo() {
  const [apiStatus, setApiStatus] = useState({
    guardian: { status: 'unknown', message: 'Not tested' },
    newsapi: { status: 'unknown', message: 'Not tested' },
    nytimes: { status: 'unknown', message: 'Not tested' }
  });
  const [isVisible, setIsVisible] = useState(false);

  const checkGuardianAPI = async () => {
    try {
      const key = process.env.NEXT_PUBLIC_GUARDIAN_API_KEY;
      if (!key || key === 'your_guardian_api_key_here') {
        return { status: 'error', message: 'API key not set' };
      }
      
      const response = await fetch(`https://content.guardianapis.com/search?api-key=${key}&page-size=1`);
      const data = await response.json();
      
      if (response.ok && data.response && data.response.status === 'ok') {
        return { status: 'success', message: 'Connected successfully' };
      } else {
        return { status: 'error', message: data.response?.message || 'Unknown error' };
      }
    } catch (error) {
      return { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const checkNewsAPI = async () => {
    try {
      const key = process.env.NEXT_PUBLIC_NEWSAPI_KEY;
      if (!key || key === 'your_newsapi_key_here') {
        return { status: 'error', message: 'API key not set' };
      }
      
      const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${key}&pageSize=1`);
      const data = await response.json();
      
      if (response.ok && data.status === 'ok') {
        return { status: 'success', message: 'Connected successfully' };
      } else {
        return { status: 'error', message: data.message || 'Unknown error' };
      }
    } catch (error) {
      return { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const checkNYTimesAPI = async () => {
    try {
      const key = process.env.NEXT_PUBLIC_NYTIMES_API_KEY;
      if (!key || key === 'your_nytimes_api_key_here') {
        return { status: 'error', message: 'API key not set' };
      }
      
      const response = await fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=${key}&page=0&fl=headline`);
      const data = await response.json();
      
      if (response.ok && data.status === 'OK') {
        return { status: 'success', message: 'Connected successfully' };
      } else {
        return { status: 'error', message: data.fault?.faultstring || 'Unknown error' };
      }
    } catch (error) {
      return { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const checkAllAPIs = async () => {
    setApiStatus({
      guardian: { status: 'loading', message: 'Checking...' },
      newsapi: { status: 'loading', message: 'Checking...' },
      nytimes: { status: 'loading', message: 'Checking...' }
    });

    const [guardianStatus, newsapiStatus, nytimesStatus] = await Promise.all([
      checkGuardianAPI(),
      checkNewsAPI(),
      checkNYTimesAPI()
    ]);

    setApiStatus({
      guardian: guardianStatus,
      newsapi: newsapiStatus,
      nytimes: nytimesStatus
    });
  };

  if (!isVisible) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className="fixed bottom-4 right-4 z-50"
        onClick={() => setIsVisible(true)}
      >
        Debug APIs
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm">API Status</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0"
            onClick={() => setIsVisible(false)}
          >
            ✕
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span>The Guardian:</span>
          <span className={apiStatus.guardian.status === 'success' ? 'text-green-500' : apiStatus.guardian.status === 'error' ? 'text-red-500' : 'text-yellow-500'}>
            {apiStatus.guardian.message}
          </span>
        </div>
        <div className="flex justify-between">
          <span>NewsAPI:</span>
          <span className={apiStatus.newsapi.status === 'success' ? 'text-green-500' : apiStatus.newsapi.status === 'error' ? 'text-red-500' : 'text-yellow-500'}>
            {apiStatus.newsapi.message}
          </span>
        </div>
        <div className="flex justify-between">
          <span>NY Times:</span>
          <span className={apiStatus.nytimes.status === 'success' ? 'text-green-500' : apiStatus.nytimes.status === 'error' ? 'text-red-500' : 'text-yellow-500'}>
            {apiStatus.nytimes.message}
          </span>
        </div>
        <Button 
          size="sm" 
          className="w-full mt-2"
          onClick={checkAllAPIs}
        >
          Check APIs
        </Button>
      </CardContent>
    </Card>
  );
} 