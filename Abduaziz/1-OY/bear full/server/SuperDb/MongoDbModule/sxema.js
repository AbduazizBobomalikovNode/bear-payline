async function Run(bear) {
    await bear.createCollection("user", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["id", "full_name", "phone", "idrole", "idcountry", "email_status", "status"],
                properties: {
                    id: {
                        bsonType: "number",
                        "uniqueItems": true,
                    },
                    full_name: {
                        bsonType: "string",
                        maxLength: 50,
                        minLength: 3,
                    },
                    phone: {
                        "uniqueItems": true,
                        bsonType: "string",
                        maxLength: 30,
                        minLength: 9,
                    },
                    address: {
                        bsonType: "string",
                        maxLength: 80,
                        minLength: 3,
                    },
                    idrole: {
                        bsonType: "number"
                    },
                    idcountry: {
                        bsonType: "number"
                    },
                    email: {
                        "uniqueItems": true,
                        bsonType: "string",
                        maxLength: 100,
                        minLength: 5,
                    },
                    email_status: {
                        bsonType: "number"
                    },
                    status: {
                        bsonType: "number"
                    }
                }
            }
        }
    }).catch(err => { console.log("user jadvali mavjut o'zi!") })


    await bear.createCollection("payments", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["id", "iduser", "date", "sender_card_number", "amout", "currency", "receiver_card_number", "receiver_full_name", "commission", "method"],
                properties: {
                    id: {
                        bsonType: "number",
                        uniqueItems: true
                    },
                    iduser: {
                        bsonType: "number"
                    },
                    date: {
                        bsonType: "string",
                        maxLength: 40,
                        minLength: 2,
                    },
                    sender_card_number: {
                        bsonType: "string",
                        maxLength: 30,
                        minLength: 12,
                    },
                    amout: {
                        bsonType: "number",
                    },
                    currency: {
                        bsonType: "string",
                        maxLength: 5,
                        minLength: 2,
                    },
                    receiver_card_number: {
                        bsonType: "string",
                        maxLength: 30,
                        minLength: 12,
                    },
                    receiver_full_name: {
                        bsonType: "string",
                        maxLength: 50,
                        minLength: 3,
                    },
                    commission: {
                        bsonType: "number",
                    },
                    method: {
                        bsonType: "string",
                        maxLength: 150,
                    },
                }
            }
        }
    }).catch(err => { console.log("payments jadvali mavjut o'zi!") })


    await bear.createCollection("role", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["id", "role", "licence"],
                properties: {
                    id: {
                        bsonType: "number",
                        uniqueItems: true
                    },
                    role: {
                        uniqueItems: true,
                        bsonType: "string",
                        maxLength: 50,
                        minLength: 1,
                    },
                    licence: {
                        bsonType: "string",
                        maxLength: 150,
                        minLength: 2
                    }
                }
            }
        }
    }).catch(err => { console.log("role jadvali mavjut o'zi!") })


    await bear.createCollection("partner", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["id", "card_number", "name", "iduser"],
                properties: {
                    id: {
                        bsonType: "number",
                        uniqueItems: true
                    },
                    card_number: {
                        bsonType: "string",
                        maxLength: 30,
                        minLength: 12,
                    },
                    name: {
                        bsonType: "string",
                        maxLength: 50,
                        minLength: 3,
                    },
                    iduser: {
                        bsonType: "number"
                    }
                }
            }
        }
    }).catch(err => { console.log("partner jadvali mavjut o'zi!") })


    await bear.createCollection("news", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["id", "title", "content", "img_url"],
                properties: {
                    id: {
                        bsonType: "number",
                        uniqueItems: true
                    },
                    title: {
                        bsonType: "string",
                        maxLength: 50,
                        minLength: 3,
                    },
                    content: {
                        bsonType: "string",
                        maxLength: 250,
                        minLength: 1,
                    },
                    img_url: {
                        bsonType: "string",
                        maxLength: 350,
                        minLength: 3,
                    }
                }
            }
        }
    }).catch(err => { console.log("news jadvali mavjut o'zi!") })


    await bear.createCollection("document", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["id", "type", "img_url", "iduser"],
                properties: {
                    id: {
                        bsonType: "number",
                        uniqueItems: true
                    },
                    type: {
                        bsonType: "string",
                        maxLength: 30,
                        minLength: 1,
                    },
                    img_url: {
                        bsonType: "string",
                        maxLength: 350,
                        minLength: 3,
                    },
                    iduser: {
                        bsonType: "number"
                    }
                }
            }
        }
    }).catch(err => { console.log("document jadvali mavjut o'zi!") })


    await bear.createCollection("device", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["id", "date", "model", "ip", "iduser"],
                properties: {
                    id: {
                        bsonType: "number",
                        uniqueItems: true
                    },
                    date: {
                        bsonType: "string",
                        maxLength: 50,
                        minLength: 3
                    },
                    model: {
                        bsonType: "string",
                        maxLength: 70,
                        minLength: 3
                    },
                    ip: {
                        bsonType: "string",
                        maxLength: 80,
                        minLength: 3
                    },
                    iduser: {
                        bsonType: "number"
                    },

                }
            }
        }
    }).catch(err => { console.log("device jadvali mavjut o'zi!") })


    await bear.createCollection("country", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["id", "name", "code", "phone_code", "lang_arr", "currency", "commission"],
                properties: {
                    id: {
                        bsonType: "number",
                        uniqueItems: true
                    },
                    name: {
                        uniqueItems: true,
                        bsonType: "string",
                        maxLength: 50,
                        minLength: 3
                    },
                    code: {
                        uniqueItems: true,
                        bsonType: "string",
                        maxLength: 5,
                        minLength: 1
                    },
                    phone_code: {
                        bsonType: "string",
                        maxLength: 5,
                        minLength: 1
                    },
                    lang_arr: {
                        bsonType: "string",
                        maxLength: 50,
                        minLength: 1
                    },
                    currency: {
                        bsonType: "string",
                        maxLength: 5,
                        minLength: 1
                    },
                    commission: {
                        bsonType: "number"
                    },
                }
            }
        }
    }).catch(err => { console.log("country jadvali mavjut o'zi!") })


    await bear.createCollection("card", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["id", "number", "full_name", "date", "cvv"],
                properties: {
                    id: {
                        bsonType: "number",
                        uniqueItems: true
                    },
                    number: {
                        uniqueItems: true,
                        bsonType: "string",
                        maxLength: 30,
                        minLength: 12,
                    },
                    full_name: {
                        bsonType: "string",
                        maxLength: 50,
                        minLength: 3,
                    },
                    date: {
                        bsonType: "string",
                        maxLength: 20,
                        minLength: 3,
                    },
                    cvv: {
                        bsonType: "string",
                        maxLength: 3,
                    }
                    // licence: {
                    //     bsonType: "object",
                    //     uniqueItems: true,
                    //     properties: {
                    //         role: {
                    //             bsonType: "array"
                    //         },
                    //         student: {
                    //             bsonType: "array"
                    //         },
                    //         presence: {
                    //             bsonType: "array"
                    //         },
                    //         course: {
                    //             bsonType: "array"
                    //         },
                    //         paymentNumber: {
                    //             bsonType: "array"
                    //         },
                    //         group: {
                    //             bsonType: "array"
                    //         },
                    //         payments: {
                    //             bsonType: "array"
                    //         },
                    //         studentHasGroup: {
                    //             bsonType: "array"
                    //         }
                    //     }
                    // }
                }
            }
        }
    }).catch(err => { console.log("card jadvali mavjut o'zi!") })

    await bear.createCollection("card_has_user", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["id", "idcard", "iduser"],
                properties: {
                    id: {
                        bsonType: "number",
                        uniqueItems: true
                    },
                    idcard: {
                        bsonType: "number"
                    },
                    iduser: {
                        bsonType: "number",
                    }
                }
            }
        }
    }).catch(err => { console.log("card_has_user jadvali mavjut o'zi!") });

    await bear.createCollection("cheks", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["id", "phone", "code", "date"],
                properties: {
                    id: {
                        bsonType: "number",
                        uniqueItems: true
                    },
                    phone: {
                        bsonType: "string",
                        maxLength: 20,
                        minLength: 3,
                    },
                    code: {
                        bsonType: "string",
                        maxLength: 20,
                        minLength: 3,
                    },
                    date: {
                        bsonType: "number"
                    }
                }
            }
        }
    }).catch(err => { console.log("cheks jadvali mavjut o'zi!") });

    // (await bear.collection("user"))
    // .createIndex({ phone: 1 }, { unique: true }, function(err, res) {
    //     if (err) throw err;
    //     console.log("phone index created!");
    // });
    // (await bear.collection("user"))
    // .createIndex({ email: 1 }, { unique: true }, function(err, res) {
    //     if (err) throw err;
    //     console.log("Email index created!");
    // });

    // (await bear.collection("country"))
    // .createIndex({ name: 1 }, { unique: true }, function(err, res) {
    //     if (err) throw err;
    //     console.log("name index created!");
    // });
    // (await bear.collection("country"))
    // .createIndex({ code: 1 }, { unique: true }, function(err, res) {
    //     if (err) throw err;
    //     console.log("code index created!");
    // });

    // (await bear.collection("card"))
    // .createIndex({ number: 1 }, { unique: true }, function(err, res) {
    //     if (err) throw err;
    //     console.log("number index created!");
    // });
    // (await bear.collection("role"))
    // .createIndex({ role: 1 }, { unique: true }, function(err, res) {
    //     if (err) throw err;
    //     console.log("role index created!");
    // });
    return true;
}

module.exports = Run;