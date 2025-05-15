
import { useState, useEffect } from 'react';

export const useMarkdown = (markdownPath: string) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    
    fetch(markdownPath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load markdown: ${response.statusText}`);
        }
        return response.text();
      })
      .then(text => {
        setContent(text);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error loading markdown:', err);
        setError(err);
        setIsLoading(false);
      });
  }, [markdownPath]);

  return { content, isLoading, error };
};

// Simple markdown to HTML converter
// In a production app, you would use a library like marked or remark
export const markdownToHtml = (markdown: string): string => {
  if (!markdown) return '';
  
  return markdown
    // Headers
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold my-4">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold my-3">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold my-2">$1</h3>')
    
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // Code blocks
    .replace(/```([a-z]*)\n([\s\S]*?)```/gm, (match, language, code) => 
      `<pre class="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-auto my-4"><code class="language-${language}">${code}</code></pre>`
    )
    
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 rounded text-sm">$1</code>')
    
    // Lists
    .replace(/^- (.*$)/gim, '<ul class="list-disc pl-6 my-2"><li>$1</li></ul>')
    .replace(/^(\d+)\. (.*$)/gim, '<ol class="list-decimal pl-6 my-2"><li>$2</li></ol>')
    
    // Tables (simplified)
    .replace(/^\|(.*)\|$/gim, (match) => {
      const cells = match.split('|').filter(cell => cell.trim() !== '');
      return `<table class="min-w-full border border-gray-200 my-4"><tr>${
        cells.map(cell => `<td class="border px-4 py-2">${cell.trim()}</td>`).join('')
      }</tr></table>`;
    })
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-healthcare-600 hover:underline">$1</a>')
    
    // Paragraphs
    .replace(/^(?!<h|<ul|<ol|<pre|<table)(.+)$/gim, '<p class="my-2">$1</p>')
    
    // Clean up repeated tags
    .replace(/<\/ul>\s*<ul class="list-disc pl-6 my-2">/g, '')
    .replace(/<\/ol>\s*<ol class="list-decimal pl-6 my-2">/g, '')
    .replace(/\n\n/g, '<br />');
};
