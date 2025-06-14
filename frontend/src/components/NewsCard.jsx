import { useEffect, useState } from "react";
import { fetchBusinessNews } from "../api/services";

export default function NewsList() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const articles = await fetchBusinessNews();
      setNews(articles.slice(0, 5)); // Limitar a 5 noticias
    } catch (error) {
      console.error("Error loading news", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading news...</p>;

  return (
    <div className="p-4 shadow-md rounded-xl border border-gray-200">
      <h2 className="text-xl font-bold mb-4">News Highlights</h2>
      <ul className="space-y-4">
        {news.map((article, index) => (
          <li
            key={index}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:bg-gray-50 transition"
          >
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              <div className="flex items-start gap-4">
                {article.urlToImage && (
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="w-24 h-16 object-cover rounded self-start"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1 line-clamp-2">{article.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {new Date(article.publishedAt).toLocaleString()}
                  </p>
                  {article.description && (
                    <p className="text-sm text-gray-700 line-clamp-2">{article.description}</p>
                  )}
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
