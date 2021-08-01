const Router = require("express");
const router = new Router();
const rateController = require("../controllers/rateController");

router.post("/", rateController.create);
router.get("/", rateController.getUserDeviceRate);

module.exports = router;
