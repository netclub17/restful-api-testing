const productRoutes = (app, fs) => {

    // variables
    const dataPath = './data/products.json';

    // read json file methods
    const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                throw err;
            }
            callback(returnJson ? JSON.parse(data) : data);
        });
    };

    // write json file methods
    const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {
        fs.writeFile(filePath, fileData, encoding, (err) => {
            if (err) {
                throw err;
            }
            callback();
        });
    };

    // GET Product LIST
    app.get('/products', (req, res) => {
         /**
         * @swagger
         * /products:
         *   get:
         *     description: Get Product List
         *
         *     tags:
         *        - Product
         * 
         *     responses:
         *       200:
         *         description: Success
         * 
         */
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }
            let jsonData = JSON.parse(data) || [];

            if (jsonData.length === 0) {
                return res.status(404).json({
                    statusCode: 404,
                    message: 'Products not found!'
                });
            }

            res.json(jsonData);
        });
    });

     // GET Product Detail
     app.get('/products/:id', (req, res) => {
        /**
        * @swagger
        * /products/{id}:
        *   get:
        *     description: Get product detail
        *     parameters:
        
        *      - name: id
        *        description: id of product
        *        in: path
        *        required: true
        *        type: integer
        
        *     tags:
        *      - Product 
        *     responses:
        *       200:
        *         description: Success
        */

        fs.readFile(dataPath, 'utf8', async (err, data) => {
            if (err) {
                throw err;
            }

            let jsonData = JSON.parse(data) || [{}];
            let productInfo = await jsonData.find((item) => Number(item.id) === Number(req.params.id));
            if (!productInfo) {
                return res.status(404).json({
                    statusCode: 404,
                    message: 'Product item not found!'
                });
            }
            return res.status(200).json(productInfo);
        });
    });


    // CREATE
    app.post('/products', (req, res) => {
        /**
     * @swagger
     * /products:
     *   post:
     *     description: Add product
     *     parameters:
     *      - name: name
     *        description: name of the product
     *        in: formData
     *        required: true
     *        type: string
     *
     *      - name: sku
     *        description: sku of the product
     *        in: formData
     *        required: true
     *        type: string
     *
     *      - name: price
     *        description: price of the product
     *        in: formData
     *        required: true
     *        type: number
     *
     *      - name: quantity
     *        description: quantity of the product
     *        in: formData
     *        required: false
     *        type: number
     * 
     *     tags:
     *      - Product
     *     responses:
     *       200:
     *         description: Created
     */
        readFile(data => {
            let datas = [...data];
            let lastProduct = datas.length > 0 ? datas.pop() : [];

            let productInfo = {};
            if (Object.keys(lastProduct).length > 0) {
                productInfo = lastProduct || {};
            }

            let productId = 1;
            if (Object.keys(productInfo).length > 0) {
                productId = Number(productInfo.id) + 1 || 0;
            }
           
            if (typeof req.body === 'undefined' || Object.keys(req.body).length === 0) {
                return res.status(400).json({
                    statusCode: 400,
                    message: `Please require all input!`
                });
            }

            let price = 0;
            if (req.body.price) {
                price = Number(req.body.price) || 0;
            }
            Object.assign(req.body, {price: price});

            let quantity = 0;
            if (req.body.quantity) {
                quantity = Number(req.body.quantity) || 0;
            }
            Object.assign(req.body, {quantity: quantity});

            // add the new products
            if (!req.body.id) {
                Object.assign(req.body, {id: productId});
            }
            data.push(req.body);
            let jsonData = data;

            writeFile(JSON.stringify(jsonData, null, 2), () => {
                res.status(200).send({
                    statusCode: 200,
                    message: `product create successfully!`
                });
            });
        }, true);
    });


    // UPDATE
    app.put('/products/:id', (req, res) => {
        /**
         * @swagger
         * /products/{id}:
         *   put:
         *     description: Update product
         *     parameters:
         *
         *      - name: id
         *        description: id of the product
         *        in: path
         *        required: true
         *        type: integer
         *
         *      - name: name
         *        description: name of the product
         *        in: formData
         *        required: true
         *        type: string
         *
         *      - name: sku
         *        description: sku of the product
         *        in: formData
         *        required: false
         *        type: string
         *
         *      - name: price
         *        description: price of the product
         *        in: formData
         *        required: false
         *        type: number
         *
         *      - name: quantity
         *        description: quantity of the product
         *        in: formData
         *        required: false
         *        type: number
         *
         *     tags:
         *      - Product
         *     responses:
         *       200:
         *         description: Updated
         */

        readFile(data => {
            const productIndex = data.findIndex((item) => Number(item.id) === Number(req.params.id));
            const productInfo = data.find((item) => Number(item.id) === Number(req.params.id));

            if (typeof req.body === 'undefined' || Object.keys(req.body).length === 0) {
                return res.status(400).json({
                    statusCode: 400,
                    message: `Please require all input!`
                });
            }
            if (productIndex !== -1 && Object.keys(req.body).length > 0) {

                Object.assign(req.body, {id: Number(req.params.id)});

                let name = productInfo !== null ? productInfo.name : '';
                if (req.body.name) {
                    name = req.body.name || '';
                }
                Object.assign(req.body, {name: name});

                let sku = productInfo !== null ? productInfo.sku : '';
                if (req.body.sku) {
                    sku = req.body.sku || '';
                }
                Object.assign(req.body, {sku: sku});

                let price = productInfo !== null ? productInfo.price : 0;
                if (req.body.price) {
                    price = req.body.price || 0;
                }
                Object.assign(req.body, {price: price});

                let quantity = productInfo !== null ? productInfo.quantity : 0;
                if (req.body.quantity) {
                    quantity = req.body.quantity || 0;
                }
                Object.assign(req.body, {quantity: quantity});

                data.splice(productIndex, 1, req.body);
                writeFile(JSON.stringify(data, null, 2), () => {
                    return res.status(200).json({
                        statusCode: 200,
                        message: `Products id:${Number(req.params.id)} update successfully`
                    });
                });
            } else {
                return res.status(500).json({
                    statusCode: 500,
                    message: `cannot update not found item!`
                });
            }
           
        }, true);
    });


    // DELETE
    app.delete('/products/:id', (req, res) => {
        /**
         * @swagger
         * /products/{id}:
         *   delete:
         *     description: Delete product
         *     parameters:
         *     
         *      - name: id
         *        description: id of the product
         *        in: path
         *        required: true
         *        type: integer
         
        *     tags:
        *      - Product
        *     responses:
        *       200:
        *         description: Deleted
        */
        readFile(data => {
            const productIndex = data.findIndex((item) => Number(item.id) === Number(req.params.id));
            // remove product item
            if (productIndex !== -1) {
                data.splice(productIndex, 1);

                writeFile(JSON.stringify(data, null, 2), () => {
                    res.status(200).json({
                        statusCode: 200,
                        message: `Products id:${Number(req.params.id)} removed`
                    });
                });
            } else {
                res.status(500).json({
                    statusCode: 500,
                    message: `Products id:${Number(req.params.id)} not found for delete!`
                });
            }
        }, true);
    });
};

module.exports = productRoutes;