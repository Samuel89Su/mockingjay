const cfgSchema = {
    "definitions": {},
    "$schema": "http://json-schema.org/draft-06/schema#",
    "type": "object",
    "properties": {
        "appId": {
            "type": "integer",
            "minimum": 1
        },
        "path": {
            "type": "string",
            "minLength": 2
        },
        "method": {
            "type": "string",
            "pattern": "(GET|POST)"
        },
        "logReq": {
            "type": "integer",
            "minimum": 0,
            "maximum": 10
        },
        "mock": {
            "type": "boolean"
        },
        "mockCfg": {
            "type": "object",
            "properties": {
                "validateReq": {
                    "type": "boolean"
                },
                "reqDescriptor": {
                    "type": "object",
                    "properties": {
                        "queries": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "key": {
                                        "type": "string",
                                        "minLength": 1
                                    },
                                    "required": {
                                        "type": "boolean"
                                    },
                                    "validator": {
                                        "type": "object",
                                        "properties": {
                                            "type": {
                                                "type": "string",
                                                "pattern": "(exact|regEx|custom)"
                                            },
                                            "value": {
                                                "type": "string"
                                            },
                                            "errMsg": {
                                                "type": "string"
                                            }
                                        },
                                        "required": ["type", "value"]
                                    }
                                },
                                "required": ["key", "required"]
                            }
                        },
                        "headers": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "key": {
                                        "type": "string",
                                        "minLength": 1
                                    },
                                    "required": {
                                        "type": "boolean"
                                    },
                                    "validator": {
                                        "type": "object",
                                        "properties": {
                                            "type": {
                                                "type": "string",
                                                "pattern": "(exact|regEx|custom)"
                                            },
                                            "value": {
                                                "type": "string"
                                            },
                                            "errMsg": {
                                                "type": "string"
                                            }
                                        },
                                        "required": ["type", "value"]
                                    }
                                },
                                "required": ["key", "required"]
                            }
                        },
                        "body": {
                            "type": "object",
                            "properties": {
                                "required": {
                                    "type": "boolean"
                                },
                                "validator": {
                                    "type": "object",
                                    "properties": {
                                        "type": {
                                            "type": "string",
                                            "pattern": "(exact|regEx|custom|jsonSchema)"
                                        },
                                        "value": {
                                            "type": "string"
                                        },
                                        "errMsg": {
                                            "type": "string"
                                        }
                                    },
                                    "required": ["type","value"]
                                }
                            },
                            "required": ["required"]
                        }
                    }
                },
                "resDescriptor": {
                    "type": "object",
                    "properties": {
                        "headers": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "key": {
                                        "type": "string",
                                        "minLength": 1
                                    },
                                    "optional": {
                                        "type": "boolean"
                                    },
                                    "reactor": {
                                        "type": "object",
                                        "properties": {
                                            "type": {
                                                "type": "string",
                                                "pattern": "(fixed|custom)"
                                            },
                                            "value": {
                                                "type": "string"
                                            }
                                        },
                                        "required": ["type", "value"]
                                    }
                                },
                                "required": ["key","optional"]
                            }
                        },
                        "body": {
                            "type": "object",
                            "properties": {
                                "optional": {
                                    "type": "boolean"
                                },
                                "reactor": {
                                    "type": "object",
                                        "properties": {
                                            "type": {
                                                "type": "string",
                                                "pattern": "(fixed|custom)"
                                            },
                                            "value": {
                                                "type": "string"
                                            }
                                        },
                                        "required": ["type", "value"]
                                }
                            },
                            "required": ["optional"]
                        }
                    }
                }
            },
            "required": ["validateReq"]
        },
        "proxyCfg": {
            "type": "object",
            "properties": {
                "bypass": {
                    "type": "boolean"
                }
            },
            "required": ["bypass"]
        }
    },
    "required": [
        "appId", "path", "method", "mock", "mockCfg"
    ]
}

 exports = module.exports = cfgSchema;