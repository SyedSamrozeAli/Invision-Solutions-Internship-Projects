import express from "express";
import url from "url";

const PORT = 8000;

const products = [
    { id: 1, name: "Product 1", price: 100, date: new Date("2024-06-01"), brand: "BrandA" },
    { id: 2, name: "Product 2", price: 200, date: new Date("2024-06-15"), brand: "BrandB" },
    { id: 3, name: "Product 3", price: 300, date: new Date("2024-06-20"), brand: "BrandA" },
    { id: 4, name: "Product 4", price: 600, date: new Date("2024-06-28"), brand: "BrandC" },
    { id: 5, name: "Product 5", price: 400, date: new Date("2024-03-09"), brand: "BrandC" },
    { id: 6, name: "Product 6", price: 1000, date: new Date("2024-05-08"), brand: "BrandB" },
    { id: 7, name: "Product 7", price: 1200, date: new Date("2024-08-12"), brand: "BrandA" },
];

const app = express();

app.get("/api/products", (req, res) => {

    const myUrl = url.parse(req.url, true);

    let startDate = new Date("1990-01-01");
    if (myUrl.query.startDate)
        startDate = new Date(myUrl.query.startDate)
    // console.log(`StartDate: ${startDate}`);

    let endDate = new Date("2050-01-01");
    if (myUrl.query.endDate)
        endDate = new Date(myUrl.query.endDate)
    // console.log(`endDate: ${endDate}`);

    let brandName = "";
    if (myUrl.query.brandName)
        brandName = myUrl.query.brandName;

    // console.log(`Brand Name: ${brandName}`);
    let minPrice = 0;
    if (myUrl.query.minPrice)
        minPrice = myUrl.query.minPrice;

    // console.log(`minPrice: ${minPrice}`);
    let maxPrice = Number.MAX_VALUE;
    if (myUrl.query.maxPrice)
        maxPrice = myUrl.query.maxPrice;

    // console.log(`maxPrice: ${maxPrice}`);
    let filterProducts = products;

    let keyWord = "";
    if (myUrl.query.keyWord)
        keyWord = myUrl.query.keyWord;


    if (brandName)
        filterProducts = filterOnBrand(brandName, filterProducts);

    filterProducts = filterOnDate(startDate, endDate, filterProducts);

    filterProducts = filterOnPrice(minPrice, maxPrice, filterProducts);

    if (keyWord)
        filterProducts = filterOnKeyword(keyWord, filterProducts);


    if (filterProducts == "")
        res.json(
            {
                "success": false,
                "status_code": 404,
                "message": ["No Product found :("],
                "data": {
                    "list": filterProducts
                }
            })


    res.status(200).json({
        "success": true,
        "status_code": 200,
        "message": ["Data fetched successfully!"],
        "data": {
            "list": filterProducts
        }
    });

});

function filterOnDate(startDate, endDate, products) {

    const resultantProduct = products.filter((product) => {
        if (product.date >= startDate && product.date <= endDate) {
            return product;
        }
    });

    return resultantProduct;
}

function filterOnPrice(minPrice, maxPrice, products) {

    const resultantProduct = products.filter((product) => {
        if (product.price >= minPrice && product.price <= maxPrice) {
            return product;
        }
    });

    return resultantProduct;
}

function filterOnBrand(brandName, products) {

    const resultantProduct = products.filter((product) => {
        return brandName === product.brand;
    });

    return resultantProduct;
}


function filterOnKeyword(keyWord, products) {

    const resultantProduct = products.filter(product =>
        product.name.toLowerCase().includes(keyWord.toLowerCase()) ||
        product.brand.toLowerCase().includes(keyWord.toLowerCase())
    );

    return resultantProduct;
}
app.listen(PORT, () => console.log(`Server Connected at PORT:${PORT}`));
