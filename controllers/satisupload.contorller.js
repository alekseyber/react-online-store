const path = require('path');
const fs = require('fs');
const moment = require('moment');
const md5 = require('js-md5');
const Params = require('../models/params.model')
const sharp = require('sharp');


function getFileName(originalname) {

    try {
        const temp = originalname.split('.');
        const ext = temp[temp.length - 1];
        const name = md5(moment().format('DDMMYY-HHmmss_SSS') + String(Math.random())) + '.' + ext;
        return name;

    } catch (e) {
        console.error(e.message)
    }
}
function strTrim(str, searchValue = '/') {

    if (str.indexOf(searchValue) === 0) {
        str = str.substring(1)
    }
    if (str.substr(-1, 1) === searchValue) {
        str = str.substring(0, (str.length - 1))
    }

    return str
}
function getNewDestination(addPatch) {
    const staticDestination = path.resolve(__dirname, '../..', 'static');
    let newDestination = staticDestination;

    addPatch = strTrim(addPatch);

    const arrTemp = addPatch.split('/');
    arrTemp.forEach(el => {
        newDestination = path.join(newDestination, el);
    })

    return newDestination
}

async function getParams(modelName) {
    const rezult = {
        err: false,
        categoryImgProperty: "",
        productImgProperty: []
    }
    try {
        if (modelName === 'product' || modelName === 'category') {

            const doc = await Params.findOne({ select: true }, {
                _id: 0,
                categoryImgProperty: 1,
                productImgProperty: 1
            });
            if (doc) {
                rezult.categoryImgProperty = doc.categoryImgProperty;
                rezult.productImgProperty = doc.productImgProperty;
            } else {
                rezult.err = true
            }
        }
    } catch (e) {
        rezult.err = true
    }
    return rezult
}
async function saveFile(modelName, file, { categoryImgProperty, productImgProperty }) {
    const rezult = {
        err: false,
        returnPath: ''
    }
    try {
        const addPath = (modelName !== undefined) ? modelName : '';
        const addReturnPath = addPath ? `/${addPath}` : '';
        const filename = getFileName(file.originalname);
        let returnPath = `/images${addReturnPath}/${filename}`;
        let newDestination = path.resolve(__dirname, '../..', 'static', 'images', addPath);
        const fileBuffer = file.buffer;

        if (modelName === 'product' || modelName === 'category') {
            returnPath = filename;
            if (modelName === 'category') {
                newDestination = getNewDestination(categoryImgProperty);
            }
        }
        if (modelName === 'product') {
            if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
                for (const item of productImgProperty) {
                    newDestination = getNewDestination(item.path);
                    newPathProductItem = path.join(newDestination, filename);
                    const img_height = item.img_height;
                    const img_width = item.img_width;
                    if (!fs.existsSync(newDestination)) {
                        fs.mkdirSync(newDestination)
                    }
                    await sharp(fileBuffer)
                        .resize({
                            width: img_width,
                            height: img_height
                        })
                        .toFile(newPathProductItem)
                }
                rezult.returnPath = returnPath;
                return rezult;
            } else {
                rezult.err = true
                return rezult
            }

        } else {
            const newPath = path.join(newDestination, filename);
            if (!fs.existsSync(newDestination)) {
                fs.mkdirSync(newDestination)
            }
            //  const oldPath = file.path;        
            // fs.copyFileSync(file.buffer, newPath);            
            fs.writeFileSync(newPath, fileBuffer);
            rezult.returnPath = returnPath;
            // fs.copyFileSync(newPath, oldPath);
            //  fs.unlinkSync(oldPath);
        }


    } catch (e) {
        rezult.err = true;
        console.error(e.message)
    }

    return rezult;
}

// module.exports.getDirectory = async (req, res) => {
//     try {
//         //  const modelName = req.query.modelName;
//         //  const modelName = req.params.modelName     


//         res.status(200).send('ok');
//         //   res.status(200).json(docs);


//     } catch (e) {
//         console.error(e.message)
//         res.status(500).send(e.message);
//     }


// }

module.exports.uploadSingle = async (req, res) => {
    try {
        const file = req.file;
        const rezult = {
            filename: ''
        }
        //console.log(file)
        if (file) {
            const modelName = req.params.modelName;
            const params = await getParams(modelName);
            if (params.err) {
                res.status(500).send('Ошибка получения params');
            } else {
                const saveStatus = await saveFile(modelName, file, params);
                if (!saveStatus.err) {
                    rezult.filename = saveStatus.returnPath;
                    res.status(201).json(rezult);
                } else {
                    res.status(500).send('Ошибка сохранения файла');
                }
            }

        } else {
            res.status(400).send('Файл не передан');
        }


    } catch (e) {
        console.error(e.message)
        res.status(500).send('Ошибка обработки на сервере');
    }
}



module.exports.uploadArray = async (req, res) => {
    try {
        const modelName = req.params.modelName;
        const files = req.files;
        if (files.length) {
            const params = await getParams(modelName);
            if (params.err) {
                res.status(500).send('Ошибка получения params');
            } else {
                const filesName = [];
                for (const file of files) {
                    const saveStatusItem = await saveFile(modelName, file, params);
                    if (!saveStatusItem.err) {
                        filesName.push(saveStatusItem.returnPath);
                    }
                }
                if (filesName.length) {
                    res.status(201).json({ filesName });
                } else {
                    res.status(400).send('Ошибка сохранения файлов');
                }
            }

        } else {
            res.status(400).send('Файлы не переданы');
        }

    } catch (e) {
        console.error(e.message)
        res.status(500).send(e.message);
    }
}