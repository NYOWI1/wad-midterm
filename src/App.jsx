import { useMemo, useState } from "react";
import { products, categories } from "./assets/data";
import {
  Cable,
  Headphones,
  Laptop,
  Mouse,
  Settings,
  TabletSmartphone,
} from "lucide-react";

function CategoryIcon(category) {
  switch (category?.icon) {
    case "mouse":
      return <Mouse className="h-5 w-5 text-blue-600" />;
    case "laptop":
      return <Laptop className="h-5 w-5 text-blue-600" />;
    case "tablet-smartphone":
      return <TabletSmartphone className="h-5 w-5 text-blue-600" />;
    case "headphones":
      return <Headphones className="h-5 w-5 text-blue-600" />;
    case "cable":
      return <Cable className="h-5 w-5 text-blue-600" />;
    default:
      return <Settings className="h-5 w-5 text-blue-600" />;
  }
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [amount, setAmount] = useState("");
  const [catalog, setCatalog] = useState(products);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [error, setError] = useState("");

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") {
      return catalog;
    }

    return catalog.filter(
      (product) => product.category === Number(selectedCategory),
    );
  }, [catalog, selectedCategory]);

  const selectedProduct = catalog.find(
    (product) => product.id === Number(selectedProductId),
  );

  const grandTotal = purchasedItems.reduce(
    (sum, item) => sum + getDiscountedPrice(item) * item.amount,
    0,
  );

  function getCategoryById(categoryId) {
    return categories.find((category) => category.id === categoryId);
  }

  function getDiscountedPrice(product) {
    return product.sellPrice * (1 - product.discount / 100);
  }

  function formatCurrency(value) {
    return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
  }

  function handleCategoryChange(event) {
    setSelectedCategory(event.target.value);
    setSelectedProductId("");
    setAmount("");
    setError("");
  }

  function handleProductChange(event) {
    setSelectedProductId(event.target.value);
    setAmount("");
    setError("");
  }

  function handleAddItem() {
    const purchaseAmount = Number(amount);

    if (!selectedProduct) {
      setError("Please select a product.");
      return;
    }

    if (!Number.isInteger(purchaseAmount) || purchaseAmount <= 0) {
      setError("Please enter a valid purchase amount.");
      return;
    }

    if (purchaseAmount > selectedProduct.inventory) {
      setError(`Not enough item, only ${selectedProduct.inventory} left`);
      return;
    }

    setPurchasedItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === selectedProduct.id,
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === selectedProduct.id
            ? { ...item, amount: item.amount + purchaseAmount }
            : item,
        );
      }

      return [...currentItems, { ...selectedProduct, amount: purchaseAmount }];
    });

    setCatalog((currentCatalog) =>
      currentCatalog.map((product) =>
        product.id === selectedProduct.id
          ? { ...product, inventory: product.inventory - purchaseAmount }
          : product,
      ),
    );

    setAmount("");
    setError("");
  }

  return (
    <main className="min-h-screen bg-white px-5 py-14 text-zinc-950">
      <section className="mx-auto max-w-[1100px] rounded-xl border border-zinc-200 bg-white px-6 py-10 shadow-lg">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleAddItem();
          }}
        >
          <div className="mb-6 grid gap-6">
            <div className="grid items-center gap-4 md:grid-cols-[150px_265px_120px_90px_120px_1fr]">
              <label className="text-base font-medium" htmlFor="category">
                Select Category:
              </label>
              <select
                className="h-10 w-full rounded border border-zinc-700 bg-white px-2 text-base outline-none focus:border-blue-600"
                id="category"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="all">All</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid items-center gap-4 md:grid-cols-[150px_265px_120px_90px_120px_1fr]">
              <label className="text-base font-medium" htmlFor="product">
                Select Product:
              </label>
              <select
                className="h-10 w-full rounded border border-zinc-700 bg-white px-2 text-base outline-none focus:border-blue-600"
                id="product"
                value={selectedProductId}
                onChange={handleProductChange}
              >
                <option value="">Select product</option>
                {filteredProducts.map((product) => (
                  <option
                    key={product.id}
                    value={product.id}
                    disabled={product.inventory === 0}
                  >
                    {product.title}
                  </option>
                ))}
              </select>

              <label
                className="text-base font-medium md:text-right"
                htmlFor="amount"
              >
                Amount:
              </label>
              <input
                className="h-10 w-full rounded border border-zinc-700 px-2 text-base outline-none focus:border-blue-600 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400"
                disabled={!selectedProduct}
                id="amount"
                min="1"
                type="number"
                value={amount}
                onChange={(event) => {
                  setAmount(event.target.value);
                  setError("");
                }}
                placeholder="0"
              />

              <button
                className="h-11 rounded bg-blue-500 px-4 text-base font-bold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500"
                disabled={!selectedProduct || Number(amount) <= 0}
                type="submit"
              >
                Add Item
              </button>

              {error && <p className="text-base text-red-500">{error}</p>}
            </div>
          </div>
        </form>

        <div className="border-t border-zinc-300 pt-4">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-base">
              <thead>
                <tr className="bg-zinc-100">
                  <th className="border border-zinc-900 px-2 py-2 font-bold">
                    #
                  </th>
                  <th className="border border-zinc-900 px-2 py-2 font-bold">
                    ID
                  </th>
                  <th className="border border-zinc-900 px-2 py-2 font-bold">
                    Item
                  </th>
                  <th className="border border-zinc-900 px-2 py-2 font-bold">
                    Category
                  </th>
                  <th className="border border-zinc-900 px-2 py-2 font-bold">
                    Price
                  </th>
                  <th className="border border-zinc-900 px-2 py-2 font-bold">
                    Discount
                  </th>
                  <th className="border border-zinc-900 px-2 py-2 font-bold">
                    Amount
                  </th>
                  <th className="border border-zinc-900 px-2 py-2 font-bold">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {purchasedItems.map((item, index) => {
                  const category = getCategoryById(item.category);
                  const subtotal = getDiscountedPrice(item) * item.amount;

                  return (
                    <tr key={item.id}>
                      <td className="border border-zinc-900 px-2 py-2">
                        {index}
                      </td>
                      <td className="border border-zinc-900 px-2 py-2">
                        {item.id}
                      </td>
                      <td className="border border-zinc-900 px-2 py-2">
                        {item.title}
                      </td>
                      <td className="border border-zinc-900 px-2 py-2">
                        {CategoryIcon(category)}
                      </td>
                      <td className="border border-zinc-900 px-2 py-2">
                        {item.sellPrice}
                      </td>
                      <td className="border border-zinc-900 px-2 py-2">
                        {item.discount}%
                      </td>
                      <td className="border border-zinc-900 px-2 py-2">
                        {item.amount}
                      </td>
                      <td className="border border-zinc-900 px-2 py-2">
                        {formatCurrency(subtotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-5 border-t border-zinc-300 pt-5 text-base">
            Total: {formatCurrency(grandTotal)}
          </div>
        </div>
      </section>
    </main>
  );
}
