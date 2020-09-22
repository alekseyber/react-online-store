const passport = require('passport')
const { Router } = require('express')
const {
    getListModel,
    getItemModelByField,
    getItemByIdModel,
    getCountFromModel,
    editModel,
    deleteModelById,
    createModel,
    getShemaModel,
    getCheckUniqFromModel,
    getListModelsArray,
    getListModelByIds,
    getSatisStatistic
} = require('../controllers/satis.contorller')
const router = Router()



// /api/satis/getlist
router.get(
    '/getlist/:modelName',
    passport.authenticate('jwt', { session: false }),
    getListModel
)

// /api/satis/getlistarray
router.get(
    '/getlistarray',
    passport.authenticate('jwt', { session: false }),
    getListModelsArray
)

// /api/satis/getitembyfield
router.get(
    '/getitembyfield/:modelName',
    passport.authenticate('jwt', { session: false }),
    getItemModelByField
)

// /api/satis/getitembyid
router.get(
    '/getitembyid/:modelName/:_id',
    passport.authenticate('jwt', { session: false }),
    getItemByIdModel
)

// /api/satis/getcount
router.get(
    '/getcount/:modelName',
    passport.authenticate('jwt', { session: false }),
    getCountFromModel
)

// /api/satis/getcheckuniq
router.get(
    '/getcheckuniq/:modelName',
    passport.authenticate('jwt', { session: false }),
    getCheckUniqFromModel
)
// /api/satis/getshema
router.get(
    '/getshema/:modelName',
    passport.authenticate('jwt', { session: false }),
    getShemaModel
)

// /api/satis/edit
router.put(
    '/edit/:modelName/:_id',
    passport.authenticate('jwt', { session: false }),
    editModel
)

// /api/satis/delete
router.delete(
    '/delete/:modelName/:_id',
    passport.authenticate('jwt', { session: false }),
    deleteModelById
)

// /api/satis/create
router.put(
    '/create/:modelName',
    passport.authenticate('jwt', { session: false }),
    createModel
)

// /api/satis/getlistbyids
router.get(
    '/getlistbyids/:modelName',
    passport.authenticate('jwt', { session: false }),
    getListModelByIds
)

// /api/satis/getstatistic
router.get(
    '/getstatistic/:grupp',
    passport.authenticate('jwt', { session: false }),
    getSatisStatistic
)

module.exports = router