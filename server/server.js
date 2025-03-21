import bodyParser from "body-parser";
import cors from "cors";
import crypto from "crypto";
import express from "express";
import connectToDatabase from "./connectToDatabase.js"; 
import runQuery, { extractData } from "./runQuery.js";
import { Server } from "http";
import { Server as SocketServer } from "socket.io"; 
// import AddProduct from "../client/src/pages/AddProducts.js";

const port = 8000;
const app = express();

(async () => {
  try {
    await connectToDatabase();
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
})();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/", async (req, res) => {
  try {
    let result = await runQuery("select * from employees", []);
    const columnsToExtract = ["FIRST_NAME", "SALARY"];
    const output = extractData(result, columnsToExtract);
    //console.log(extractData(result,columnsToExtract));

    res
      .status(200)
      .json({ data: result || [], message: "Welcome to the API!" });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Error fetching employees." });
  }
});

app.get("/locations", async (req, res) => {
  try {
    const query = `
      SELECT
        u.locationID AS ID, 
        d.divisionName AS division,
        di.districtName AS district,
        u.thanaName AS upazilla
      FROM
        Division d
      JOIN
        District di ON d.divisionID = di.divisionID
      JOIN
        Upazilla u ON di.districtID = u.districtID
    `;
    const queryData = await runQuery(query, []);

    res.send(
      extractData(queryData, ["ID", "DIVISION", "DISTRICT", "UPAZILLA"])
    );
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ error: "Error fetching locations" });
  }
});



app.post("/signup", async (req, res) => {
  //console.log(req);
  const { firstname, lastname, email, password, locationID } = req.body;
  const passwordHash = crypto.createHash("sha1").update(password).digest("hex");
  const queryToExtractUserID = `SELECT userID FROM USERS ORDER BY userID DESC`;
  const result2 = await runQuery(queryToExtractUserID, []);

  //console.log(result2);

  const newuId = result2.rows.length + 1;
  const insertQuery = `INSERT INTO USERS(userID,email,passwords,firstname,lastname,locationID) VALUES(:newuId,:email,:passwordHash,:firstname,:lastname,:locationID)`;
  console.log("this is a ID : ", newuId);

  const bindParams = {
    newuId: newuId,
    passwordHash: passwordHash,
    email: email,
    firstname: firstname,
    lastname: lastname,
    locationID: locationID,
  };

  const result3 = await runQuery(insertQuery, bindParams);
  res.send(result3);
});



app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email,password)

  const passwordHash = crypto.createHash("sha1").update(password).digest("hex");
  //console.log(passwordHash)

  const query =
    "SELECT * FROM users WHERE email = :email AND passwords = :password";

  const bindParams = {
    email: email,
    password: passwordHash,
  };

  try {
    const result = await runQuery(query, bindParams);
    //console.log(result);
    const columnsToExtract = [
      "userID",
      "email",
      "firstName",
      "lastName",
      "locationID",
      "reported",
    ];
    const output = extractData(result, columnsToExtract);
    //console.log(extractData(result,columnsToExtract));

    if (result && result.rows.length > 0) {
      // Login successful
      res.send(output);
    } else {
      // Invalid credentials
      res.status(401).send("Invalid username or password.");
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});



app.get("/categories", (req, res) => {
  const categories = ["Electronics", "Clothing", "Groceries"];
  res.json(categories);
});



app.post("/filterByCategory", async (req, res) => {
  try {
    const { rootCategoryID } = req.body;

    const query = `
          SELECT 
              s.adID, 
              s.sellerID, 
              s.productID,
              s.price,
              s.productAddingTime,
              s.picture,
              s.productAddingTime,
              s.descriptions,
              p.productName,
              p.brand,
              sc.name AS subCategoryName,
              rc.name AS rootCategoryName,
              u.firstName || ' ' || u.lastName AS sellerName
          FROM 
              Sells s
          JOIN 
              Product p ON s.productID = p.productID
          JOIN 
              subCategory sc ON p.subCategoryID = sc.subCategoryID
          JOIN 
              RootCategory rc ON sc.rootCategoryID = rc.rootCategoryID
          JOIN
              Users u ON s.sellerID = u.userID
          WHERE 
              rc.rootCategoryID = :rootCategoryID
      `;
    const bindParams = {
      rootCategoryID: rootCategoryID,
    };

    const queryData = await runQuery(query, bindParams);
    const output = extractData(queryData, [
      "adID",
      "productAddingTime",
      "productID",
      "sellerName",
      "productName",
      "picture",
      "descriptions",
      "brand",
      "subCategoryName",
      "rootCategoryName",
      "price",
    ]);

    res.json(output);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Error fetching products" });
  }
});



