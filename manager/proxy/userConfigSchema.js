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
            "regex": "((http[s]?)://)?(?<=//|)(((\\w)+\\.)+\\w+)(\\:(\\d+))?$"
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
            "regex": "((http[s]?)://)?(?<=//|)(((\\w)+\\.)+\\w+)(\\:(\\d+))?$"
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
                        "regex": "((http[s]?)://)?(?<=//|)(((\\w)+\\.)+\\w+)(\\:(\\d+))?$"
                    }
                },
                "required": ["regExp", "target"]
            }
        },
        "mockServer": {
            "type": "string",
            "regex": "((http[s]?)://)?(?<=//|)(((\\w)+\\.)+\\w+)(\\:(\\d+))?$"
        },
        "mockPrefix": {
            "type": "string"
        },
        "mockPaths": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "path": {
                        "type": "string"
                    },
                    "mock": {
                        "type": "boolean"
                    }
                }
            }
        }
    },
    "required": ["context","target"]
}