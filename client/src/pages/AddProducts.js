import axios from "axios";
import React, { useEffect, useState } from "react";

function AddProduct() {
  const [rootCategories, setRootCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedRootCategory, setSelectedRootCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [productImage, setProductImage] = useState(null);
  const [productDescription, setProductDescription] = useState("");
  const [sellerID, setSellerID] = useState("");
  const [productID, setProductID] = useState("");
  const [adID, setAdID] = useState("");
  const [fileNameWithPath, setFileNameWithPath] = useState(null);
  const [price, setPrice] = useState(0);
 const [productAddingTime, setProductAddingTime] = useState(null);
 const [fileName, setFileName] = useState(""); 

  useEffect(() => {
    async function fetchRootCategories() {
      try {
        const response = await axios.get("http://localhost:8000/rootCategories");
        setRootCategories(response.data);
      } catch (err) {
        console.error("Error fetching root categories:", err);
      }
    }

    fetchRootCategories();
  }, []);

  useEffect(() => {
    if (selectedRootCategory) {
      async function fetchSubCategories() {
        try {
          const response = await axios.get(
            `http://localhost:8000/subCategories?rootCategoryID=${selectedRootCategory}`
          );
          setSubCategories(response.data);
        } catch (err) {
          console.error("Error fetching subcategories:", err);
        }
      }

      fetchSubCategories();
    }
  }, [selectedRootCategory]);

  const handleFileChange = (e) => {
    setProductImage(e.target.files[0]);
    if (e.target.files[0]) {
      setFileName(e.target.files[0].name);  // Update file name when the file is selected
    }
  };

  const handleSubmit = async () => {
    try {
      console.log(fileName)

      const productData = {
        image: fileName, 
        description: productDescription,
        rootCategory: selectedRootCategory,
        subCategory: selectedSubCategory,
        sellerID,
        productID,
        adID,
        price,
        productAddingTime
      };
      console.log(productData)
      
      const response = await axios.post("http://localhost:8000/addProduct", productData);
      
      if (response.status === 200) {
        console.log("Product Added Successfully!");
      }
    } catch (error) {
      console.error("Error while adding product:", error);
    }
  };

  return (
    <div className="add-product-container">
      <h2>Add Product</h2>
      <select onChange={(e) => setSelectedRootCategory(e.target.value)}>
        <option value="">Select a root category</option>
        {rootCategories.map((category) => (
          <option key={category.rootCategoryID} value={category.rootCategoryID}>
            {category.name}
          </option>
        ))}
      </select>

      {selectedRootCategory && (
        <select onChange={(e) => setSelectedSubCategory(e.target.value)}>
          <option value="">Select a subcategory</option>
          {subCategories.map((sub) => (
            <option key={sub.subCategoryID} value={sub.subCategoryID}>
              {sub.name}
            </option>
          ))}
        </select>
      )}


      <input 
  type="file" 
  onChange={(e) => {
    setProductImage(e.target.files[0]);
    setFileNameWithPath(e.target.files[0] ? e.target.files[0].webkitRelativePath : null);
  }}
/>

      <textarea placeholder="Enter product description..." onChange={(e) => setProductDescription(e.target.value)}></textarea>
      <input type="text" placeholder="Seller ID" onChange={(e) => setSellerID(e.target.value)} />
      <input type="text" placeholder="Product ID" onChange={(e) => setProductID(e.target.value)} />
      <input type="text" placeholder="Ad ID" onChange={(e) => setAdID(e.target.value)} />
      <input type="number" placeholder="Price" onChange={(e) => setPrice(e.target.value)} />
      <input type="datetime-local" onChange={(e) => setProductAddingTime(e.target.value)} />
      <button onClick={handleSubmit}>Add Product</button>
    </div>
  );
}

export default AddProduct;

