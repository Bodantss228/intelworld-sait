'use client';

import { useEffect, useState } from 'react';
import { Book, ChevronRight } from 'lucide-react';
import wikiData from '@/data/wiki.json';

export default function WikiPage() {
  const [selectedArticle, setSelectedArticle] = useState(wikiData.categories[0].articles[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = wikiData.categories.map((category) => ({
    ...category,
    articles: category.articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  return (
    <div className="container mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold gradient-text mb-4">Wiki & Documentation</h1>
        <p className="text-xl text-gray-300">Everything you need to know about our server</p>
      </div>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-surface border border-primary/30 rounded-lg px-6 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <div className="bg-surface rounded-xl p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Book className="text-primary" size={24} />
              Categories
            </h2>

            <nav className="space-y-4">
              {filteredCategories.map((category) => (
                <div key={category.id}>
                  <h3 className="text-primary font-semibold mb-2">{category.title}</h3>
                  <ul className="space-y-1 ml-4">
                    {category.articles.map((article) => (
                      <li key={article.id}>
                        <button
                          onClick={() => setSelectedArticle(article)}
                          className={`text-left w-full py-1 px-2 rounded transition-colors flex items-center gap-1 ${
                            selectedArticle.id === article.id
                              ? 'bg-primary/20 text-primary'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          <ChevronRight size={16} />
                          {article.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        <main className="lg:col-span-3">
          <article className="bg-surface rounded-xl p-8">
            <h1 className="text-4xl font-bold mb-6 gradient-text">
              {selectedArticle.title}
            </h1>

            <div className="prose prose-invert max-w-none">
              {selectedArticle.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-gray-300 mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-sm text-gray-500">
                Category: <span className="text-primary">{selectedArticle.category}</span>
              </p>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
}
