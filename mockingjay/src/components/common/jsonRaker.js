function rake(json, schema) {
    if (!json || !schema) {
        return
    } else if (typeof json !== 'object' && typeof json !== 'array') {
        return
    } else if (json instanceof Array) {
        for (let index = 0; index < json.length; index++) {
            const item = json[index];
            rake(item, schema.items)
        }
    } else if (typeof json === 'object') {
        for (const key in json) {
            if (json.hasOwnProperty(key)) {
                const prop = json[key];
                if (!schema.properties[key]) {
                    delete json[key]
                } else {
                    rake(prop, schema.properties[key])
                }
            }
        }
    }
}

exports = module.exports = rake

// let json = {
//     classId: 123,
//     master: {
//         id: 432,
//         name: 'jkjk',
//         hobbies: [
//             'basketball', 'hiking'
//         ],
//         cellphone: '555'
//     },
//     students: [
//         {
//             id: 987,
//             name: 'fgfggf',
//             emergencyContact: {
//                 name: 'papa',
//                 cellphone: '999',
//                 telephone: '6543'
//             },
//             nick: 'piggy'
//         }
//     ],
//     courses: [
//         'math', 'chinese', 'english'
//     ]
// }

// let schema = {
//     type: 'object',
//     properties: {
//         classId: {
//             type: 'integer'
//         },
//         master: {
//             type: 'object',
//             properties: {
//                 id: {
//                     type: 'integer'
//                 },
//                 name: {
//                     type: 'string'
//                 },
//                 hobbies: {
//                     type: 'array',
//                     items: {
//                         type: 'string'
//                     }
//                 }
//             }
//         },
//         students: {
//             type: 'array',
//             items: {
//                 type: 'object',
//                 properties: {
//                     id: {
//                         type: 'integer'
//                     },
//                     name: {
//                         type: 'string'
//                     },
//                     emergencyContact: {
//                         type: 'object',
//                         properties: {
//                             name: {
//                                 type: 'string'
//                             },
//                             cellphone: {
//                                 type: 'string'
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     }
// }

// rake(json, schema)
// console.log(JSON.stringify(json))