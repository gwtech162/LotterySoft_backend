const WebSocket = require("ws");
const mongoose = require("mongoose");
const db = require("../app/models");
const BlockNumber = db.blockNumber;
const Limits = db.limits;
const LimitCalc = db.limitCalc;

const EventEmitter = require("events");

const eventEmitter = new EventEmitter();

const socketServer = (httpServer) => {
  const wss = new WebSocket.Server({ port: 5000, httpServer });

  wss.on("connection", async (socket) => {
    console.log("New client connected!");

    socket.on("message", async (message) => {
      const data = JSON.parse(message);
      let {
        lotteryCategoryName,
        gameCategory,
        number,
        quantity,
        subAdminId,
        sellerId,
        type,
        selectRowNumber,
      } = data;

      let blocked = null;
      let limit = null;
      let restQuantity = null;

      let limitGameCategory = gameCategory;

      if (
        gameCategory == "L4C 1" ||
        gameCategory == "L4C 2" ||
        gameCategory == "L4C 3"
      ) {
        limitGameCategory = "L4C";
      }

      if (gameCategory == "L5C 1" || gameCategory == "L5C 2" || gameCategory == "L5C 3") {
        limitGameCategory = "L5C";
      }

      if (type === "check") {
        try {
          blocked = await BlockNumber.findOne({
            subAdmin: mongoose.Types.ObjectId(subAdminId),
            lotteryCategoryName,
            gameCategory,
            number,
          });

          if (blocked) {
            socket.send(
              JSON.stringify({
                type: "blockNumberChecked",
                message: `${number} is blocked`,
              })
            );
          } else {
            limit = await Limits.findOne(
              {
                subAdmin: mongoose.Types.ObjectId(subAdminId),
                lotteryCategoryName,
                seller: mongoose.Types.ObjectId(sellerId),
                "limits.gameCategory": limitGameCategory,
                "limits.gameNumber": number,
              },
              {
                "limits.$": 1,
              }
            );

            if (limit == null) {
              limit = await Limits.findOne(
                {
                  subAdmin: mongoose.Types.ObjectId(subAdminId),
                  lotteryCategoryName,
                  "limits.gameCategory": limitGameCategory,
                  "limits.gameNumber": number,
                },
                {
                  "limits.$": 1,
                }
              );
            }

            if (limit == null) {
              limit = await Limits.findOne(
                {
                  subAdmin: mongoose.Types.ObjectId(subAdminId),
                  lotteryCategoryName,
                  seller: mongoose.Types.ObjectId(sellerId),
                  "limits.gameCategory": limitGameCategory,
                },
                {
                  "limits.$": 1,
                }
              );
            }

            if (limit == null) {
              limit = await Limits.findOne(
                {
                  subAdmin: mongoose.Types.ObjectId(subAdminId),
                  lotteryCategoryName,
                  "limits.gameCategory": limitGameCategory,
                },
                {
                  "limits.$": 1,
                }
              );
            }

            if (limit) {
              const limitCalc = await LimitCalc.findOne(
                {
                  limitId: limit._id,
                  "soldState.gameCategory": limitGameCategory,
                  "soldState.gameNumber": number,
                },
                {
                  "soldState.$": 1,
                }
              );

              if (limitCalc) {
                restQuantity =
                  limit.limits[0].limitsButs -
                  limitCalc.soldState[0].soldQuantity;

                if (quantity <= restQuantity) {
                  eventEmitter.emit("updateSoldQuantity", {
                    _id: limitCalc._id,
                    gameCategory: limitGameCategory,
                    number,
                    quantity,
                  });

                  socket.send(
                    JSON.stringify({
                      type: "successed",
                      gameCategory: gameCategory,
                      gameNumber: number,
                      amount: quantity,
                    })
                  );
                } else {
                  socket.send(
                    JSON.stringify({
                      type: "limitNumberChecked",
                      message: `Rest amount is ${restQuantity}`,
                    })
                  );
                }
              } else {
                if (quantity <= limit.limits[0].limitsButs) {
                  eventEmitter.emit("newSoldQuantity", {
                    limitId: limit._id,
                    gameCategory: limitGameCategory,
                    number,
                    quantity,
                  });

                  socket.send(
                    JSON.stringify({
                      type: "successed",
                      gameCategory: gameCategory,
                      gameNumber: number,
                      amount: quantity,
                    })
                  );
                } else {
                  socket.send(
                    JSON.stringify({
                      type: "limitNumberChecked",
                      message: `Max amount is ${limit.limits[0].limitsButs}`,
                    })
                  );
                }
              }
            } else {
              socket.send(
                JSON.stringify({
                  type: "successed",
                  gameCategory: gameCategory,
                  gameNumber: number,
                  amount: quantity,
                })
              );
            }
          }
        } catch (err) {
          console.log(err);
        }
      } else if (
        data.type === "deleteSoldQuantity" ||
        data.type === "resetTicketSoldInfo"
      ) {
        limit = await Limits.findOne(
          {
            subAdmin: mongoose.Types.ObjectId(subAdminId),
            lotteryCategoryName,
            seller: mongoose.Types.ObjectId(sellerId),
            "limits.gameCategory": limitGameCategory,
            "limits.gameNumber": number,
          },
          {
            "limits.$": 1,
          }
        );

        if (limit == null) {
          limit = await Limits.findOne(
            {
              subAdmin: mongoose.Types.ObjectId(subAdminId),
              lotteryCategoryName,
              "limits.gameCategory": limitGameCategory,
              "limits.gameNumber": number,
            },
            {
              "limits.$": 1,
            }
          );
        }

        if (limit == null) {
          limit = await Limits.findOne(
            {
              subAdmin: mongoose.Types.ObjectId(subAdminId),
              lotteryCategoryName,
              seller: mongoose.Types.ObjectId(sellerId),
              "limits.gameCategory": limitGameCategory,
            },
            {
              "limits.$": 1,
            }
          );
        }

        if (limit == null) {
          limit = await Limits.findOne(
            {
              subAdmin: mongoose.Types.ObjectId(subAdminId),
              lotteryCategoryName,
              "limits.gameCategory": limitGameCategory,
            },
            {
              "limits.$": 1,
            }
          );
        }

        if (limit) {
          eventEmitter.emit("deleteSoldQuantity", {
            limitId: limit._id,
            gameCategory: limitGameCategory,
            number,
            quantity,
          });
        }

        if (data.type === "resetTicketSoldInfo") {
          socket.send(
            JSON.stringify({
              type: "reset",
            })
          );
        } else {
          socket.send(
            JSON.stringify({
              type: "delete",
              selectRow: selectRowNumber,
            })
          );
        }
      }
    });

    socket.on("error", (error) => {
      console.error("An error occurred:", error);
    });

    socket.on("close", () => {
      console.log("Client disconnected!");
    });
  });

  eventEmitter.on("newSoldQuantity", async (data) => {
    const { limitId, gameCategory, number, quantity } = data;

    const limitCalc = await LimitCalc.findOne({ limitId });

    if (limitCalc) {
      limitCalc.soldState.push({
        gameCategory: gameCategory,
        gameNumber: number,
        soldQuantity: quantity,
      });

      await limitCalc.save();
    } else {
      const newLimitCalc = new LimitCalc({
        limitId: limitId,
        soldState: [
          {
            gameCategory: gameCategory,
            gameNumber: number,
            soldQuantity: quantity,
          },
        ],
      });

      await newLimitCalc.save();
    }
  });

  // Listen for the newSoldQuantity event and update the sold quantity field in the Limits model
  eventEmitter.on("updateSoldQuantity", async (data) => {
    const { _id, gameCategory, number, quantity } = data;
    await LimitCalc.findOneAndUpdate(
      {
        _id,
        "soldState.gameCategory": gameCategory,
        "soldState.gameNumber": number,
      },
      {
        $inc: {
          "soldState.$.soldQuantity": quantity,
        },
      },
      { new: true }
    );
  });

  // Listen for the deleteSoldQuantity event and update the sold quantity field in the Limits model
  eventEmitter.on("deleteSoldQuantity", async (data) => {
    const { limitId, gameCategory, number, quantity } = data;
    await LimitCalc.findOneAndUpdate(
      {
        limitId: limitId,
        "soldState.gameCategory": gameCategory,
        "soldState.gameNumber": number,
      },
      {
        $inc: {
          "soldState.$.soldQuantity": -quantity,
        },
      },
      { new: true }
    );
  });
};

module.exports = socketServer;
