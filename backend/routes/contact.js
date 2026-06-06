// routes/contact.js
const router               = require('express').Router();
const ctrl                 = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/',          ctrl.send);
router.get('/',           protect, adminOnly, ctrl.getAll);
router.patch('/:id/read', protect, adminOnly, ctrl.markRead);
router.delete('/:id',     protect, adminOnly, ctrl.remove);

module.exports = router;
