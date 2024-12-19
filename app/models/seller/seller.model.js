const mongoose = require('mongoose');
const moment = require('moment-timezone');
const db = require("../../models");
const User = db.user;
const Ticket = db.ticket;
const WinningNumber = db.winningNumber;
const Lottery = db.lotteryCategory;
const Limits = db.limits;
const LimitCalc = db.limitCalc;
const BlockNumber = db.blockNumber;
const SpecificLimits = db.specificLimits;
const LimitPercentage = db.PercentageLimit;
const haitiTimezone = "America/Port-au-Prince";

async function requestTicketCheck(
    lotteryCategoryName,
    sellerId,
    numbers,
) {
    try {
        // Get seller detail and populate subAdmin field
        const subAdminInfo = await User.findOne({ _id: sellerId }).populate(
            "subAdminId"
        );

        let superVisorId = subAdminInfo?.id || "";
        sellerId = mongoose.Types.ObjectId(sellerId);

        const blockNumberQuery = {
            subAdmin: subAdminInfo.subAdminId,
            lotteryCategoryName,
            $or: numbers.map((item) => ({
                gameCategory: item.gameCategory,
                number: item.number,
            })),
        };

        // Get data from BlockNumber that matches the query updated not tested yet
        const block_number = await BlockNumber.find(blockNumberQuery, {
            gameCategory: 1,
            number: 1,
            superVisor: 1,
            seller: 1,
        });

        let block_data = [];

        const matchedNumbers = new Set();

        // Check for matches in block data
        for (const blockItem of block_number) {
            for (let i = numbers.length - 1; i >= 0; i--) {
                const item = numbers[i];
                //if it have sellerId and equal to userId

                if (blockItem?.seller && sellerId.equals(blockItem.seller)) {
                    if (
                        blockItem.gameCategory === item.gameCategory &&
                        blockItem.number === item.number
                    ) {
                        block_data.push(blockItem);
                        matchedNumbers.add(i);
                    }
                }

                //  if it have supervisor and equal to user's supervisor
                if (
                    superVisorId &&
                    blockItem?.superVisor &&
                    superVisorId.equals(blockItem.superVisor)
                ) {
                    if (
                        blockItem.gameCategory === item.gameCategory &&
                        blockItem.number === item.number
                    ) {
                        block_data.push(blockItem);
                        matchedNumbers.add(i);
                    }
                }

                // data donot have supervisor and seller only admin
                if (!blockItem?.superVisor && !blockItem.seller) {
                    if (
                        blockItem.gameCategory === item.gameCategory &&
                        blockItem.number === item.number
                    ) {
                        block_data.push(blockItem);
                        matchedNumbers.add(i);
                    }
                }
            }
        }

        const limit_data = [];
        const new_numbers = [];
        let acceptedAmountSum = 0;
        const currentDate = moment().tz(haitiTimezone).format("yyyy-MM-DD");

        let totalBLTAmount = 0;

        for (let num of numbers) {
            const amount = Number(num.amount); // Convert amount to a number
            if (num.gameCategory === "BLT") {
                totalBLTAmount += amount;
            }
        }

        // if (totalBLTAmount == 0) {
        //     return { success: false, error: `BLT  Amount Ticket can not be Zero ` };
        // }

        // soft testing upto here

        for (let index = 0; index < numbers.length; index++) {
            const item = numbers[index];

            if (!matchedNumbers.has(index)) {
                let limitGameCategory = item.gameCategory;

                let maxGameLimit = 0;
                // if you have other gameCategory the BLT check the percentage limit
                if (limitGameCategory != "BLT") {
                    //now here get the percentage amount from the model
                    const LimitPercentArray = await LimitPercentage.aggregate([
                        {
                            $match: {
                                subAdmin: subAdminInfo.subAdminId._id,
                                lotteryCategoryName: lotteryCategoryName,
                            },
                        },
                        {
                            $unwind: "$limits",
                        },
                        {
                            $match: { "limits.gameCategory": limitGameCategory },
                        },
                        {
                            $project: {
                                _id: 0,
                                limitPercent: "$limits.limitPercent",
                            },
                        },
                    ]);

                    console.log("Limit Percentage here is >>>>>>>>>>", LimitPercentArray);

                    const gameLimitPercent = LimitPercentArray[0]?.limitPercent;

                    console.log("the game limit percentage is >>>>>>>>>>", gameLimitPercent);
                    // then check the BLTAmount ka percentage should be greater then the gameCategorryAmount+item.Amount
                    // if(limitGameCategory == "MRG"){
                    //   maxGameLimit = gameLimitPercent;
                    // }else 
                    if (gameLimitPercent) {
                        maxGameLimit = Math.floor((gameLimitPercent / 100) * totalBLTAmount);
                    } else {
                        maxGameLimit = item.amount
                    }
                }

                //This is how much amount a person put using percentageLimit
                let maxAmountPriceBuy = 0;
                if (limitGameCategory == "BLT") {
                    maxAmountPriceBuy = item.amount;
                } else {
                    if (maxGameLimit >= item.amount) {
                        maxAmountPriceBuy = item.amount;
                    } else {
                        maxAmountPriceBuy = maxGameLimit;
                    }
                }
                // Total limit (subAdmin limit ) amount
                let subAdminLimitsCalcId = null;
                let otherLimitCalcId = null;

                let subAdminLimitId = null;
                let otherLimitId = null;

                const numberParts = item.number.replace(/\D+/g, " ").split(" ");

                let alternateNumber = item.number;
                if (numberParts.length > 1) {
                    alternateNumber = numberParts.reverse().join("×");
                }

                const subAdminLimit = await Limits.aggregate([
                    {
                        $match: {
                            subAdmin: subAdminInfo.subAdminId._id,
                            lotteryCategoryName: lotteryCategoryName,
                            superVisor: { $exists: false },
                            seller: { $exists: false },
                        },
                    },
                    {
                        $unwind: "$limits",
                    },
                    {
                        $match: {
                            "limits.gameCategory": limitGameCategory,
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            subAdmin: 1,
                            lotteryCategoryName: 1,
                            limits: 1,
                        },
                    },
                ]);

                let remainingQuantitySubAdmin = maxAmountPriceBuy;
                subAdminLimitId = subAdminLimit[0]?._id;

                // if subAdminLimit exist
                // console.log("subAdminLimit: ",subAdminLimit)
                if (subAdminLimit.length > 0) {
                    const soldQuantitySubAdmin = await LimitCalc.findOne({
                        limitId: subAdminLimitId,
                        date: new Date(currentDate),
                    });
                    subAdminLimitsCalcId = soldQuantitySubAdmin?._id;

                    const totalSoldQuantitySubAdmin = await LimitCalc.aggregate([
                        {
                            $match: {
                                limitId: subAdminLimit[0]._id,
                                date: new Date(currentDate),
                            },
                        },
                        {
                            $unwind: "$soldState",
                        },
                        {
                            $match: {
                                $or: [
                                    {
                                        "soldState.gameCategory": limitGameCategory,
                                        "soldState.gameNumber": item.number,
                                    },
                                    {
                                        "soldState.gameCategory": limitGameCategory,
                                        "soldState.gameNumber": alternateNumber,
                                    },
                                ],
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                totalSold: { $sum: "$soldState.soldQuantity" },
                            },
                        },
                    ]);
                    // console.log("totalSoldQuantitySubAdmin",totalSoldQuantitySubAdmin)

                    const totalSoldBySubAmin =
                        totalSoldQuantitySubAdmin?.length > 0
                            ? totalSoldQuantitySubAdmin[0].totalSold
                            : 0;
                    remainingQuantitySubAdmin =
                        subAdminLimit[0]?.limits.limitsButs - totalSoldBySubAmin;
                }

                // finding seller or supervisor remaining amount and the actualAmount to put on a number
                const hasSuperVisorId = !!subAdminInfo?.superVisorId;
                let actualmaxAmountPriceBuy = 0;
                let maxLimitAmount = 0;

                if (hasSuperVisorId) {
                    // if it have supervisorId then find the superVisorlimt

                    const pipeline1 = {
                        $match: {
                            subAdmin: subAdminInfo.subAdminId._id,
                            lotteryCategoryName,
                            superVisor: superVisorId,
                        },
                    };
                    // expand all the limit and get the limit based on gameCategory
                    let superVisorLimit = await Limits.aggregate([
                        pipeline1,
                        {
                            $unwind: "$limits",
                        },
                        {
                            $match: { "limits.gameCategory": limitGameCategory },
                        },
                    ]);

                    otherLimitId = superVisorLimit[0]?._id;
                    let remainingQuantitySuperVisor = maxAmountPriceBuy;
                    if (superVisorLimit?.length > 0) {
                        let soldQuantitySuperVisor = await LimitCalc.findOne({
                            limitId: superVisorLimit[0]._id,
                            date: new Date(currentDate),
                        });

                        otherLimitCalcId = soldQuantitySuperVisor?._id;
                        // calculate sold qunatity of a number(and its reverse in MRG) in supervisor limitsCalc
                        const totalSoldQuantity = await LimitCalc.aggregate([
                            {
                                $match: {
                                    limitId: superVisorLimit[0]._id,
                                    date: new Date(currentDate),
                                },
                            },
                            {
                                $unwind: "$soldState",
                            },
                            {
                                $match: {
                                    $or: [
                                        {
                                            "soldState.gameCategory": limitGameCategory,
                                            "soldState.gameNumber": item.number,
                                        },
                                        {
                                            "soldState.gameCategory": limitGameCategory,
                                            "soldState.gameNumber": alternateNumber,
                                        },
                                    ],
                                },
                            },
                            {
                                $group: {
                                    _id: null,
                                    totalSold: { $sum: "$soldState.soldQuantity" },
                                },
                            },
                        ]);

                        const totalSoldBySuperVisor =
                            totalSoldQuantity?.length > 0
                                ? totalSoldQuantity[0]?.totalSold
                                : 0;
                        remainingQuantitySuperVisor =
                            superVisorLimit[0]?.limits?.limitsButs - totalSoldBySuperVisor;
                    }
                    // console.log(maxAmountPriceBuy,remainingQuantitySubAdmin,remainingQuantitySuperVisor )
                    actualmaxAmountPriceBuy = Math.min(
                        maxAmountPriceBuy,
                        remainingQuantitySubAdmin,
                        remainingQuantitySuperVisor
                    );
                } else {
                    // try to find seller limit if it doesnot have supervisor mean independent seller
                    const pipeline1 = {
                        $match: {
                            subAdmin: subAdminInfo.subAdminId._id,
                            lotteryCategoryName,
                            seller: sellerId,
                        },
                    };

                    sellerLimit = await Limits.aggregate([
                        pipeline1,
                        {
                            $unwind: "$limits",
                        },
                        {
                            $match: { "limits.gameCategory": limitGameCategory },
                        },
                    ]);

                    otherLimitId = sellerLimit?._id;
                    let remainingQuantitySeller = maxAmountPriceBuy;
                    if (sellerLimit?.length > 0) {
                        let soldQuantitySeller = await LimitCalc.findOne(
                            {
                                limitId: sellerLimit[0]._id,
                                date: new Date(currentDate),
                                "soldState.gameCategory": limitGameCategory,
                                "soldState.gameNumber": item.number,
                            },
                            {
                                "soldState.$": 1,
                            }
                        );

                        otherLimitCalcId = soldQuantitySeller?._id;

                        const totalSoldQuantity = await LimitCalc.aggregate([
                            {
                                $match: {
                                    limitId: sellerLimit[0]?._id,
                                    date: new Date(currentDate),
                                },
                            },
                            {
                                $unwind: "$soldState",
                            },
                            {
                                $match: {
                                    $or: [
                                        {
                                            "soldState.gameCategory": limitGameCategory,
                                            "soldState.gameNumber": item.number,
                                        },
                                        {
                                            "soldState.gameCategory": limitGameCategory,
                                            "soldState.gameNumber": alternateNumber,
                                        },
                                    ],
                                },
                            },
                            {
                                $group: {
                                    _id: null,
                                    totalSold: { $sum: "$soldState.soldQuantity" },
                                },
                            },
                        ]);

                        const totalSoldBySeller =
                            totalSoldQuantity?.length > 0
                                ? totalSoldQuantity[0].totalSold
                                : 0;
                        remainingQuantitySeller =
                            sellerLimit[0]?.limits?.limitsButs - totalSoldBySeller;
                    }
                    maxLimitAmount = remainingQuantitySeller;
                    // console.log("Line 1493: "+maxAmountPriceBuy,remainingQuantitySubAdmin,remainingQuantitySeller )
                    actualmaxAmountPriceBuy = Math.min(
                        maxAmountPriceBuy,
                        remainingQuantitySubAdmin,
                        remainingQuantitySeller
                    );
                }

                // console.log(actualmaxAmountPriceBuy)
                // console.log(item)
                // console.log("subAdminLimitsCalcId",subAdminLimitsCalcId)
                // console.log("subAdminLimitId",subAdminLimitId)
                // console.log("otherLimitCalcId",otherLimitCalcId)
                // console.log("otherLimitId",otherLimitId)

                if (subAdminLimitsCalcId) {
                    const updatedLimit = await LimitCalc.findOneAndUpdate(
                        {
                            _id: subAdminLimitsCalcId,
                            "soldState.gameCategory": limitGameCategory,
                            "soldState.gameNumber": item.number,
                        },
                        {
                            $inc: {
                                "soldState.$.soldQuantity": actualmaxAmountPriceBuy,
                            },
                        },
                        { new: true }
                    );

                    if (!updatedLimit) {
                        const newEntry = {
                            gameCategory: limitGameCategory,
                            gameNumber: item.number,
                            soldQuantity: actualmaxAmountPriceBuy,
                        };

                        // Perform the upsert
                        const upsertedLimit = await LimitCalc.findOneAndUpdate(
                            { _id: subAdminLimitsCalcId },
                            { $push: { soldState: newEntry } },
                            { new: true }
                        );
                    }
                } else {
                    if (subAdminLimitId) {
                        const newLimit = new LimitCalc({
                            limitId: subAdminLimitId,
                            date: new Date(currentDate),
                            soldState: [
                                {
                                    gameCategory: limitGameCategory,
                                    gameNumber: item.number,
                                    soldQuantity: actualmaxAmountPriceBuy,
                                },
                            ],
                        });
                        await newLimit.save();
                    }
                }

                if (otherLimitCalcId) {
                    const updatedLimit = await LimitCalc.findOneAndUpdate(
                        {
                            _id: otherLimitCalcId,
                            "soldState.gameCategory": limitGameCategory,
                            "soldState.gameNumber": item.number,
                        },
                        {
                            $inc: {
                                "soldState.$.soldQuantity": actualmaxAmountPriceBuy,
                            },
                        },
                        { new: true }
                    );
                    if (!updatedLimit) {
                        const newEntry = {
                            gameCategory: limitGameCategory,
                            gameNumber: item.number,
                            soldQuantity: actualmaxAmountPriceBuy,
                        };

                        // Perform the upsert
                        const upsertedLimit = await LimitCalc.findOneAndUpdate(
                            { _id: otherLimitCalcId },
                            { $push: { soldState: newEntry } },
                            { new: true }
                        );
                    }
                } else {
                    if (otherLimitId) {
                        const newLimit = new LimitCalc({
                            limitId: otherLimitId,
                            date: new Date(currentDate),
                            soldState: [
                                {
                                    gameCategory: limitGameCategory,
                                    gameNumber: item.number,
                                    soldQuantity: actualmaxAmountPriceBuy,
                                },
                            ],
                        });
                        await newLimit.save();
                    }
                }
                /** 
                 * confirm if there is a record in new numbers that shares the same number.
                 * if there is, check if the item amount is greater than the available amount.
                 * if it is, do not add it.
                 * else, add it as is now.
                 */
                let availableAmount = actualmaxAmountPriceBuy;

                if (
                    actualmaxAmountPriceBuy == item.amount &&
                    actualmaxAmountPriceBuy > 0
                ) {
                    let duplicateExists = new_numbers.filter(el => (cleanNumber(el.number) == cleanNumber(item.number) || cleanNumber(el.number) == cleanNumber(alternateNumber)) && el.gameCategory.toLowerCase() == "mrg");

                    if (duplicateExists.length > 0) {
                        let duplicatedAmount = duplicateExists.map(item => item.amount).reduce((amount, item) => amount + item);
                        let remainderAmount = maxLimitAmount - duplicatedAmount;
                        let netAmount = 0;
                        if (remainderAmount > 0) {
                            if (remainderAmount <= item.amount) {
                                netAmount = remainderAmount;
                            } else {
                                netAmount = item.amount;
                            }
                        }

                        if (netAmount > 0) {
                            new_numbers.push({
                                ...item,
                                amount: netAmount,
                                bonus: false,
                            });
                        }
                        limit_data.push({
                            ...item,
                            availableAmount: netAmount,
                        });

                    } else {
                        new_numbers.push({
                            ...item,
                            amount: actualmaxAmountPriceBuy,
                            bonus: false,
                        });
                    }
                } else {
                    let duplicateExists = limit_data.filter(el => (cleanNumber(el.number) == cleanNumber(item.number) || cleanNumber(el.number) == cleanNumber(alternateNumber)) && el.gameCategory == item.gameCategory);

                    if (duplicateExists.length) {
                        let duplicatedAmount = duplicateExists.map(item => item.amount).reduce((amount, item) => amount + item.amount);
                        let remainderAmount = maxLimitAmount - duplicatedAmount;
                        if (remainderAmount > 0) {
                            if (remainderAmount <= item.amount) {
                                availableAmount = remainderAmount;
                            } else {
                                availableAmount = item.amount;
                            }
                        }

                        // if(duplicateExists.availableAmount < item.amount){
                        //   availableAmount = 0;
                        // }else if(duplicateExists.availableAmount == item.amount){
                        //   let remainderAmount = actualmaxAmountPriceBuy - duplicateExists.availableAmount;
                        //   availableAmount = remainderAmount;
                        // }
                    }
                    if (availableAmount > 0)
                        new_numbers.push({
                            ...item,
                            amount: availableAmount,
                            bonus: false,
                        });
                    limit_data.push({
                        ...item,
                        availableAmount: availableAmount,
                    });
                }
                if (availableAmount > 0) {
                    acceptedAmountSum += availableAmount;
                }
            }
        }

        // It is working fine for BLT  Not tested percentage Limit Part

        if (subAdminInfo.subAdminId.bonusFlag && new_numbers.length > 0) {
            if (acceptedAmountSum >= 50 && acceptedAmountSum < 250) {
                const bonus_1 =
                    Math.floor(Math.random() * 99)
                        .toString()
                        .padStart(2, "0") +
                    "×" +
                    Math.floor(Math.random() * 99)
                        .toString()
                        .padStart(2, "0");
                const bonus_2 =
                    Math.floor(Math.random() * 99)
                        .toString()
                        .padStart(2, "0") +
                    "×" +
                    Math.floor(Math.random() * 99)
                        .toString()
                        .padStart(2, "0");
                new_numbers.push({
                    gameCategory: "MRG",
                    number: bonus_1,
                    amount: 1,
                    bonus: true,
                });
                new_numbers.push({
                    gameCategory: "MRG",
                    number: bonus_2,
                    amount: 1,
                    bonus: true,
                });
            } else if (acceptedAmountSum >= 250 && acceptedAmountSum < 1000) {
                const bonus_1 =
                    Math.floor(Math.random() * 99)
                        .toString()
                        .padStart(2, "0") +
                    "×" +
                    Math.floor(Math.random() * 99)
                        .toString()
                        .padStart(2, "0");
                const bonus_2 =
                    Math.floor(Math.random() * 99)
                        .toString()
                        .padStart(2, "0") +
                    "×" +
                    Math.floor(Math.random() * 99)
                        .toString()
                        .padStart(2, "0");
                const bonus_3 =
                    Math.floor(Math.random() * 99)
                        .toString()
                        .padStart(2, "0") +
                    "×" +
                    Math.floor(Math.random() * 99)
                        .toString()
                        .padStart(2, "0");
                const bonus_4 =
                    Math.floor(Math.random() * 99)
                        .toString()
                        .padStart(2, "0") +
                    "×" +
                    Math.floor(Math.random() * 99)
                        .toString()
                        .padStart(2, "0");
                new_numbers.push({
                    gameCategory: "MRG",
                    number: bonus_1,
                    amount: 1,
                    bonus: true,
                });
                new_numbers.push({
                    gameCategory: "MRG",
                    number: bonus_2,
                    amount: 1,
                    bonus: true,
                });
                new_numbers.push({
                    gameCategory: "MRG",
                    number: bonus_3,
                    amount: 1,
                    bonus: true,
                });
                new_numbers.push({
                    gameCategory: "MRG",
                    number: bonus_4,
                    amount: 1,
                    bonus: true,
                });
            } else if (acceptedAmountSum >= 1000) {
                const bonus_1 =
                    Math.floor(Math.random() * 99)
                        .toString()
                        .padStart(2, "0") +
                    "×" +
                    Math.floor(Math.random() * 99)
                        .toString()
                        .padStart(2, "0");
                const bonus_2 =
                    Math.floor(Math.random() * 99)
                        .toString()
                        .padStart(2, "0") +
                    "×" +
                    Math.floor(Math.random() * 99)
                        .toString()
                        .padStart(2, "0");
                const bonus_3 =
                    Math.floor(Math.random() * 99)
                        .toString()
                        .padStart(2, "0") +
                    "×" +
                    Math.floor(Math.random() * 99)
                        .toString()
                        .padStart(2, "0");
                const bonus_4 =
                    Math.floor(Math.random() * 99)
                        .toString()
                        .padStart(2, "0") +
                    "×" +
                    Math.floor(Math.random() * 99)
                        .toString()
                        .padStart(2, "0");
                const bonus_5 =
                    Math.floor(Math.random() * 99)
                        .toString()
                        .padStart(2, "0") +
                    "×" +
                    Math.floor(Math.random() * 99)
                        .toString()
                        .padStart(2, "0");
                new_numbers.push({
                    gameCategory: "MRG",
                    number: bonus_1,
                    amount: 1,
                    bonus: true,
                });
                new_numbers.push({
                    gameCategory: "MRG",
                    number: bonus_2,
                    amount: 1,
                    bonus: true,
                });
                new_numbers.push({
                    gameCategory: "MRG",
                    number: bonus_3,
                    amount: 1,
                    bonus: true,
                });
                new_numbers.push({
                    gameCategory: "MRG",
                    number: bonus_4,
                    amount: 1,
                    bonus: true,
                });
                new_numbers.push({
                    gameCategory: "MRG",
                    number: bonus_5,
                    amount: 1,
                    bonus: true,
                });
            }
        }

        return { success: true, block_data, limit_data, new_numbers };
    } catch (error) {
        console.log("ticket check error: ", error);
        return { success: false, error: error };
    }
}

module.exports = requestTicketCheck;