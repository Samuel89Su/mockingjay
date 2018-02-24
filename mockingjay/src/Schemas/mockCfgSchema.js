const schema = {
    "$schema": "http://json-schema.org/draft-06/schema#",
    "type": "object",
    "properties": {
        "mock": {
            "type": "boolean"
        },
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
                            "required": ["type", "value"]
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
                                "type": ["string", "number"],
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
                                    "value": {}
                                },
                                "required": ["type", "value"]
                            }
                        },
                        "required": ["key", "optional"]
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
                                "value": {}
                            },
                            "required": ["type", "value"]
                        }
                    },
                    "required": ["optional"]
                }
            }
        }
    },
    "required": ["mock"]
}

exports = module.exports = schema