app.post("/filterProducts", async (req, res) => {
  try {
    const {
      rootCategoryID,
      subCategoryID,
      minPrice,
      maxPrice,
      orderByPrice,
      brand
    } = req.body;

    // Construct your SQL query based on the provided parameters
    let query = `
      SELECT 
          s.adID, 
          s.sellerID, 
          s.productID,
          s.price,
          s.productAddingTime,
          s.picture,
          s.descriptions,
          p.productName,
          p.brand,
          sc.name AS subCategoryName,
          rc.name AS rootCategoryName,
          u.firstName || ' ' || u.lastName AS sellerName
      FROM 
          Sells s
      JOIN 
          Product p ON s.productID = p.productID
      JOIN 
          subCategory sc ON p.subCategoryID = sc.subCategoryID
      JOIN 
          RootCategory rc ON sc.rootCategoryID = rc.rootCategoryID
      JOIN
          Users u ON s.sellerID = u.userID
      WHERE 1=1
    `;

    const bindParams = {};

    if (rootCategoryID) {
      query += " AND rc.rootCategoryID = :rootCategoryID";
      bindParams.rootCategoryID = rootCategoryID;
    }

    if (subCategoryID) {
      query += " AND sc.subCategoryID = :subCategoryID";
      bindParams.subCategoryID = subCategoryID;
    } else if (rootCategoryID) {
      query += " AND p.subCategoryID IN (SELECT subCategoryID FROM subCategory WHERE rootCategoryID = :rootCategoryID)";
      bindParams.rootCategoryID = rootCategoryID;
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      query += " AND s.price BETWEEN :minPrice AND :maxPrice";
      bindParams.minPrice = minPrice;
      bindParams.maxPrice = maxPrice;
    } else if (minPrice !== undefined) {
      query += " AND s.price >= :minPrice";
      bindParams.minPrice = minPrice;
    } else if (maxPrice !== undefined) {
      query += " AND s.price <= :maxPrice";
      bindParams.maxPrice = maxPrice;
    }

    if (brand) {
      query += " AND p.brand = :brand";
      bindParams.brand = brand;
    }

    if (orderByPrice === "asc") {
      query += " ORDER BY s.price ASC";
    } else if (orderByPrice === "desc") {
      query += " ORDER BY s.price DESC";
    }

    const queryData = await runQuery(query, bindParams);
    const output = extractData(queryData, [
      "adID",
      "productAddingTime",
      "productID",
      "sellerName",
      "productName",
      "picture",
      "descriptions",
      "brand",
      "subCategoryName",
      "rootCategoryName",
      "price",
    ]);

    res.json(output);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Error fetching products" });
  }
});

app.post("/filterBySubCategory", async (req, res) => {
  try {
    const { subCategoryID } = req.body;

    const query = `
          SELECT 
              s.adID, 
              s.sellerID, 
              s.productID,
              s.price,
              s.productAddingTime,
              s.picture,
              s.productAddingTime,
              s.descriptions,
              p.productName,
              p.brand,
              sc.name AS subCategoryName,
              (SELECT name FROM rootcategory WHERE sc.rootCategoryID = rootcategory.rootcategoryID) AS rootCategoryName,
              u.firstName || ' ' || u.lastName AS sellerName
          FROM 
              Sells s
          JOIN 
              Product p ON s.productID = p.productID
          JOIN 
              subCategory sc ON p.subCategoryID = sc.subCategoryID
          JOIN
              Users u ON s.sellerID = u.userID
          WHERE 
              sc.subCategoryID = :subCategoryID
      `;
    const bindParams = {
      subCategoryID: subCategoryID,
    };

    const queryData = await runQuery(query, bindParams);
    const output = extractData(queryData, [
      "adID",
      "productAddingTime",
      "productID",
      "sellerName",
      "productName",
      "picture",
      "descriptions",
      "brand",
      "subCategoryName",
      "rootCategoryName",
      "price",
    ]);

    res.json(output);
  } catch (error) {
    console.error("Error fetching products by subcategory:", error);
    res.status(500).json({ error: "Error fetching products by subcategory" });
  }
});



app.post("/sortBy", async (req, res) => {
  const { sortt ,type} = req.body;
  let orderBy = "";

  const validSortOptions = {
    date: "ORDER BY s.productAddingTime",
    price: "ORDER BY s.price",
  };
  console.log(validSortOptions);

  if (validSortOptions[sortt]) {
    orderBy = validSortOptions[sortt];
    console.log(orderBy);
  } else {
    return res.status(400).json({ error: "Invalid sort option" });
  }

  const query = 
  `SELECT s.adID,
    p.productID,
    p.productName,
    p.brand,
    s.price, 
    s.descriptions,
    s.productAddingTime,
    u.firstName || ' ' || u.lastName AS sellerName
  FROM Sells s
  JOIN Product p ON s.productID = p.productID
  JOIN Users u ON s.sellerID = u.userID
  ${orderBy} ${type}`;


  

  try {
    const queryData = await runQuery(query, []);
    const output = extractData(queryData, [
      "adID",
      "productAddingTime",
      "productID",
      "sellerName",
      "productName",
      "descriptions",
      "brand",
      "price",
    ]);

    res.json(output);
  } catch (error) {
    console.error("Error sorting data:", error);
    res.status(500).json({ error: "Error sorting data" });
  }
});

