import { useEffect, useState } from "react";
import axios from "axios";
import {
  fetchCurrencies,
  fetchExchangeRate,
  getCurrencyImageUrl,
} from "../api/services";

export default function CurrencyConverter() {
  const [currencies, setCurrencies] = useState([]);
  const [filteredCurrencies, setFilteredCurrencies] = useState([]);
  const [base, setBase] = useState("USD");
  const [target, setTarget] = useState("EUR");
  const [rates, setRates] = useState({});
  const [baseValue, setBaseValue] = useState("1");
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerTarget, setDrawerTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCurrencies().then((data) => {
      setCurrencies(data);
      setFilteredCurrencies(
        data.filter(({ code }) => code !== base && code !== target)
      );
    });
  }, [base, target]);

  useEffect(() => {
    loadExchangeRate();
  }, [base]);

  const loadExchangeRate = () => {
    if (rates[base]) return;
    setLoading(true);
    fetchExchangeRate(base)
      .then((data) => setRates((prev) => ({ ...prev, [base]: data })))
      .finally(() => setLoading(false));
  };

  const handleBaseValueChange = (e) => {
    let value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setBaseValue(value);
    }
  };

  const handleSwap = () => {
    const newBase = target;
    const newTarget = base;
    const currentRate = rates[base]?.[target] || 1;
    const newValue = (parseFloat(baseValue) * currentRate).toFixed(2);
    setBase(newBase);
    setTarget(newTarget);
    setBaseValue(newValue);
  };

  const handleCurrencySelect = (code) => {
    if (drawerTarget === "base") setBase(code);
    else setTarget(code);
    setShowDrawer(false);
    setSearch("");
  };

  const filteredList = filteredCurrencies.filter(
    ({ code, name }) =>
      code.toLowerCase().includes(search.toLowerCase()) ||
      name.toLowerCase().includes(search.toLowerCase())
  );

  const convertedValue = () => {
    const rate = rates[base]?.[target] || 0;
    const parsed = parseFloat(baseValue);
    return !isNaN(parsed) ? (parsed * rate).toFixed(2) : "0.00";
  };

  return (
    <main className="bg-white p-6 rounded-xl w-full max-w-md shadow-md relative">
      <h1 className="text-center text-indigo-600 text-xl uppercase font-semibold mb-6">
        Currency Converter
      </h1>

      <div
        className={`relative flex flex-col gap-4 ${
          loading ? "animate-pulse" : ""
        }`}
      >
        {/* Base currency input */}
        <div className="flex bg-slate-100 rounded-lg overflow-hidden shadow-inner">
          <button
            className="flex items-center gap-2 px-4 py-2 text-gray-700 font-semibold"
            onClick={() => {
              setDrawerTarget("base");
              setShowDrawer(true);
            }}
          >
            <span
              className="w-6 h-6 rounded-full bg-teal-600 bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${getCurrencyImageUrl(base)})` }}
            ></span>
            {base}
            <img className="max-w-[32px]" src="/dropdown.svg" alt="" />
          </button>
          <input
            type="text"
            inputMode="decimal"
            className="w-full text-right text-2xl bg-transparent px-4 py-2 outline-none"
            value={baseValue}
            onChange={handleBaseValueChange}
          />
        </div>

        {/* Swap button */}
        <button
          className="self-center -my-2 w-10 h-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg flex items-center justify-center"
          onClick={handleSwap}
        >
          <img
            className="max-w-[32px] transition-transform duration-300 ease-in-out hover:rotate-180"
            src="/swap.svg"
            alt=""
          />
        </button>

        {/* Target currency input */}
        <div className="flex bg-slate-100 rounded-lg overflow-hidden shadow-inner">
          <button
            className="flex items-center gap-2 px-4 py-2 text-gray-700 font-semibold"
            onClick={() => {
              setDrawerTarget("target");
              setShowDrawer(true);
            }}
          >
            <span
              className="w-6 h-6 rounded-full bg-teal-600 bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${getCurrencyImageUrl(target)})` }}
            ></span>
            {target}
            <img className="max-w-[32px]" src="/dropdown.svg" alt="" />
          </button>
          <input
            type="text"
            className="w-full text-right text-2xl bg-transparent px-4 py-2 outline-none"
            value={convertedValue()}
            readOnly
          />
        </div>
      </div>

      <div className="text-center mt-6">
        <h5 className="uppercase text-indigo-600 font-medium">Exchange Rate</h5>
        <span className="block mt-2 text-gray-700 font-medium">
          {rates[base]?.[target]
            ? `1 ${base} = ${rates[base][target].toFixed(2)} ${target}`
            : ""}
        </span>
      </div>

      {showDrawer && (
        <div className="absolute inset-0 bg-white p-6 rounded-xl z-10 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowDrawer(false)}
              className="opacity-50 hover:opacity-100"
            >
              <img className="max-w-[32px]" src="/back-arrow.svg" alt="" />
            </button>
            <h3 className="text-lg font-semibold">Select Currency</h3>
          </div>
          <input
            type="search"
            className="w-full p-2 border border-gray-300 rounded-md mb-4 outline-green-600"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ul className="space-y-2">
            {filteredList.map(({ code, name }) => (
              <li
                key={code}
                onClick={() => handleCurrencySelect(code)}
                className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 p-2 rounded"
              >
                <img
                  src={getCurrencyImageUrl(code)}
                  alt={name}
                  className="w-6 h-4 object-cover"
                />
                <div>
                  <h4 className="font-medium">{code}</h4>
                  <p className="text-sm text-gray-500">{name}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
