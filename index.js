const App = require('./src/app');
const DB = require('./src/model/index');
const Connection = require('./src/database/connection');

const Logger = require('./src/logger');

App.listen(App.get('port'), () => {
    Logger.info(`Application run at port ${App.get('port')}`);
    DB.sequelize.sync()
        .then(() => {
            Logger.info('Connected to database at ' + new Date());
        })
        .catch(error => {
            Logger.info(error);
            Logger.info('Can not connect to database');
        });
});

// insertCategories();
// insertTags();
//insertPremium();
// testSimilarProperty();
// async function testSimilarProperty() {
//     let data = await DB.Property.findAll();
//     for (let i = 0; i < data.length; i++) {
//         let id = data[i].id
//         DB.sequelize.query('CALL similar_property($propertyId)', {
//             bind: {
//                 propertyId: data[i].id
//             }
//         })
//         .then(property => {
//             console.log(property);
//         })
//     }
// }
async function insertPremium() {
    try {
        await DB.Premium.bulkCreate([
            { id: '0', description: 'Bronze', name: 'Bronze', value: 1000, real_value: 10000, status: 'active' },
            { id: '1', description: 'Silver', name: 'Silver', value: 6000, real_value: 50000, status: 'active' },
            { id: '2', description: 'Gold', name: 'Gold', value: 12000, real_value: 100000, status: 'active' }
        ]);
    } catch (error) {
        console.log(error);
    }

}

async function insertCategories() {
    await DB.Category.bulkCreate([
        { id: '0', name: 'Apartment' },
        { id: '1', name: 'First-Level house' },
        { id: '2', name: 'Second-Level house' },
        { id: '3', name: 'Third-Level house' },
        { id: '4', name: 'Four-Level house' },
        { id: '5', name: 'Land' }
    ]);
}

async function insertTags() {
    await DB.Tag.bulkCreate([
        { id: '0', name: 'Air conditioning' },
        { id: '1', name: 'Alarm System' },
        { id: '2', name: 'Balcony / Deck' },
        { id: '3', name: 'Bath' },
        { id: '4', name: 'Broadband internet access' },
        { id: '5', name: 'Built in wardrobes' },
        { id: '6', name: 'Cable or Satellite' },
        { id: '7', name: 'City Views' },
        { id: '8', name: 'Dishwasher' },
        { id: '9', name: 'Double glazed windows' },
        { id: '10', name: 'Energy efficient appliances' },
        { id: '11', name: 'Ensuite' },
        { id: '12', name: 'Fireplace(s)' },
        { id: '13', name: 'Floorboards' },
        { id: '14', name: 'Fully fenced' },
        { id: '15', name: 'Furnished' },
        { id: '16', name: 'Garden / Courtyard' },
        { id: '17', name: 'Gas' },
        { id: '18', name: 'Greywater system' },
        { id: '19', name: 'Ground floor' },
        { id: '20', name: 'Gym' },
        { id: '21', name: 'Heating' },
        { id: '22', name: 'Indoor Spa' },
        { id: '23', name: 'Air conditioning' },
        { id: '24', name: 'Intercom' },
        { id: '25', name: 'Internal Laundry' },
        { id: '26', name: 'North Facing' },
        { id: '27', name: 'Outdoor Spa' },
        { id: '28', name: 'Pets Allowed' },
        { id: '29', name: 'Rainwater storage tank' },
        { id: '30', name: 'Separate Dining Room' },
        { id: '31', name: 'Shed' },
        { id: '32', name: 'Solar hot water' },
        { id: '33', name: 'Solar panels' },
        { id: '34', name: 'Study' },
        { id: '35', name: 'Swimming Pool' },
        { id: '36', name: 'Tennis Court' },
        { id: '37', name: 'Wall / ceiling insulation' },
        { id: '38', name: 'Water efficient appliances' },
        { id: '39', name: 'Water efficient fixtures' },
        { id: '40', name: 'Water Views' }
    ]);
}

// DB.User.create({
//  email: 'daohuuloc9419@gmail.com',
//  password: '123456',
//  display_name: 'infamouSs'
// })
// .then(data => {
//  data.addProperty({
//      name: 'nameProperty',
//      code: '123',
//      latitude: 0,
//      longitude: 0,
//      postcode: 1000,
//      status: 'ok',
//      price: 700,
//      land_size: 10
//  });
// })
// .catch(error => {
//  console.log(error);
// })
// insertUser();
//insertProperty();
// async function insertUser() {
//  try {
//      let listUser = [];

