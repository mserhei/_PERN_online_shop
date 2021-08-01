const ApiError = require("../error/ApiError");
const { Rating, Device } = require("../models/models.js");

class RateController {
  async create(req, res, next) {
    try {
      const { userId, deviceId, rate } = req.body;

      const rating = await Rating.create({
        userId,
        deviceId,
        rate,
      });

      const allDeviceRatings = await Rating.findAndCountAll({
        where: { deviceId },
      });
      let ratesSum = 0;
      allDeviceRatings.rows.forEach((row) => (ratesSum += row.rate));
      const averageRate =
        Math.round((ratesSum / allDeviceRatings.count) * 10) / 10;

      const targetDevice = await Device.findOne({
        where: { id: deviceId },
      });
      targetDevice.rating = +averageRate;
      await targetDevice.save();

      return res.json(targetDevice);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getUserDeviceRate(req, res, next) {
    try {
      let { userId, deviceId } = req.query;
      const userDeviceRate = await Rating.findOne({
        where: { userId, deviceId },
      });

      return res.json(userDeviceRate);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new RateController();
