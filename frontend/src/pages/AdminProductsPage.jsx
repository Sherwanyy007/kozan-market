import { useEffect, useMemo, useState } from "react";
import axios from "axios";

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [category, setCategory] = useState("");

  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortOption, setSortOption] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [previewProduct, setPreviewProduct] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 6;

  useEffect(() => {
    document.title = "Admin Products | Kozan Market";
    fetchProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, brandFilter, categoryFilter, sortOption]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data || []);
    } catch (err) {
      console.log(err);
      alert("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setDescription("");
    setBrand("");
    setCategory("");
    setCountInStock("");
    setFile(null);
    setEditingId(null);
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setName(product.name || "");
    setPrice(product.price ?? "");
    setDescription(product.description || "");
    setBrand(product.brand || "");
    setCountInStock(product.countInStock ?? "");
    setCategory(product.category || "");
    setFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uploadImageIfNeeded = async () => {
    if (!file) return "";

    const formData = new FormData();
    formData.append("image", file);

    const uploadRes = await axios.post(
      "http://localhost:5000/api/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return uploadRes.data.imageUrl;
  };

  const updateProduct = async () => {
    if (!name || !price) {
      alert("Product name and price are required");
      return;
    }

    try {
      setSaving(true);

      let updatedImageUrl = "";
      if (file) {
        updatedImageUrl = await uploadImageIfNeeded();
      }

      const currentProduct = products.find((p) => p._id === editingId);

      await axios.put(`http://localhost:5000/api/products/${editingId}`, {
        name,
        price: Number(price),
        imageUrl: updatedImageUrl || currentProduct?.imageUrl || "",
        description,
        brand,
        category,
        countInStock: Number(countInStock),
      });

      await fetchProducts();
      resetForm();
      alert("Product updated successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this product?");
    if (!ok) return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setProducts((prev) => prev.filter((product) => product._id !== id));

      if (editingId === id) resetForm();
      if (previewProduct?._id === id) setPreviewProduct(null);
    } catch (error) {
      console.log(error);
      alert("Failed to delete product");
    }
  };

  const addProduct = async () => {
    if (!name || !price) {
      alert("Product name and price are required");
      return;
    }

    try {
      setSaving(true);

      let imageUrl = "";
      if (file) {
        imageUrl = await uploadImageIfNeeded();
      }

      const res = await axios.post("http://localhost:5000/api/products", {
        name,
        price: Number(price),
        imageUrl,
        description,
        brand,
        category,
        countInStock: Number(countInStock),
      });

      setProducts((prev) => [res.data, ...prev]);
      resetForm();
      setCurrentPage(1);
      alert("Product added successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to add product");
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const q = search.toLowerCase();
      const matchSearch =
        (product.name || "").toLowerCase().includes(q) ||
        (product.brand || "").toLowerCase().includes(q) ||
        (product.category || "").toLowerCase().includes(q);

      const matchBrand =
        brandFilter === "" || (product.brand || "") === brandFilter;

      const matchCategory =
        categoryFilter === "" || (product.category || "") === categoryFilter;

      return matchSearch && matchBrand && matchCategory;
    });
  }, [products, search, brandFilter, categoryFilter]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (sortOption === "price-low-high") return (a.price || 0) - (b.price || 0);
      if (sortOption === "price-high-low") return (b.price || 0) - (a.price || 0);
      if (sortOption === "name-a-z") return (a.name || "").localeCompare(b.name || "");
      if (sortOption === "name-z-a") return (b.name || "").localeCompare(a.name || "");
      if (sortOption === "stock-low-high") return (a.countInStock || 0) - (b.countInStock || 0);
      if (sortOption === "stock-high-low") return (b.countInStock || 0) - (a.countInStock || 0);
      return 0;
    });
  }, [filteredProducts, sortOption]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE)
  );

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return sortedProducts.slice(startIndex, endIndex);
  }, [sortedProducts, currentPage]);

  const brands = [...new Set(products.map((product) => product.brand).filter(Boolean))];
  const categories = [...new Set(products.map((product) => product.category).filter(Boolean))];

  const getImageSrc = (imageUrl) => {
    if (!imageUrl) return "";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `http://localhost:5000${imageUrl}`;
  };

  const getStockBadge = (stock) => {
    const value = Number(stock || 0);

    if (value <= 0) {
      return { text: "Out of Stock", bg: "#fee2e2", color: "#991b1b" };
    }

    if (value <= 5) {
      return { text: "Low Stock", bg: "#fef3c7", color: "#92400e" };
    }

    return { text: "In Stock", bg: "#dcfce7", color: "#166534" };
  };

  const visiblePages = useMemo(() => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }, [currentPage, totalPages]);

  if (loading) {
    return (
      <div style={pageStyle}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={{ marginBottom: 22 }}>
          <h1 style={titleStyle}>Admin Products</h1>
          <p style={subTitleStyle}>
            Add, edit, search, filter, and manage your market products
          </p>
        </div>

        <div style={topGridStyle}>
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>
              {editingId ? "Update Product" : "Add New Product"}
            </h2>

            <div style={formGridStyle}>
              <input
                style={inputStyle}
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                style={inputStyle}
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <input
                style={inputStyle}
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
              />

              <input
                style={inputStyle}
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <input
                style={inputStyle}
                placeholder="Brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />

              <input
                style={inputStyle}
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />

              <input
                style={inputStyle}
                placeholder="Count In Stock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </div>

            {file && (
              <div style={previewBoxStyle}>
                <p style={previewTextStyle}>Selected image: {file.name}</p>
              </div>
            )}

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
              <button
                style={primaryButtonStyle}
                onClick={editingId ? updateProduct : addProduct}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Product"
                  : "Add Product"}
              </button>

              {editingId && (
                <button style={secondaryButtonStyle} onClick={resetForm}>
                  Cancel Edit
                </button>
              )}
            </div>
          </div>

          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>Search & Filters</h2>

            <div style={formGridStyle}>
              <input
                style={inputStyle}
                placeholder="Search product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                style={inputStyle}
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
              >
                <option value="">All Brands</option>
                {brands.map((b, i) => (
                  <option key={i} value={b}>
                    {b}
                  </option>
                ))}
              </select>

              <select
                style={inputStyle}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat, i) => (
                  <option key={i} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <select
                style={inputStyle}
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="">Sort By</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name-a-z">Name: A to Z</option>
                <option value="name-z-a">Name: Z to A</option>
                <option value="stock-low-high">Stock: Low to High</option>
                <option value="stock-high-low">Stock: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        <div style={summaryRowStyle}>
          <div style={summaryBoxStyle}>
            <p style={summaryLabelStyle}>Total Products</p>
            <h3 style={summaryValueStyle}>{products.length}</h3>
          </div>

          <div style={summaryBoxStyle}>
            <p style={summaryLabelStyle}>Filtered Results</p>
            <h3 style={summaryValueStyle}>{sortedProducts.length}</h3>
          </div>

          <div style={summaryBoxStyle}>
            <p style={summaryLabelStyle}>Current Page</p>
            <h3 style={summaryValueStyle}>
              {currentPage} / {totalPages}
            </h3>
          </div>
        </div>

        {sortedProducts.length === 0 ? (
          <div style={emptyCardStyle}>No matching products found.</div>
        ) : (
          <>
            <div style={productsGridStyle}>
              {paginatedProducts.map((product) => {
                const stockBadge = getStockBadge(product.countInStock);

                return (
                  <div key={product._id} style={productCardStyle}>
                    <div
                      style={imageWrapStyle}
                      onClick={() => setPreviewProduct(product)}
                    >
                      {product.imageUrl ? (
                        <img
                          src={getImageSrc(product.imageUrl)}
                          alt={product.name}
                          style={imageStyle}
                        />
                      ) : (
                        <div style={imagePlaceholderStyle}>No Image</div>
                      )}
                    </div>

                    <div style={{ padding: 18 }}>
                      <div style={topBadgeWrapStyle}>
                        <span
                          style={{
                            ...stockBadgeStyle,
                            background: stockBadge.bg,
                            color: stockBadge.color,
                          }}
                        >
                          {stockBadge.text}
                        </span>
                      </div>

                      <h3 style={productTitleStyle}>{product.name}</h3>
                      <p style={priceStyle}>{product.price} IQD</p>

                      <div style={badgeRowStyle}>
                        <span style={categoryBadgeStyle}>
                          {product.category || "No Category"}
                        </span>

                        <span style={brandBadgeStyle}>
                          {product.brand || "No Brand"}
                        </span>
                      </div>

                      <p style={metaTextStyle}>
                        {product.description || "No description"}
                      </p>

                      <p style={stockTextStyle}>
                        In Stock: {product.countInStock ?? 0}
                      </p>

                      <div style={actionsStyle}>
                        <button
                          style={viewButtonStyle}
                          onClick={() => setPreviewProduct(product)}
                        >
                          Preview
                        </button>

                        <button
                          style={editButtonStyle}
                          onClick={() => startEdit(product)}
                        >
                          Edit
                        </button>

                        <button
                          style={deleteButtonStyle}
                          onClick={() => deleteProduct(product._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={paginationWrapStyle}>
              <button
                style={{
                  ...paginationButtonStyle,
                  opacity: currentPage === 1 ? 0.5 : 1,
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <div style={pageNumbersWrapStyle}>
                {visiblePages.map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      ...pageNumberStyle,
                      background: currentPage === page ? "#2563eb" : "white",
                      color: currentPage === page ? "white" : "#0f172a",
                      border:
                        currentPage === page
                          ? "1px solid #2563eb"
                          : "1px solid #dbe2ea",
                    }}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                style={{
                  ...paginationButtonStyle,
                  opacity: currentPage === totalPages ? 0.5 : 1,
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                }}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}

        {previewProduct && (
          <div style={modalOverlayStyle} onClick={() => setPreviewProduct(null)}>
            <div
              style={modalCardStyle}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={modalHeaderStyle}>
                <h2 style={modalTitleStyle}>Product Preview</h2>
                <button
                  style={closeButtonStyle}
                  onClick={() => setPreviewProduct(null)}
                >
                  ✕
                </button>
              </div>

              <div style={modalContentStyle}>
                <div style={modalImageWrapStyle}>
                  {previewProduct.imageUrl ? (
                    <img
                      src={getImageSrc(previewProduct.imageUrl)}
                      alt={previewProduct.name}
                      style={modalImageStyle}
                    />
                  ) : (
                    <div style={imagePlaceholderStyle}>No Image</div>
                  )}
                </div>

                <div>
                  <h3 style={modalProductNameStyle}>{previewProduct.name}</h3>
                  <p style={modalPriceStyle}>{previewProduct.price} IQD</p>

                  <div style={modalBadgesWrapStyle}>
                    <span style={categoryBadgeStyle}>
                      {previewProduct.category || "No Category"}
                    </span>
                    <span style={brandBadgeStyle}>
                      {previewProduct.brand || "No Brand"}
                    </span>
                  </div>

                  <div style={modalInfoGridStyle}>
                    <div style={infoCardStyle}>
                      <p style={infoLabelStyle}>Stock</p>
                      <strong>{previewProduct.countInStock ?? 0}</strong>
                    </div>

                    <div style={infoCardStyle}>
                      <p style={infoLabelStyle}>Status</p>
                      <strong>{getStockBadge(previewProduct.countInStock).text}</strong>
                    </div>
                  </div>

                  <div style={modalDescriptionBoxStyle}>
                    <p style={infoLabelStyle}>Description</p>
                    <p style={modalDescriptionTextStyle}>
                      {previewProduct.description || "No description"}
                    </p>
                  </div>

                  <div style={modalActionsStyle}>
                    <button
                      style={editButtonStyle}
                      onClick={() => {
                        setPreviewProduct(null);
                        startEdit(previewProduct);
                      }}
                    >
                      Edit Product
                    </button>

                    <button
                      style={secondaryButtonStyle}
                      onClick={() => setPreviewProduct(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#f8fafc",
  padding: "28px",
};

const containerStyle = {
  maxWidth: "1250px",
  margin: "0 auto",
};

const titleStyle = {
  margin: 0,
  fontSize: "44px",
  fontWeight: "800",
  color: "#0f172a",
};

const subTitleStyle = {
  marginTop: 8,
  color: "#64748b",
  fontSize: "16px",
};

const topGridStyle = {
  display: "grid",
  gridTemplateColumns: "1.2fr 1fr",
  gap: "18px",
  marginBottom: "18px",
};

const cardStyle = {
  background: "white",
  borderRadius: "22px",
  padding: "22px",
  boxShadow: "0 10px 25px rgba(15, 23, 42, 0.06)",
  border: "1px solid #eef2f7",
};

const emptyCardStyle = {
  background: "white",
  borderRadius: "22px",
  padding: "30px",
  boxShadow: "0 10px 25px rgba(15, 23, 42, 0.06)",
  color: "#64748b",
  textAlign: "center",
};

const sectionTitleStyle = {
  margin: "0 0 16px 0",
  color: "#0f172a",
  fontSize: "24px",
  fontWeight: "800",
};

const formGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "12px",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "14px",
  border: "1px solid #dbe2ea",
  outline: "none",
  background: "white",
  fontSize: "15px",
  boxSizing: "border-box",
};

const previewBoxStyle = {
  marginTop: "14px",
  padding: "12px 14px",
  background: "#eff6ff",
  borderRadius: "14px",
  border: "1px solid #dbeafe",
};

const previewTextStyle = {
  margin: 0,
  color: "#1d4ed8",
  fontWeight: "700",
  fontSize: "14px",
};

const primaryButtonStyle = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "none",
  background: "#2563eb",
  color: "white",
  fontWeight: "800",
  cursor: "pointer",
};

const secondaryButtonStyle = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "none",
  background: "#e2e8f0",
  color: "#0f172a",
  fontWeight: "800",
  cursor: "pointer",
};

const summaryRowStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "16px",
  marginBottom: "18px",
};

const summaryBoxStyle = {
  background: "white",
  borderRadius: "20px",
  padding: "20px",
  boxShadow: "0 10px 25px rgba(15, 23, 42, 0.06)",
  border: "1px solid #eef2f7",
};

const summaryLabelStyle = {
  margin: 0,
  color: "#64748b",
  fontSize: "14px",
};

const summaryValueStyle = {
  margin: "8px 0 0 0",
  color: "#0f172a",
  fontSize: "30px",
  fontWeight: "800",
};

const productsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "18px",
};

const productCardStyle = {
  background: "white",
  borderRadius: "22px",
  overflow: "hidden",
  boxShadow: "0 10px 25px rgba(15, 23, 42, 0.06)",
  border: "1px solid #eef2f7",
};

const imageWrapStyle = {
  width: "100%",
  height: "220px",
  background: "#f8fafc",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  cursor: "pointer",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const imagePlaceholderStyle = {
  color: "#94a3b8",
  fontWeight: "700",
};

const topBadgeWrapStyle = {
  display: "flex",
  justifyContent: "flex-start",
  marginBottom: "10px",
};

const stockBadgeStyle = {
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "800",
};

const productTitleStyle = {
  margin: "0 0 10px 0",
  fontSize: "24px",
  color: "#0f172a",
  fontWeight: "800",
};

const priceStyle = {
  margin: "0 0 12px 0",
  color: "#16a34a",
  fontWeight: "800",
  fontSize: "18px",
};

const badgeRowStyle = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  marginBottom: "12px",
};

const categoryBadgeStyle = {
  background: "#e0e7ff",
  color: "#3730a3",
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "800",
};

const brandBadgeStyle = {
  background: "#fef3c7",
  color: "#92400e",
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "800",
};

const metaTextStyle = {
  margin: "0 0 10px 0",
  color: "#64748b",
  fontSize: "14px",
  minHeight: "40px",
};

const stockTextStyle = {
  margin: "0 0 14px 0",
  color: "#0f172a",
  fontWeight: "700",
};

const actionsStyle = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
};

const viewButtonStyle = {
  flex: 1,
  padding: "11px 14px",
  borderRadius: "12px",
  border: "none",
  background: "#0f766e",
  color: "white",
  fontWeight: "800",
  cursor: "pointer",
};

const editButtonStyle = {
  flex: 1,
  padding: "11px 14px",
  borderRadius: "12px",
  border: "none",
  background: "#2563eb",
  color: "white",
  fontWeight: "800",
  cursor: "pointer",
};

const deleteButtonStyle = {
  flex: 1,
  padding: "11px 14px",
  borderRadius: "12px",
  border: "none",
  background: "#ef4444",
  color: "white",
  fontWeight: "800",
  cursor: "pointer",
};

const paginationWrapStyle = {
  marginTop: "22px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
  flexWrap: "wrap",
};

const paginationButtonStyle = {
  padding: "10px 16px",
  borderRadius: "12px",
  border: "none",
  background: "#0f172a",
  color: "white",
  fontWeight: "800",
};

const pageNumbersWrapStyle = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
};

const pageNumberStyle = {
  minWidth: "42px",
  height: "42px",
  borderRadius: "12px",
  fontWeight: "800",
  cursor: "pointer",
};

const modalOverlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, 0.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  zIndex: 9999,
};

const modalCardStyle = {
  width: "100%",
  maxWidth: "950px",
  maxHeight: "90vh",
  overflowY: "auto",
  background: "white",
  borderRadius: "24px",
  boxShadow: "0 25px 60px rgba(15, 23, 42, 0.25)",
};

const modalHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 22px",
  borderBottom: "1px solid #eef2f7",
};

const modalTitleStyle = {
  margin: 0,
  color: "#0f172a",
  fontSize: "28px",
  fontWeight: "800",
};

const closeButtonStyle = {
  width: "42px",
  height: "42px",
  borderRadius: "12px",
  border: "none",
  background: "#e2e8f0",
  color: "#0f172a",
  fontWeight: "800",
  cursor: "pointer",
  fontSize: "18px",
};

const modalContentStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "22px",
  padding: "22px",
};

const modalImageWrapStyle = {
  width: "100%",
  minHeight: "380px",
  background: "#f8fafc",
  borderRadius: "20px",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalImageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const modalProductNameStyle = {
  margin: "0 0 10px 0",
  fontSize: "34px",
  color: "#0f172a",
  fontWeight: "800",
};

const modalPriceStyle = {
  margin: "0 0 14px 0",
  color: "#16a34a",
  fontWeight: "800",
  fontSize: "24px",
};

const modalBadgesWrapStyle = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  marginBottom: "16px",
};

const modalInfoGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "12px",
  marginBottom: "16px",
};

const infoCardStyle = {
  background: "#f8fafc",
  borderRadius: "14px",
  padding: "14px",
};

const infoLabelStyle = {
  margin: "0 0 6px 0",
  color: "#64748b",
  fontSize: "13px",
};

const modalDescriptionBoxStyle = {
  background: "#f8fafc",
  borderRadius: "16px",
  padding: "16px",
  marginBottom: "16px",
};

const modalDescriptionTextStyle = {
  margin: 0,
  color: "#0f172a",
  lineHeight: 1.7,
};

const modalActionsStyle = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

export default AdminProductsPage;