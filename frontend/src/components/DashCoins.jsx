import { useEffect, useState } from 'react';
import { fetchCoins } from '../api/services';

const ITEMS_PER_PAGE = 10;

function DashCoins() {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchCoinData = async () => {
    try {
      const coins = await fetchCoins();
      console.log('Fetched coins:', coins);
      setCoins(coins);
    } catch (error) {
      console.error('Error fetching coin data:', error);
    }
  };

  useEffect(() => {
    fetchCoinData();
  }, []);

  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCoins.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentCoins = filteredCoins.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h3 className="text-2xl font-bold">Coin Market</h3>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Search by name or symbol..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // reset page on search
            }}
            className="p-2 w-full sm:w-1/2 border border-gray-300 rounded-lg shadow-sm"
          />
          <button
            onClick={fetchCoinData}
            className="text-sm px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <img className='max-w-[24px]' src="/refresh.svg" alt="" />
          </button>
        </div>

        <div className="overflow-x-auto rounded border border-gray-300 shadow-sm">
          <table className="min-w-xl divide-y-2 divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left">
              <tr className="*:font-medium *:text-gray-900">
                <th className="px-3 py-2 whitespace-nowrap">Name</th>
                <th className="px-3 py-2 whitespace-nowrap">Symbol</th>
                <th className="px-3 py-2 whitespace-nowrap">Price</th>
                <th className="px-3 py-2 whitespace-nowrap">Market Cap</th>
                <th className="px-3 py-2 whitespace-nowrap">24h Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentCoins.map((coin) => {
                const change = coin.price_change_percentage_24h;
                const isPositive = change >= 0;
                const arrow = isPositive ? '↑' : '↓';
                const color = isPositive ? 'text-green-500' : 'text-red-500';

                return (
                  <tr key={coin.id} className="*:text-gray-900 *:first:font-medium">
                    <td className="flex gap-3 items-center px-3 py-2 whitespace-nowrap">
                      <img className='max-w-[24px]' src={coin.image} alt="" />
                      {coin.name}</td>
                    <td className="px-3 py-2 whitespace-nowrap uppercase">{coin.symbol}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      ${coin.current_price.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      ${coin.market_cap.toLocaleString()}
                    </td>
                    <td className={`px-3 py-2 whitespace-nowrap font-semibold flex items-center gap-1`}>
                      <span className={color}>{arrow}</span>
                      <span className={color}>
                        {Math.abs(change).toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                );
              })}

              {currentCoins.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No coins found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <ul className="flex justify-center gap-1 text-gray-900 mt-6">
          <li>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="grid size-8 place-content-center rounded border border-gray-200 transition-colors hover:bg-gray-50 rtl:rotate-180 disabled:opacity-50"
              aria-label="Previous page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li key={page}>
              <button
                onClick={() => goToPage(page)}
                className={`block size-8 rounded text-center text-sm font-medium border ${
                  page === currentPage
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            </li>
          ))}

          <li>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="grid size-8 place-content-center rounded border border-gray-200 transition-colors hover:bg-gray-50 rtl:rotate-180 disabled:opacity-50"
              aria-label="Next page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default DashCoins;