//      for (let i = 0; i < 10; i++) {
//          listUser.push({
//              id: '' + i,
//              email: "#" + i + '@gmail.com',
//              password: '123456',
//              display_name: 'DISPLAYNAME #' + i
//          });
//      }
//      await DB.User.create(listUser[0]);
//      await DB.User.bulkCreate(listUser.splice(1));
//  } catch (error) {
//      console.log(error);
//  }
// }

function generateRandomNumber() {
    var min = 0.005;
    var max = 0.1;
    return Math.random() * (max - min) + min;
};
let a = 8000000;
let value = 500;
let dataPrice = [];
while (value <= a) {
    if (value <= 2000) {
        value = value + 50;
    } else if (value > 2000 && value <= 10000) {
        value = value + 500 - 50;
    } else if (value > 10000 && value <= 100000) {
        value = value + 1000 - 50;
    } else if (value > 100000 && value <= 200000) {
        value = value + 5000 - 50;
    } else if (value > 200000 && value <= 500000) {
        value = value + 10000 - 50;
    } else if (value > 500000 && value <= 1000000) {
        value = value + 50000 - 50;
    } else {
        value = value + 1000000 - 50;
    }
    dataPrice.push(value);
}

function getRandomPrice(typeId) {
    let price = dataPrice;
    if (typeId === 'RENT') {
        price = price.slice(0, 165);
    }
    var number = Math.floor(Math.random() * price.length);
    return price[number] * 1000;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function getRandomTypeId() {
    var type = ['BUY', 'RENT'];
    var number = Math.floor(Math.random() * type.length);
    return type[number];
}

function getRandomImage(typeId) {
    let living = [];
    for (let i = 0; i < 15; i++) {
        living.push(`living_${i + 1}`);
    }

    let bathroom = [];
    for (let i = 0; i < 15; i++) {
        bathroom.push(`bathroom_${i + 1}`);
    }

    let rent = [];
    for (let i = 0; i < 15; i++) {
        rent.push(`rent_${i + 1}`);
    }

    let indexLiving = Math.floor(Math.random() * living.length);
    let indexBathroom = Math.floor(Math.random() * bathroom.length);
    let indexRent = Math.floor(Math.random() * rent.length);

    if (typeId === 'RENT') {
        return [
            { url: 'image/' + rent[Math.floor(Math.random() * rent.length)] },
            { url: 'image/' + rent[Math.floor(Math.random() * rent.length)] },
            { url: 'image/' + rent[Math.floor(Math.random() * rent.length)] }
        ];
    }

    return [
        { url: 'image/' + living[indexLiving] },
        { url: 'image/' + living[Math.floor(Math.random() * living.length)] },
        { url: 'image/' + bathroom[indexBathroom] },
        { url: 'image/' + bathroom[indexBathroom] }
    ];
}
// let json = require('./raw/tt.json');
 //insertProperty();

async function insertProperty() {
    try {
        let listProperty = [];
        let currentDate = new Date();
        for (let i = 0; i < json.length; i++) {
            let typeId = getRandomTypeId();
            let property = {
                address: json[i].address,
                code: 'code#' + i,
                latitude: json[i].location.lat,
                longitude: json[i].location.long,
                status: 'active',
                postcode: 8000,
                price: getRandomPrice(typeId),
                num_of_bedroom: getRandomInt(1, 5),
                num_of_bathroom: getRandomInt(1, 3),
                num_of_parking: getRandomInt(0, 3),
                land_size: getRandomInt(20, 1000),
                date_end: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000 * 30),
                user_id_created: '1',
                type_id: typeId,
                emails: [{
                    email: "daohuuloc9419@gmail.com"
                }],
                phones: [{
                    phone_number: "01254709525"
                }],
                images: getRandomImage(typeId)
            };
            await DB.Property.create(property, {
                include: [{
                        model: DB.Email,
                        as: 'emails',
                        attributes: ['id', 'email']
                    },
                    {
                        model: DB.Phone,
                        as: 'phones',
                        attributes: ['id', 'phone_number']
                    },
                    {
                        model: DB.Image,
                        as: 'images',
                        attributes: ['id', 'url']
                    }
                ]
            });
        }
        // await DB.Property.bulkCreate(listProperty,);
    } catch (error) {
        console.log(error);
    }
}