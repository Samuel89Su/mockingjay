exports = module.exports =
{
    "type": "object",
    "properties": {
        "staticRoot": {
            "type":"string",
            "minLength": 2
        },
        "fiddleAspRoute": {
            "type":"boolean"
        },
        "changeOrigin": {
            "type":"boolean"
        },
        "xmlHttRequestTarget": {
            "type":"string",
            "pattern": "((http[s]?)://)?(?<=//|)(((\\w)+\\.)+\\w+)(\\:(\\d+))?$"
        },
        "context": {
            "anyOf": [
                {
                    "type": "string",
                    "minLength": 1
                }, 
                {
                    "type":"array",
                    "items": {
                        "type":"string",
                        "minLength":1
                    }
                }
            ]
        },
        "target": {
            "type":"string",
            "pattern": "((http[s]?)://)?(?<=//|)(((\\w)+\\.)+\\w+)(\\:(\\d+))?$"
        },
        "router": {
            "type":"object"
        },
        "regExpRoutes": {
            "type":"array",
            "items": {
                "type":"object",
                "properties": {
                    "regExp": {
                        "type":"string",
                        "minLength":3
                    },
                    "target":{
                        "type":"string",
                        "pattern": "((http[s]?)://)?(?<=//|)(((\\w)+\\.)+\\w+)(\\:(\\d+))?$"
                    }
                },
                "required": ["regExp", "target"]
            }
        }
    },
    "required": ["context","target"]
}