// 1. Division
// 2. District
// 3. Upazilla
// 4. Users
// 5. RootCategory
// 6. subCategory
// 7. Product
// 8. Admins
// 9. Chat
// 10. Message
// 11. Orders
// 12. Sells
// 13. WishList
// 14. Report
// 15. WarningNotifications
// 16. CartChangesNotifications
// 17. OrderConfirmationNotifications

app.get('/products', async (req, res) => {
  try {
    const query = 'SELECT * FROM Product';
    const queryData = await runQuery(query, []);
    //console.log(queryData)
    const output = extractData(queryData, ['productID', 'subCategoryID', 'productName', 'brand', 'picture', 'descriptions']);
    res.json(output);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
});





app.get("/rootCategories", async (req, res) => {
  try {
    const query = "SELECT * FROM RootCategory"; // Assuming RootCategories is the name of your table
    const queryData = await runQuery(query, []);
    const output = extractData(queryData, ["rootCategoryID", "name"]);
    res.json(output);
  } catch (error) {
    console.error("Error fetching root categories:", error);
    res.status(500).json({ error: "Error fetching root categories" });
  }
});

app.get("/subCategories", async (req, res) => {
  const rootCategoryID = req.query.rootCategoryID;
  try {
    const query =
      "SELECT * FROM SubCategory WHERE rootCategoryID = :rootCategoryID";
    const queryData = await runQuery(query, [rootCategoryID]);
    const output = extractData(queryData, ["subCategoryID", "name"]);
    res.json(output);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({ error: "Error fetching subcategories" });
  }
});

app.post("/AddProduct", async (req, res) => {
  console.log(req.body);
  // const rootCategoryID = req.query.rootCategoryID;
  //   try {
  //     const insertProductQuery=`INSERT INTO Product (productID, subCategoryID, productName, brand)
  //     VALUES (1, 101, 'Laptop', 'Dell')`;

  //     const insertSellsQuery=`INSERT INTO Sells (sellerID, productID, adID, price, productAddingTime, picture, descriptions)
  //     VALUES (1001, 1, 20001, 1200.00, TIMESTAMP '2023-08-26 10:00:00', 'laptop_image.jpg', 'High-performance laptop with 16GB RAM.');`

  //   const newuId = result2.rows.length+1;
  //   const insertQuery = `INSERT INTO USERS(userID,email,passwords,firstname,lastname,locationID) VALUES(:newuId,:email,:passwordHash,:firstname,:lastname,:locationID)`;
  //   console.log("this is a ID : " ,newuId);

  // //   const bindParams = {
  // //     newuId : ,
  // //     passwordHash: passwordHash,
  // //     email:email,
  // //     firstname:firstname,
  // //     lastname:lastname,
  // //     locationID: locationID,
  // // };

  //   const result3 = await runQuery(insertQuery,[]);
  //   res.send(result3);
  //   } catch (error) {
  //       console.error('Error fetching subcategories:', error);
  //       res.status(500).json({ error: 'Error fetching subcategories' });
  //   }
});

app.put("/add", async (req, res) => {
  const query = "INSERT INTO EMPLOYEES (name, age, country) VALUES (?, ?, ?)";
  const bindParams = [req.body.name, req.body.age, req.body.country];

  try {
    const result = await runQuery(query, bindParams);
    res.status(200).json({ message: "Row inserted successfully!" });
  } catch (error) {
    console.error("Error inserting row:", error);
    res.status(500).json({ message: "Error inserting row." });
  }
});




const httpServer = new Server(app);
const io = new SocketServer(httpServer);







io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("send_message", async (data) => {
    const { senderID, receiverID, messageText } = data;

    try {
      const chatID = `${senderID}-${receiverID}`;  // Simple chatID generation for this example
      const insertMessageQuery = `
        INSERT INTO Message (chatID, messageText, messageTime, isRead)
        VALUES (:chatID, :messageText, CURRENT_TIMESTAMP, 0)
      `;
      const bindParams = {
        chatID: chatID,
        messageText: messageText
      };

      const result = await runQuery(insertMessageQuery, bindParams);
      if (result.rowsAffected) {
        // Emitting the message to the receiver
        socket.broadcast.to(receiverID).emit('receive_message', data);
      }
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  // Fetch chat history
  socket.on("fetch_chat_history", async (data) => {
    const { senderID, receiverID } = data;

    try {
      const chatID = `${senderID}-${receiverID}`;  // Simple chatID generation for this example
      const fetchHistoryQuery = `
        SELECT * FROM Message WHERE chatID = :chatID ORDER BY messageTime ASC
      `;
      const bindParams = { chatID: chatID };

      const result = await runQuery(fetchHistoryQuery, bindParams);
      socket.emit("chat_history", extractData(result, ["chatID", "messageText", "messageTime", "isRead"]));
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});



httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

