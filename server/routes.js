const router = require('express').Router();
const api_controller = require('./Routes/api');

router.get('/post', api_controller.get_post);
router.get('/post/:group', api_controller.get_post);
router.get('/group', api_controller.get_group);
router.post('/post', api_controller.post_submission);
router.post('/group', api_controller.update_group);
router.delete('/group/:group_name/:username', api_controller.remove_group);

module.exports = {
    router: router,
}