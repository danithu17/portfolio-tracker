import { useState, useEffect } from 'react'

function App() {
  const [assets, setAssets] = useState([]);

  const [binanceCoins, setBinanceCoins] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [liqPrice, setLiqPrice] = useState(''); // අලුතින් එකතු කළ Liq Price state එක

  const fetchData = () => {
    fetch('http://localhost:8080/api/assets')
        .then(response => response.json())
        .then(data => setAssets(data))
        .catch(error => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(), 10000);

    fetch('https://api.binance.com/api/v3/ticker/price')
        .then(res => res.json())
        .then(data => {
          const symbols = data
              .filter(item => item.symbol.endsWith('USDT'))
              .map(item => item.symbol.replace('USDT', ''));
          setBinanceCoins(symbols);
        })
        .catch(err => console.error("Error fetching Binance symbols:", err));

    return () => clearInterval(interval);
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value.toUpperCase();
    setSearchQuery(query);
    if (query) {
      setFilteredCoins(binanceCoins.filter(coin => coin.includes(query)).slice(0, 5));
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const selectCoin = (coin) => {
    setSearchQuery(coin);
    setShowDropdown(false);
  };

  const handleAddCoin = (e) => {
    e.preventDefault();
    if (!searchQuery || !quantity || !buyPrice) return;

    const newAsset = {
      coinName: searchQuery,
      symbol: searchQuery,
      quantity: parseFloat(quantity),
      buyPrice: parseFloat(buyPrice),
      liquidationPrice: liqPrice ? parseFloat(liqPrice) : 0 // Liq price එකක් දුන්නේ නැත්නම් 0 ලෙස සලකයි
    };

    fetch('http://localhost:8080/api/assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAsset)
    })
        .then(response => {
          if (response.ok) {
            fetchData();
            setSearchQuery('');
            setQuantity('');
            setBuyPrice('');
            setLiqPrice('');
          } else {
            alert("Failed to add coin.");
          }
        })
        .catch(error => console.error("Error adding asset:", error));
  };

  const handleDelete = (id, coinName) => {
    if (window.confirm(`Are you sure you want to delete ${coinName}?`)) {
      fetch(`http://localhost:8080/api/assets/${id}`, { method: 'DELETE' })
          .then(response => {
            if (response.ok) {
              setAssets(prevAssets => prevAssets.filter(asset => asset.id !== id));
            }
          })
          .catch(error => console.error("Error deleting asset:", error));
    }
  };

  const totalInvested = assets.reduce((sum, asset) => sum + (asset.buyPrice * asset.quantity), 0);
  const totalValue = assets.reduce((sum, asset) => sum + ((asset.currentPrice || 0) * asset.quantity), 0);
  const totalProfit = totalValue - totalInvested;
  const isTotalProfit = totalProfit >= 0;

  return (
      <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12 font-sans selection:bg-blue-500/30">
        <div className="max-w-7xl mx-auto">

          <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            My Crypto Portfolio
          </h1>

          {/* --- Add Coin Form එක --- */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl mb-10">
            <h2 className="text-xl font-bold text-white mb-4">Add Asset (Spot / Futures)</h2>
            <form onSubmit={handleAddCoin} className="flex flex-col md:flex-row gap-4 relative">

              <div className="relative flex-1">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Coin (e.g. BTC)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    required
                />
                {showDropdown && filteredCoins.length > 0 && (
                    <ul className="absolute z-10 w-full bg-slate-800 border border-slate-700 mt-1 rounded-xl shadow-2xl overflow-hidden">
                      {filteredCoins.map(coin => (
                          <li key={coin} onClick={() => selectCoin(coin)} className="px-4 py-3 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors font-medium">
                            {coin}
                          </li>
                      ))}
                    </ul>
                )}
              </div>

              <input
                  type="number" step="any" value={quantity} onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Qty (e.g. 0.5)"
                  className="w-32 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  required
              />

              <input
                  type="number" step="any" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)}
                  placeholder="Entry Price ($)"
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  required
              />

              <input
                  type="number" step="any" value={liqPrice} onChange={(e) => setLiqPrice(e.target.value)}
                  placeholder="Liq. Price ($) Optional"
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-colors"
              />

              <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200 shadow-lg shadow-blue-500/20">
                Add Coin
              </button>
            </form>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
              <h2 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Current Balance</h2>
              <div className="text-3xl md:text-4xl font-bold text-white">${totalValue.toFixed(2)}</div>
            </div>
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
              <h2 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Total Invested</h2>
              <div className="text-3xl md:text-4xl font-bold text-slate-300">${totalInvested.toFixed(2)}</div>
            </div>
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
              <h2 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Total Profit / Loss</h2>
              <div className={`text-3xl md:text-4xl font-bold ${isTotalProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isTotalProfit ? '+' : ''}${totalProfit.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-slate-900 rounded-2xl shadow-2xl border border-slate-800">
            <table className="w-full text-left border-collapse">
              <thead>
              <tr className="bg-slate-950/50 text-slate-400 text-xs md:text-sm uppercase tracking-widest">
                <th className="p-5 font-semibold">Asset</th>
                <th className="p-5 font-semibold">Qty</th>
                <th className="p-5 font-semibold">Entry Price</th>
                <th className="p-5 font-semibold text-rose-400">Liq. Price</th>
                <th className="p-5 font-semibold">Live Price</th>
                <th className="p-5 font-semibold">Risk Level</th>
                <th className="p-5 font-semibold">Profit/Loss</th>
                <th className="p-5 font-semibold text-center">Action</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
              {assets.map((asset) => {
                const livePrice = asset.currentPrice || 0;
                const totalValue = livePrice * asset.quantity;
                const totalCost = asset.buyPrice * asset.quantity;
                const profitOrLoss = totalValue - totalCost;
                const isProfit = profitOrLoss >= 0;

                // Risk එක ගණනය කිරීම (Live Price එක Liq Price එකට කොපමණ ආසන්නද යන්න)
                let riskStatus = "Safe";
                let riskColor = "text-emerald-400 bg-emerald-500/10";

                if (asset.liquidationPrice && asset.liquidationPrice > 0) {
                  // සජීවී මිල සහ Liq මිල අතර පරතරය ප්‍රතිශතයක් ලෙස
                  const difference = Math.abs((livePrice - asset.liquidationPrice) / livePrice) * 100;

                  if (difference <= 5) {
                    riskStatus = "CRITICAL ⚠️"; // 5% කට වඩා ළඟින් නම්
                    riskColor = "text-rose-400 bg-rose-500/20 font-bold animate-pulse";
                  } else if (difference <= 15) {
                    riskStatus = "Warning"; // 15% කට වඩා ළඟින් නම්
                    riskColor = "text-yellow-400 bg-yellow-500/10";
                  }
                } else {
                  riskStatus = "Spot (No Risk)";
                  riskColor = "text-slate-400 bg-slate-800/50";
                }

                return (
                    <tr key={asset.id} className="hover:bg-slate-800/50 transition-colors duration-200">
                      <td className="p-5 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-lg border border-slate-700 text-blue-400">
                          {asset.symbol.charAt(0)}
                        </div>
                        <div className="font-bold text-lg">{asset.symbol}</div>
                      </td>
                      <td className="p-5 font-medium">{asset.quantity}</td>
                      <td className="p-5 text-slate-300">${asset.buyPrice.toFixed(2)}</td>
                      <td className="p-5 font-bold text-rose-400">
                        {asset.liquidationPrice > 0 ? `$${asset.liquidationPrice.toFixed(2)}` : 'N/A'}
                      </td>
                      <td className="p-5 font-bold text-white">${livePrice.toFixed(2)}</td>

                      {/* Risk Level පෙන්වන කොටුව */}
                      <td className="p-5">
                      <span className={`px-3 py-1 rounded-lg text-xs tracking-wide ${riskColor}`}>
                        {riskStatus}
                      </span>
                      </td>

                      <td className={`p-5 font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isProfit ? '+' : ''}${profitOrLoss.toFixed(2)}
                      </td>
                      <td className="p-5 text-center">
                        <button onClick={() => handleDelete(asset.id, asset.symbol)} className="bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors duration-200">
                          Del
                        </button>
                      </td>
                    </tr>
                );
              })}
              </tbody>
            </table>

            {assets.length === 0 && (
                <div className="p-10 text-center text-slate-500 font-medium">No assets found.</div>
            )}
          </div>

        </div>
      </div>
  )
}

export default App