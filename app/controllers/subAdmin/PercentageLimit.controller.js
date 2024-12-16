//Read the note about this part
//This limit code is good, we just have to change the http request to websocket request for it like it is in the other code
//Ok.
const mongoose = require("mongoose");
const db = require("../../models");
const LimitBut = db.PercentageLimit;
const specificLimits = db.specificLimits;

// Create
//this is updated for supervisor limit
exports.addPercentageLimitBut = async (req, res) => {
  const { lotteryCategoryName, limits, seller, superVisor } = req.body;
  try {
    let newLimit = null;

    if (seller) {
      const isExist = await LimitBut.findOne({
        subAdmin: req.userId,
        lotteryCategoryName,
        seller,
      });

      if (isExist) {
        return res.status(500).json({ message: "Limit of this seller already exists for this Lottery" });
      }

      newLimit = new LimitBut({
        subAdmin: req.userId,
        lotteryCategoryName,
        limits,
        seller,
      });
    } else {
      if (superVisor) {
        const isExist = await LimitBut.findOne({
          subAdmin: req.userId,
          lotteryCategoryName,
          superVisor,
        });

        if (isExist) {
          return res.status(500).json({ message: "Limit of this Supervisor already exists for this Lottery" });
        }

        newLimit = new LimitBut({
          subAdmin: req.userId,
          superVisor,
          lotteryCategoryName,
          limits,
        });
      } else {
        const isExist = await LimitBut.findOne({
          subAdmin: req.userId,
          lotteryCategoryName,
        });

        if (isExist) {
          return res.status(500).json({ message: "All Limits already exist for this Lottery" });
        }

        newLimit = new LimitBut({
          subAdmin: req.userId,
          lotteryCategoryName,
          limits,
        });
      }
    }

    await newLimit.save();
    newLimit = await LimitBut.findById(newLimit._id).populate("seller");

    res.send(newLimit);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};


// Read //it have to modify for seller / supervisor // subadmin
//Now it is for all 
exports.getPercentageLimitButAll = async (req, res) => {
  try {
    let limits=null
    limits = await LimitBut.find({
    subAdmin: req.userId,
    superVisor: { $exists: false }, // Ensure superVisor does not exist
    seller: { $exists: false } // Ensure seller does not exist
  })

    res.json(limits);
  } catch (err) {
    // console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Read
exports.getPercentageLimitBut = async (req, res) => {
  try {
    const { general } = req.query;
    let limits = null;
    if (general == "true") {
      limits = await LimitBut.find({
        subAdmin: req.userId,
      }).populate("seller");
    } else {
      limits = await specificLimits.find({
        subAdmin: req.userId,
      }).populate("seller");
    }
    res.json(limits);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getPercentageLimitButSeller = async (req, res) => {
  try {
    const sellerId=req.query.seller
    const lotteryCategoryName=req.query.lotteryCategoryName
    // console.log(sellerId)
    let limits = null;

    matchStage={
      subAdmin:req.userId,
      superVisor:{ $exists: false }
    }

    if(sellerId){
      matchStage.seller=mongoose.Types.ObjectId(sellerId)
    }else{
      matchStage.seller={ $exists: true } 
    }

    if(lotteryCategoryName){
      matchStage.lotteryCategoryName=lotteryCategoryName
    }
    // console.log(matchStage)
    limits = await LimitBut.find(matchStage).populate("seller");

    res.json(limits);
  } catch (err) {
    // console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getPercentageLimitButSuperVisor = async (req, res) => {
  try {
    const superVisorId=req.query.superVisor
    const lotteryCategoryName=req.query.lotteryCategoryName

    matchStage={
      subAdmin:req.userId,
      seller:{ $exists: false }
    }

    if(superVisorId){
      matchStage.superVisor=mongoose.Types.ObjectId(superVisorId)
    }else{
      matchStage.superVisor={ $exists: true } 
    }

    if(lotteryCategoryName){
      matchStage.lotteryCategoryName=lotteryCategoryName
    }


    let limits = null;
    limits = await LimitBut.find(matchStage).populate("superVisor");

    res.json(limits);
  } catch (err) {
    // console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update
exports.updatePercentageLimitBut = async (req, res) => {
  const { id } = req.params;
  const { lotteryCategoryName, limits, seller, general } = req.body;

  try {
    let limit = null;
   
      limit = await LimitBut.findById(id);



    if (!limit) {
      return res.status(404).json({ message: "Limit not found" });
    }

    limit.lotteryCategoryName = lotteryCategoryName;
    limit.limits = limits;

    if (seller == "") {
      limit.seller = null;
    } else {
      limit.seller = seller;
    }

    limit = await limit.save();

    
      limit = await LimitBut.findById(id).populate("seller");
    

    res.json(limit);
  } catch (err) {
    // console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// DELETE a block number by ID
exports.deletePercentageLimitBut = async (req, res) => {
  const { id } = req.params;
  try {
    let limit = null;

   
      limit = await LimitBut.findById(id);

    if (!limit) {
      return res.status(404).json({ message: "Limit not found" });
    }

    await limit.remove();

    res.json({ message: "Limit removed" });
  } catch (err) {
    // console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
