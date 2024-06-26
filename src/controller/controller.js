const User = require("../models/userModel");
const Message = require("../models/messageModel");
const AWSConfig = require("../config/awsConfig");
const AuthToken = require("../config/jwt-Token");
const Participants = require("../models/participantsModel");
const Customer = require("../models/customer");
const Product = require("../models/products");
const Purchase = require("../models/purchases");
const Chat = require("../models/chatModel");
const { ObjectId } = require('mongodb');




class Controller {
  constructor() { }

  //   CUSTOMER APIS
  async getCustomer(req, res) {
    try {
      const purchase = [];
      const { _id } = req.body;

      if (_id) {
        let data = await Customer.findById(_id)
          .populate({
            path: 'purchases',
            populate: { path: 'productId', select: '_id name brand price star' }
          })
          .exec();


        return res.status(200).json(data);
      } else {
        const data = await Customer.find(_id).populate("purchases").exec();

        return res.status(200).json(data);
      }
    } catch (error) {
      return res.status(400).json({ msg: `Something Went Wrong ${error}` });
    }
  }
  async addCustomer(req, res) {
    try {
      const { name, email, state, pincode, productId } = req.body;
      const data = await Customer.create({
        name,
        email,
        state,
        pincode,
        productId,
      });

      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json({ msg: `Something Went Wrong ${error}` });
    }
  }
  async updateCustomer(req, res) {
    try {
      const { _id, state } = req.body;
      const result = await Customer.find({ _id: { $eq: { _id } } }).updateOne({
        state: state,
      });

      return res.status(200).json({ result });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: `Something Went Wrong ${error}` });
    }
  }
  async deleteCustomer(req, res) {
    try {
      const { customerId } = req.body;
      const result = await Customer.deleteOne({ _id: customerId });

      return res.status(200).json({ result });
    } catch (error) {
      return res.status(400).json({ msg: `Something Went Wrong ${error}` });
    }
  }

  //   PRODUCT APIS
  async getCustomerProducts(req, res) {
    try {
      let data;
      const { _id } = req.body;

      req.body._id == null
        ? (data = await Product.find().select("-__v"))
        : (data = await Product.find({ _id: { $eq: { _id } } }).select("-__v"));

      return res.status(200).json({ msg: "Data fetched", data });
    } catch (error) {
      return res.status(400).json({ msg: `Something Went Wrong ${error}` });
    }
  }
  async addCustomerProducts(req, res) {
    try {
      const { name, brand, price, star } = req.body;
      // Check if the product already exists
      const existingProduct = await Product.findOne({
        name: name,
        brand: brand,
        price: price,
        star: star,
      });

      if (existingProduct == null) {
        const data = await Product.create({ name, brand, price, star });

        return res.status(200).json({ msg: "Product ADDED", data });
      } else {
        return res.status(200).json({ msg: `Product already exists` });
      }
    } catch (error) {
      return res.status(400).json({ msg: `Something Went Wrong ${error}` });
    }
  }
  async updateCustomerProducts(req, res) {
    try {
      const { _id, name, brand, price, star } = req.body;

      // Check if the product already exists
      const existingProduct = await Product.find({
        _id: { $eq: { _id } },
      }).updateOne({
        name: name,
        brand: brand,
        price: price,
        star: star,
      });

      if (existingProduct == null) {
        return res.status(200).json({ msg: `Product does not exists` });
      } else {
        const data = await Product.find({ _id: { $eq: { _id } } }).updateOne({
          name: name,
          brand: brand,
          price: price,
          star: star,
        });
        return res.status(200).json({ msg: "Product UPDATE", data });
      }
    } catch (error) {
      return res.status(400).json({ msg: `Something Went Wrong ${error}` });
    }
  }
  async deleteCustomerProducts(req, res) {
    try {
      const { _id } = req.body;

      // Check if the product already exists
      const existingProduct = await Product.find({ _id: { $eq: { _id } } });

      if (existingProduct == null) {
        return res.status(200).json({ msg: `Product does not exists` });
      } else {
        const data = await Product.deleteOne({ _id: { $eq: { _id } } });

        return res.status(200).json({ msg: "Product DELETED", data });
      }
    } catch (error) {
      return res.status(400).json({ msg: `Something Went Wrong ${error}` });
    }
  }

  //   PURCHASES APIS
  async getPurchases(req, res) {
    try {
      let data;
      const { _id } = req.body;

      req.body._id == null
        ? (data = await Purchase.find().select("-__v"))
        : (data = await Purchase.find({ _id: { $eq: { _id } } }).select("-__v"));

      return res.status(200).json({ msg: "Data fetched", data });
    } catch (error) {
      return res.status(400).json({ msg: `Something Went Wrong ${error}` });
    }
  }

  async addPurchases(req, res) {
    try {
      const { customerId, quantity, productId, total, status } = req.body;
      // Check if the product already exists
      const existingProduct = await Purchase.findOne({
        customerId: customerId,
        quantity: quantity,
        productId: productId,
        total: total,
        status: status,
      });

      if (existingProduct == null) {
        const data = await Purchase.create({
          customerId,
          quantity,
          productId,
          total,
          status,
        });

        return res.status(200).json({ msg: "Purchase ADDED", data });
      } else {
        return res.status(200).json({ msg: `Purchase ALREADY EXIST` });
      }
    } catch (error) {
      return res.status(400).json({ msg: `Something Went Wrong ${error}` });
    }
  }

  async updatePurchases(req, res) {
    try {
      const { _id, name, brand, price, star } = req.body;

      // Check if the product already exists
      const existingProduct = await Product.find({
        _id: { $eq: { _id } },
      }).updateOne({
        name: name,
        brand: brand,
        price: price,
        star: star,
      });

      if (existingProduct == null) {
        return res.status(200).json({ msg: `Product does not exists` });
      } else {
        const data = await Product.find({ _id: { $eq: { _id } } }).updateOne({
          name: name,
          brand: brand,
          price: price,
          star: star,
        });
        return res.status(200).json({ msg: "Product UPDATE", data });
      }
    } catch (error) {
      return res.status(400).json({ msg: `Something Went Wrong ${error}` });
    }
  }

  async deletePurchases(req, res) {
    try {
      const { _id } = req.body;

      // Check if the product already exists
      const existingProduct = await Product.find({ _id: { $eq: { _id } } });

      if (existingProduct == null) {
        return res.status(200).json({ msg: `Product does not exists` });
      } else {
        const data = await Product.deleteOne({ _id: { $eq: { _id } } });

        return res.status(200).json({ msg: "Product DELETED", data });
      }
    } catch (error) {
      return res.status(400).json({ msg: `Something Went Wrong ${error}` });
    }
  }




  // CHAT APIS
  accessChat = async (req, res) => {
    try {

      // NORMAL ID
      let senderId = req.user._id
      let recieverId = req.body.recieverId;
      console.log('Sender ID : ', senderId);
      console.log('Reciever ID: ', recieverId);


      //User exist or not
      const user = await User.find({ _id: { $eq: recieverId } });
      if (!user) {
        return res.status(400).json('User does not exist');
      }



      // Chat exist or not
      const isChat = await Chat.find({
        isGroupChat: false,
        users: { $elemMatch: { $eq: req.user.senderId } },
        users: { $elemMatch: { $eq: req.body.recieverId } }
      }).populate('users', '-password')

      // console.log('isChat',isChat);
      console.log('How many chats :-', isChat.length);

      if (isChat.length > 0) {
        res.status(200).json(isChat[0])
      } else {
        let chatData = {
          isGroupChat: 'false',
          users: [req.user._id, recieverId],
          chatName: 'sender'
        }

        try {
          const createChat = await Chat.create(chatData);

          const fullChat = await Chat.findOne({ _id: createChat._id }).populate('users', '-password')

          return res.status(200).json(fullChat);

        } catch (error) {
          return res.status(401).json(error);
        }

      }

    } catch (error) {
      console.log(error);
      return res.status(400).json({ error });
    }
  };

   fetchChat = async (req, res) => {
    try {

      // NORMAL ID
      let senderId = req.user._id
      console.log('Sender ID : ', senderId);


      const isChat = await Chat.find({
        users: { $elemMatch: { $eq: senderId } },
      }).populate('users', '-password')
        .populate('groupAdmin', '-password')
        .populate('latestMessage')
        .sort({ updatedAt: -1 })
        .then(async (results) => {
          results = await User.populate(results, {
            path: 'latestMessage.sender',
            select: 'name pic email'
          });

          console.log('How many chats :-', results.length);
          return res.status(200).json(results)
        });


    } catch (error) {
      console.log(error);
      return res.status(400).json({ error });
    }
  };


  getGroupChat = async (req, res) => {
    try {

      // NORMAL ID
      let groupId = req.body.groupId
      console.log('Group ID : ', groupId);


      const groupChat = await Chat.find({ _id: { $eq: groupId } })
        .populate('users', '-password')
        .populate('groupAdmin', '-password');

      if (groupChat.length === 0) {
        return res.status(400).json({ msg: 'Group does not exist, please enter a valid group' });
      }


      return res.status(200).json(groupChat);

    } catch (error) {
      console.log(error);
      return res.status(400).json({ error });
    }
  };

  createGroup = async (req, res) => {
    try {
      console.log(req.user);


      // NORMAL ID
      let senderId = req.user._id
      let recieverIds = req.body.recieverIds;
      let users = recieverIds;
      users.push(senderId);

      console.log(`Users.length : ${users.length}`);


      if (!req.body.chatName) {
        return res.status(400).json({ msg: 'No group name is provided' });
      }

      if (users.length <= 2) {
        return res.status(400).json({ msg: 'More than 2 members are required to form a group chat' });
      }

      console.log('Sender ID : ', senderId);
      console.log('Reciever Ids: ', users);

      // Creating group with users
      const groupChat = await Chat.create({
        chatName: req.body.chatName,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user
      })

      // Fetching the group chat 
      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")


      return res.status(200).json(fullGroupChat);


    } catch (error) {
      return res.status(400).json({ error });
    }
  };

  renameGroup = async (req, res) => {
    try {
      console.log(req.user);
      const { groupId, groupName } = req.body;

      const renameGroup = await Chat.findByIdAndUpdate(groupId,
        { chatName: groupName },
        { new: true })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");


      if (!renameGroup) {
        return res.status(400).json({ msg: 'Group does not exist please enter the valid group' })
      }

      return res.status(200).json({ renameGroup });
    } catch (error) {
      return res.status(400).json({ error });
    }
  };

  removeFromGroup = async (req, res) => {
    try {
      console.log(req.user);
      const {userId, groupId} = req.body;

      // Check if user exist or not 
      const userExist = await User.find({ _id: { $eq: userId } });
      if(!userExist){ return res.status(400).json({ msg:`User does not exist` });  }
      
      // Check if group exist or not 
      const groupExist = await Chat.find({ _id: { $eq: groupId } });
      if(!groupExist){ return res.status(400).json({ msg:`Group does not exist` });  }
      
      // Remove user from the group
      const removeFromGroup = await Chat.findByIdAndUpdate( groupId,
        {$pull:{users:userId}},
        {new:true})
        .populate('users','-password')
        .populate('groupAdmin','-password');

      return res.status(200).json(removeFromGroup);
    
    } catch (error) {
      return res.status(400).json(error);
    }
  };

  deleteGroup = async (req, res) => {
    try {
      console.log(req.user);
      const { groupId} = req.body;

      // Delete the group
      const deleteGroup = await Chat.findByIdAndDelete(groupId);

      return res.status(200).json({msg:`Group named ${deleteGroup.chatName} has been deleted.`});
    
    } catch (error) {
      return res.status(400).json(error);
    }
  };  

  addToGroup = async (req, res) => {
    try {
      console.log(req.user);
      const { groupId, userId } = req.body;

      // Find the user in DB 
      const userExist = await User.find({ _id: { $eq: userId } })

      // Check if user exist or not 
      if (!userExist) {
        return res.status(400).json({ msg: "User does not exist" });
      }

      // Find the group in DB 
      const addUser = await Chat.findByIdAndUpdate(groupId,
        { $push: { users: userId } },
        { new: true });


      return res.status(200).json(addUser);

    } catch (error) {
      return res.status(400).json({ error });
    }
  };




}








module.exports = new Controller();
