let express = require("express");
let router = express.Router();
router.use('/article', require("./article"));
router.use('/home', require("./home"));
router.use('/backLogin',require("./backLogin"));
router.use('/backClassify',require("./backClassify"));
router.use('/personalData',require("./personalData"));
router.use('/showArticle',require("./showArticle"));
router.use('/personalShow',require("./personalShow"));
router.use('/categories',require("./categories"));
router.use('/time',require("./time"));
router.use('/search',require("./search"));
module.exports = router;
