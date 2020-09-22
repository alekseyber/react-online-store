const getModel = require('../models/requireModel');



function strstr(string, converter) {

    Object.keys(converter).forEach(needle => {
        if (string.indexOf(needle) !== -1) {
            const regexp = new RegExp(needle, 'g');
            string = string.replace(regexp, converter[needle]);
        }
    })

    return string

}


function rus2translit(string) {

    const converter = {
        'а': 'a', 'б': 'b', 'в': 'v',
        'г': 'g', 'д': 'd', 'е': 'e',
        'ё': 'e', 'ж': 'zh', 'з': 'z',
        'и': 'i', 'й': 'y', 'к': 'k',
        'л': 'l', 'м': 'm', 'н': 'n',
        'о': 'o', 'п': 'p', 'р': 'r',
        'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'c',
        'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ь': '\'', 'ы': 'y', 'ъ': '\'',
        'э': 'e', 'ю': 'yu', 'я': 'ya',
        'А': 'A', 'Б': 'B', 'В': 'V',
        'Г': 'G', 'Д': 'D', 'Е': 'E',
        'Ё': 'E', 'Ж': 'Zh', 'З': 'Z',
        'И': 'I', 'Й': 'Y', 'К': 'K',
        'Л': 'L', 'М': 'M', 'Н': 'N',
        'О': 'O', 'П': 'P', 'Р': 'R',
        'С': 'S', 'Т': 'T', 'У': 'U',
        'Ф': 'F', 'Х': 'H', 'Ц': 'C',
        'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch',
        'Ь': '\'', 'Ы': 'Y', 'Ъ': '\'',
        'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya',
    }

    return strstr(string, converter);
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


async function getCount(modelName, path, alias, _id, child_id) {
    try {
        const filter = {};
        let countDocuments = 0;
        if (_id) {
            if (!child_id) {
                filter._id = { $ne: _id };
            }
        }

        filter[path] = alias;
        const Model = getModel(modelName);

        countDocuments = await Model.find(filter).countDocuments();
        if (countDocuments === 1 && child_id) {
            const parentArr = path.split('.', 2);
            if (parentArr.length) {
                const parent = parentArr[0] + '.$.';
                const projection = {
                    _id: 0
                };
                projection[parent] = 1;
                docs = await Model.find(filter, projection);
                if (docs) {
                    const item = docs[0][parentArr[0]][0];
              //console.log(filter, projection, _id, item._id, (String(_id) === String(item._id)))
                    if (String(_id) === String(item._id)) {
                        countDocuments = 0;
                    }
                }

            } else {
                throw new Error('path не соответствует дочернему документу');
            }
        }

        return countDocuments;

    } catch (e) {
        console.error(e)
        throw new Error(e.message);
    }

}


function str2url(str) {
    str = String(str);
    //str = str.trim();
    // переводим в транслит
    str = rus2translit(str);
    // в нижний регистр
    str = str.toLowerCase();
    // заменям все ненужное нам на "-"
    const regexp = new RegExp('[^-a-z0-9_]+', 'g');
    str = str.replace(regexp, '-');

    // удаляем начальные и конечные '-'
    str = strTrim(str, "-");
    // ограничиваем длину
    if (str.length > 55) {
        str = str.substring(0, 56);
    }

    return str;
}

async function createAlias(modelName, title, path = 'alias', alias = '', _id = '', addStr = '', child_id = false) {
    try {

        let count = 0;

        if (alias) {
            count = await getCount(modelName, path, alias, _id, child_id);
            if (count === 0) {
                return alias
            }
        }
        let candidate = '';
        if (!title && !_id) {
            return candidate
        }

        if (!title) {
            candidate = String(_id);
        } else {
            candidate = str2url(title);
        }

        count = await getCount(modelName, path, candidate, _id, child_id);

        if (count === 0) {
            return candidate
        }

        if (addStr) {
            addStr = str2url(addStr);
            candidate += `-${addStr}`;

            count = await getCount(modelName, path, candidate, _id, child_id);
            if (count === 0) {
                return candidate
            }
        }
        const iterator = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
        for (const item of iterator) {
            const newCandidate = `${candidate}-${item}`;

            const countIterat = await getCount(modelName, path, newCandidate, _id, child_id);

            if (countIterat === 0) {
                candidate = newCandidate;
                break;
            }

        }
        return candidate
    } catch (e) {
        console.error(e)
        throw new Error(e.message);
    }
}


module.exports = async (modelName, title, path = 'alias', alias = '', _id = '', addStr = '', child_id = false) => {
    return await createAlias(modelName, title, path, alias, _id, addStr, child_id);
};