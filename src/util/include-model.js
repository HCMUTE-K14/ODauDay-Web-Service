const Tag = require("../model/index").Tag;
const Category = require("../model/index").Category;
const Feature = require("../model/index").Feature;
const Email = require("../model/index").Email;
const Phone = require("../model/index").Phone;
const Image = require("../model/index").Image;
function getModelProperty(){
    let result=[
        {
            model: Feature,
            as: 'features',
            attributes: ['id', 'name']
        },
        {
            model: Tag,
            as: 'tags',
            attributes: {
                exclude: ['PropertyTag']
            },
            through: { attributes: [] }
        },
        {
            model: Category,
            as: 'categorys',
            attributes: {
                exclude: ['PropertyCategory']
            },
            through: { attributes: [] }
        },
        {
            model: Email,
            as:'emails',
            attributes: ['id', 'name', 'email']
        },
        {
            model: Phone,
            as:'phones',
            attributes: ['id', 'name', 'phone_number']
        },
        {
            model: Image,
            as:'images',
            attributes: ['id', 'url']
        }
    ];
    return result;
}
module.exports.getModelProperty=getModelProperty;