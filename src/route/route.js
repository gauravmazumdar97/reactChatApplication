require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const router = express.Router();
const Controller = require('../controller/controller');
const { errorHandler, notFound } = require('../middleware/errorHandler');
const Authorization = require('../middleware/authHandler')
const AuthController = require('../controller/auth-controller')

// Middleware
app.use(express.json()); // Use JSON middleware
app.use(express.urlencoded({ extended: true })); // Use FORMDATA middleware
app.use(cors()); // Use CORS middleware

// Custom Middlewares
app.use(notFound)
app.use(errorHandler)





// ==========AUTH APIS======================

// Route to Register User
router.post('/register', AuthController.registerUser);
// Route to Login User
router.post('/login', AuthController.loginUser);
// Route to Upload Media
router.put('/signed-url', AuthController.preSignedUrl);
// Route to search of all users
router.post('/searchUser', Authorization.authToken ,AuthController.searchUser);



// ==========CHAT APIS======================

// Route to access chat
router.get('/accessChat',Authorization.authToken,Controller.accessChat)
// Route to fetch chat
router.get('/fetchChat',Authorization.authToken,Controller.fetchChat)

// ----------------------------------------------------// GROUP APIS
// Route to fetch group chat
router.get('/getGroupChat',Authorization.authToken,Controller.getGroupChat)
// Route to chat group
router.post('/createGroup',Authorization.authToken,Controller.createGroup)
// Route to rename the chat
router.put('/renameGroup',Authorization.authToken,Controller.renameGroup)
// Route to remove User To Group
router.put('/removeFromGroup',Authorization.authToken,Controller.removeFromGroup)
// Route to delete the Group
router.delete('/deleteGroup',Authorization.authToken,Controller.deleteGroup)
// Route to add User To Group
router.put('/addToGroup',Authorization.authToken,Controller.addToGroup)
// Route to access Chat by ID
router.get('/api/chats/:id', (req, res) => {
    try {
        res.status(404).json({ message: 'Chat not found' });
    } catch (error) {
        console.error('Error fetching chat by ID:', error);
        res.status(500).json({ message: error });
    }
});



// ==========CUSTOMER APIS======================
// Route to add customer
router.post('/customer', Controller.addCustomer);
// Route to get customer
router.get('/customer', Controller.getCustomer);
// Route to update customer
router.put('/customer', Controller.updateCustomer);
// Route to delete customer
router.delete('/customer', Controller.deleteCustomer);



// ==========PRODUCT APIS======================
// Route to add product
router.post('/customerProducts', Controller.addCustomerProducts);
// Route to get product
router.get('/customerProducts', Controller.getCustomerProducts);
// Route to update product
router.put('/customerProducts', Controller.updateCustomerProducts);
// Route to delete product
router.delete('/customerProducts', Controller.deleteCustomerProducts);




// ==========PURCHASES APIS======================
// Route to add purchases
router.post('/addPurchases', Controller.addPurchases);
// Route to get purchases
router.get('/getPurchases', Controller.getPurchases);
// Route to update purchases
router.put('/updatePurchases', Controller.updatePurchases);
// Route to delete purchases
router.delete('/deletePurchases', Controller.deletePurchases);












module.exports = router;