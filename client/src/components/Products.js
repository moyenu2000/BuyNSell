import axios from "axios";
import React, { useEffect, useState } from "react";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [rootCategories, setRootCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedRootCategory, setSelectedRootCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [orderByPrice, setOrderByPrice] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');

    useEffect(() => {
        async function fetchInitialData() {
            const rootCatResponse = await axios.get("http://localhost:8000/rootCategories");
            setRootCategories(rootCatResponse.data);
            fetchAllProducts();
        }

        fetchInitialData();
    }, []);

    async function fetchAllProducts() {
        const response = await axios.get("http://localhost:8000/products");
        setProducts(response.data);
    }

    useEffect(() => {
        async function fetchProductsByFilters() {
            const params = {
                rootCategoryID: selectedRootCategory || undefined,
                subCategoryID: selectedSubCategory || undefined,
                minPrice: priceRange.min || undefined,
                maxPrice: priceRange.max || undefined,
                orderByPrice: orderByPrice || undefined,
                brand: selectedBrand || undefined
            };

            const response = await axios.post(`http://localhost:8000/filterProducts`, params);
            setProducts(response.data);
        }

        if (selectedRootCategory) {
            async function fetchSubCategories() {
                const subCatResponse = await axios.get(`http://localhost:8000/subCategories?rootCategoryID=${selectedRootCategory}`);
                setSubCategories(subCatResponse.data);
            }
            fetchSubCategories();
        } else {
            setSubCategories([]);
        }

        fetchProductsByFilters();

    }, [selectedRootCategory, selectedSubCategory, priceRange, orderByPrice, selectedBrand]);



  const toggleDescription = (e) => {
    const desc = e.target.previousSibling;
    if (desc.style.overflow === "hidden") {
      desc.style.overflow = "visible";
      desc.style.maxHeight = "none";
      e.target.innerText = "See less";
    } else {
      desc.style.overflow = "hidden";
      desc.style.maxHeight = "60px";
      e.target.innerText = "See more";
    }
  };

  return (
    <div className="container mt-4">
      <div className="mb-3">
        <select className="form-select" value={selectedRootCategory} onChange={(e) =>{ setSelectedRootCategory(e.target.value); setSelectedSubCategory(""); }}>
          <option value="">Select a root category</option>
          {rootCategories.map((category) => (
            <option key={category.rootCategoryID} value={category.rootCategoryID}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {selectedRootCategory && (
        <div className="mb-3">
          <select className="form-select" value={selectedSubCategory} onChange={(e) => setSelectedSubCategory(e.target.value)}>
            <option value="">Select a subcategory</option>
            {subCategories.map((sub) => (
              <option key={sub.subCategoryID} value={sub.subCategoryID}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-3">
        <label>Price Range:</label>
        <div className="d-flex">
          <input type="number" placeholder="Min" value={priceRange.min} onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))} />
          -
          <input type="number" placeholder="Max" value={priceRange.max} onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))} />
        </div>
      </div>

      <div className="mb-3">
        <select className="form-select" value={orderByPrice} onChange={(e) => setOrderByPrice(e.target.value)}>
          <option value="">Order by Price</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div className="mb-3">
        <input type="text" placeholder="Brand" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} />
      </div>

      <div className="row">
        {products.map((product) => (
          <div key={product.adID} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">{product.productName}</h3>
                <p className="card-text">
                  <strong>Brand:</strong> {product.brand}
                </p>
                <p className="card-text description-truncate">
                  <strong>Description:</strong> {product.descriptions}
                </p>
                <span className="text-primary" onClick={toggleDescription} style={{ cursor: 'pointer' }}>
                  See more
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;

