exports = module.exports = {
    "$schema": "http://json-schema.org/draft-06/schema#",
    "type": "object",
    "properties": {
        "appId": {
            "type": "integer",
            "minimum": 1
        },
        "apiId": {
            "type": "integer",
            "minimum": 1
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
                                                "pattern": "(custom)"
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
                                                "pattern": "(custom)"
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
                                            "pattern": "(custom)"
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
        }
    },
    "required": [
        "appId", "mock"
    ]
}