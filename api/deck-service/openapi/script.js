var spec = {
   "openapi": "3.0.3",
   "info": {
      "title": "Deck-Service API",
      "version": "1.1"
   },
   "paths": {
      "/decks": {
         "post": {
            "summary": "Creates a new deck.",
            "tags": [
               "/decks"
            ],
            "requestBody": {
               "required": true,
               "content": {
                  "application/json": {
                     "schema": {
                        "$ref": "#/components/schemas/newDeckRequestBody"
                     }
                  }
               }
            },
            "responses": {
               "201": {
                  "description": "New deck created.",
                  "content": {
                     "application/json": {
                        "schema": {
                           "$ref": "#/components/schemas/deck"
                        }
                     }
                  }
               },
               "404": {
                  "description": "User not found."
               }
            }
         },
         "get": {
            "summary": "Fetches all decks by userid.",
            "tags": [
               "/decks"
            ],
            "parameters": [
               {
                  "in": "query",
                  "name": "user-id",
                  "required": true,
                  "schema": {
                     "$ref": "#/components/schemas/uuid"
                  }
               }
            ],
            "responses": {
               "200": {
                  "description": "Returns all matching decks.",
                  "content": {
                     "application/json": {
                        "schema": {
                           "type": "array",
                           "items": {
                              "$ref": "#/components/schemas/deck"
                           }
                        }
                     }
                  }
               }
            }
         }
      },
      "/decks/{deck-id}": {
         "get": {
            "summary": "Retrieves the deck.",
            "tags": [
               "/decks"
            ],
            "parameters": [
               {
                  "$ref": "#/components/parameters/deckId"
               }
            ],
            "responses": {
               "200": {
                  "description": "Deck retrieved.",
                  "content": {
                     "application/json": {
                        "schema": {
                           "$ref": "#/components/schemas/deck"
                        }
                     }
                  }
               },
               "404": {
                  "description": "Deck not found."
               }
            }
         },
         "delete": {
            "summary": "Disables the deck.",
            "tags": [
               "/decks"
            ],
            "description": "Disables and archives the deck (soft-delete).",
            "parameters": [
               {
                  "$ref": "#/components/parameters/deckId"
               }
            ],
            "responses": {
               "200": {
                  "description": "Deck disabled."
               },
               "404": {
                  "description": "No deck found."
               }
            }
         }
      },
      "/decks/{deck-id}/scheduler-presets/{scheduler-preset-id}": {
         "put": {
            "summary": "Sets the deck's default scheduler-preset.",
            "tags": [
               "/decks"
            ],
            "description": "When a preset is set, new cards will use it by default and cards missing a scheduler will use it as well.\n",
            "parameters": [
               {
                  "$ref": "#/components/parameters/deckId"
               },
               {
                  "$ref": "#/components/parameters/schedulerPresetId"
               }
            ],
            "responses": {
               "200": {
                  "description": "Preset updated."
               },
               "404": {
                  "description": "Deck or Preset not found."
               }
            }
         }
      },
      "/cards": {
         "post": {
            "summary": "Creates a new card.",
            "tags": [
               "/cards"
            ],
            "description": "Created a new card and adds it to the corresponding deck. Failing to locate the deck will result in an error.\n",
            "requestBody": {
               "content": {
                  "application/json": {
                     "schema": {
                        "oneOf": [
                           {
                              "$ref": "#/components/schemas/newDefaultCardRequestBody"
                           }
                        ],
                        "discriminator": {
                           "propertyName": "cardType"
                        }
                     }
                  }
               }
            },
            "responses": {
               "201": {
                  "description": "Card successfully created and added to deck.",
                  "content": {
                     "application/json": {
                        "schema": {
                           "oneOf": [
                              {
                                 "$ref": "#/components/schemas/defaultCard"
                              }
                           ],
                           "discriminator": {
                              "propertyName": "cardType"
                           }
                        }
                     }
                  }
               },
               "404": {
                  "description": "Referenced deck not found."
               }
            }
         },
         "get": {
            "summary": "Retrieves a list of cards.",
            "tags": [
               "/cards"
            ],
            "parameters": [
               {
                  "in": "query",
                  "name": "deck-id",
                  "required": true,
                  "description": "The corresponding deck.",
                  "schema": {
                     "$ref": "#/components/schemas/uuid"
                  }
               },
               {
                  "in": "query",
                  "name": "card-status",
                  "description": "Allows filtering by card-status.",
                  "schema": {
                     "$ref": "#/components/schemas/cardStatus"
                  }
               }
            ],
            "responses": {
               "200": {
                  "description": "Contains all matching cards.",
                  "content": {
                     "application/json": {
                        "schema": {
                           "type": "array",
                           "items": {
                              "oneOf": [
                                 {
                                    "$ref": "#/components/schemas/defaultCard"
                                 }
                              ],
                              "discriminator": {
                                 "propertyName": "cardType"
                              }
                           }
                        }
                     }
                  }
               }
            }
         }
      },
      "/cards/{card-id}": {
         "post": {
            "summary": "Overrides the existing card with a new unique version of it.",
            "tags": [
               "/cards"
            ],
            "parameters": [
               {
                  "$ref": "#/components/parameters/cardId"
               }
            ],
            "requestBody": {
               "required": true,
               "content": {
                  "application/json": {
                     "schema": {
                        "$ref": "#/components/schemas/newDefaultCardRequestBody"
                     }
                  }
               }
            },
            "responses": {
               "201": {
                  "description": "Disabled the old card and created a new one.",
                  "content": {
                     "application/json": {
                        "schema": {
                           "oneOf": [
                              {
                                 "$ref": "#/components/schemas/defaultCard"
                              }
                           ],
                           "discriminator": {
                              "propertyName": "cardType"
                           }
                        }
                     }
                  }
               },
               "404": {
                  "description": "Card not found."
               }
            }
         },
         "get": {
            "summary": "Retrieves a specific card.",
            "tags": [
               "/cards"
            ],
            "parameters": [
               {
                  "$ref": "#/components/parameters/cardId"
               }
            ],
            "responses": {
               "200": {
                  "description": "Retrieves the card.",
                  "content": {
                     "application/json": {
                        "schema": {
                           "oneOf": [
                              {
                                 "$ref": "#/components/schemas/defaultCard"
                              }
                           ],
                           "discriminator": {
                              "propertyName": "cardType"
                           }
                        }
                     }
                  }
               },
               "404": {
                  "description": "Card not found."
               }
            }
         },
         "delete": {
            "summary": "Disables the card.",
            "tags": [
               "/cards"
            ],
            "parameters": [
               {
                  "$ref": "#/components/parameters/cardId"
               }
            ],
            "responses": {
               "200": {
                  "description": "Card disabled"
               },
               "404": {
                  "description": "Card not found."
               }
            }
         }
      },
      "/cards/{card-id}/scheduler/activity/reset": {
         "post": {
            "summary": "Resets the interval to the starting condition.",
            "tags": [
               "/cards/scheduler"
            ],
            "parameters": [
               {
                  "$ref": "#/components/parameters/cardId"
               }
            ],
            "responses": {
               "201": {
                  "description": "Scheduler resetted."
               },
               "403": {
                  "description": "Card is inactive."
               },
               "404": {
                  "description": "Card not found."
               }
            }
         }
      },
      "/cards/{card-id}/scheduler/activity/review": {
         "post": {
            "summary": "Increments interval.",
            "tags": [
               "/cards/scheduler"
            ],
            "parameters": [
               {
                  "$ref": "#/components/parameters/cardId"
               }
            ],
            "requestBody": {
               "required": true,
               "content": {
                  "application/json": {
                     "schema": {
                        "$ref": "#/components/schemas/reviewRequestBody"
                     }
                  }
               }
            },
            "responses": {
               "201": {
                  "description": "Review added to scheduler."
               },
               "403": {
                  "description": "Card is inactive."
               },
               "404": {
                  "description": "Card not found."
               }
            }
         }
      },
      "/cards/{card-id}/scheduler/activity/graduation": {
         "post": {
            "summary": "Graduates from learning phase.",
            "tags": [
               "/cards/scheduler"
            ],
            "parameters": [
               {
                  "$ref": "#/components/parameters/cardId"
               }
            ],
            "responses": {
               "201": {
                  "description": "Review added to scheduler."
               },
               "403": {
                  "description": "Card is inactive or card already graduated."
               },
               "404": {
                  "description": "Card not found."
               }
            }
         }
      },
      "/scheduler-presets": {
         "post": {
            "summary": "Creates a new scheduler preset.",
            "tags": [
               "/scheduler-presets"
            ],
            "description": "The Scheduler presets describe how the scheduler is supposed to update its interval based on the user's\nreview-actions.\n",
            "requestBody": {
               "required": true,
               "content": {
                  "application/json": {
                     "schema": {
                        "$ref": "#/components/schemas/newSchedulerPresetRequestBody"
                     }
                  }
               }
            },
            "responses": {
               "201": {
                  "description": "Preset created.",
                  "content": {
                     "application/json": {
                        "schema": {
                           "$ref": "#/components/schemas/schedulerPreset"
                        }
                     }
                  }
               },
               "404": {
                  "description": "User not found."
               }
            }
         },
         "get": {
            "summary": "Retrieves a list of presets filtered by user-id.",
            "tags": [
               "/scheduler-presets"
            ],
            "parameters": [
               {
                  "in": "query",
                  "name": "user-id",
                  "required": true,
                  "schema": {
                     "$ref": "#/components/schemas/uuid"
                  }
               }
            ],
            "responses": {
               "200": {
                  "description": "A list of matching presets.",
                  "content": {
                     "application/json": {
                        "schema": {
                           "type": "array",
                           "items": {
                              "$ref": "#/components/schemas/schedulerPreset"
                           }
                        }
                     }
                  }
               }
            }
         }
      },
      "/scheduler-presets/{scheduler-preset-id}": {
         "get": {
            "summary": "Retrieves the specific preset.",
            "tags": [
               "/scheduler-presets"
            ],
            "parameters": [
               {
                  "$ref": "#/components/parameters/schedulerPresetId"
               }
            ],
            "responses": {
               "200": {
                  "description": "Preset retrieved.",
                  "content": {
                     "application/json": {
                        "schema": {
                           "$ref": "#/components/schemas/schedulerPreset"
                        }
                     }
                  }
               },
               "404": {
                  "description": "Preset not found."
               }
            }
         },
         "delete": {
            "summary": "Deletes the preset.",
            "description": "Deletes the scheduler preset. Cards and decks without preset use a default configuration.",
            "tags": [
               "/scheduler-presets"
            ],
            "parameters": [
               {
                  "$ref": "#/components/parameters/schedulerPresetId"
               }
            ],
            "responses": {
               "200": {
                  "description": "Preset successfully deleted."
               },
               "404": {
                  "description": "Preset not found."
               }
            }
         }
      },
      "/logs": {
         "get": {
            "summary": "Exposes log-files for dev. purposes.",
            "tags": [
               "/logs"
            ],
            "parameters": [
               {
                  "in": "path",
                  "name": "file",
                  "required": true,
                  "examples": {
                     "info": {
                        "value": "info"
                     },
                     "error": {
                        "value": "error"
                     },
                     "dinfo": {
                        "value": "dinfo"
                     },
                     "dtrace": {
                        "value": "dtrace"
                     }
                  },
                  "schema": {
                     "type": "string"
                  }
               }
            ],
            "responses": {
               "200": {
                  "description": "Returns the queried logfile.",
                  "content": {
                     "text/plain": {
                        "schema": {
                           "type": "string"
                        }
                     }
                  }
               }
            }
         }
      }
   },
   "components": {
      "schemas": {
         "uuid": {
            "type": "string",
            "format": "uuid",
            "example": "d290f1ee-6c54-4b01-90e6-d701748f0851"
         },
         "deckname": {
            "type": "string",
            "example": "TH Koeln DB2",
            "pattern": "^([A-Za-z0-9]){4,16}$"
         },
         "name": {
            "type": "string",
            "example": "Any-Name",
            "pattern": "^([A-Za-z0-9 -]){3,12}$"
         },
         "learningSteps": {
            "description": "Consecutive learning steps in minutes before graduation to the regular interval.",
            "type": "array",
            "items": {
               "type": "integer",
               "format": "int64",
               "minimum": 1
            },
            "minItems": 1,
            "maxItems": 8,
            "example": [
               60,
               1440
            ]
         },
         "lapseSteps": {
            "description": "Consecutive lapse steps in minutes before resuming to the regular interval.",
            "type": "array",
            "items": {
               "type": "integer",
               "format": "in64",
               "minimum": 1
            },
            "minItems": 1,
            "maxItems": 5,
            "example": [
               60,
               1440
            ]
         },
         "lapseIntervalModifier": {
            "description": "The factor by which the interval is modified when entering a lapse phase.",
            "type": "number",
            "format": "double",
            "minimum": 0.1,
            "maximum": 1,
            "example": 0.5
         },
         "minimumInterval": {
            "description": "The lowest possible interval after gradution in minutes.",
            "type": "integer",
            "format": "int64",
            "minimum": 1,
            "example": 1440
         },
         "easeFactor": {
            "description": "The factor by which an interval is multiplied when a positive review occurred. This factor gets updated\nbased on the users performance with the corresponding *FactorModifiers.\n",
            "type": "number",
            "format": "double",
            "minimum": 1.5,
            "maximum": 3,
            "example": 1.8
         },
         "easyFactorModifier": {
            "description": "The factor which is added to the ease factor with an easy review action.",
            "type": "number",
            "format": "double",
            "minimum": 0,
            "maximum": 1,
            "example": 0.2
         },
         "normalFactorModifier": {
            "description": "The factor which is added to the ease factor with a normal review action.",
            "type": "number",
            "format": "double",
            "minimum": -1,
            "maximum": 1,
            "example": 0.05
         },
         "hardFactorModifier": {
            "description": "The factor which is added to the ease factor with a hard review action.",
            "type": "number",
            "format": "double",
            "minimum": -1,
            "maximum": 0.5,
            "example": -0.1
         },
         "lapseFactorModifier": {
            "description": "The factor which is added to the ease factor with a lapse review action.",
            "type": "number",
            "format": "double",
            "minimum": -1,
            "maximum": 0,
            "example": -0.2
         },
         "easyIntervalModifier": {
            "description": "The factor by which the review interval is modified with an easy review action.",
            "type": "number",
            "format": "double",
            "minimum": 0,
            "maximum": 3,
            "example": 1.2
         },
         "visibility": {
            "type": "string",
            "enum": [
               "public",
               "private"
            ]
         },
         "reviewAction": {
            "type": "string",
            "enum": [
               "easy",
               "normal",
               "hard",
               "lapse"
            ]
         },
         "cardStatus": {
            "type": "string",
            "enum": [
               "active",
               "inactive"
            ]
         },
         "cardType": {
            "type": "string",
            "enum": [
               "default"
            ]
         },
         "contentType": {
            "type": "string",
            "enum": [
               "text",
               "image"
            ]
         },
         "textElement": {
            "description": "A generic text Element, containing a large text with various possible formats.",
            "type": "object",
            "required": [
               "contentType",
               "text"
            ],
            "properties": {
               "contentType": {
                  "$ref": "#/components/schemas/contentType"
               },
               "text": {
                  "type": "string"
               }
            }
         },
         "imageElement": {
            "description": "An image element, consiting of an url refering to a resource.",
            "type": "object",
            "required": [
               "contentType",
               "url"
            ],
            "properties": {
               "contentType": {
                  "$ref": "#/components/schemas/contentType"
               },
               "url": {
                  "type": "string"
               }
            }
         },
         "cardView": {
            "type": "object",
            "required": [
               "content"
            ],
            "properties": {
               "content": {
                  "type": "array",
                  "items": {
                     "oneOf": [
                        {
                           "$ref": "#/components/schemas/textElement"
                        },
                        {
                           "$ref": "#/components/schemas/imageElement"
                        }
                     ],
                     "discriminator": {
                        "propertyName": "contentType"
                     }
                  }
               }
            }
         },
         "hint": {
            "type": "object",
            "required": [
               "content"
            ],
            "properties": {
               "content": {
                  "type": "array",
                  "items": {
                     "oneOf": [
                        {
                           "$ref": "#/components/schemas/textElement"
                        },
                        {
                           "$ref": "#/components/schemas/imageElement"
                        }
                     ],
                     "discriminator": {
                        "propertyName": "contentType"
                     }
                  }
               }
            }
         },
         "newCardRequestBody": {
            "type": "object",
            "required": [
               "deckId",
               "cardType"
            ],
            "properties": {
               "deckId": {
                  "$ref": "#/components/schemas/uuid"
               },
               "cardType": {
                  "$ref": "#/components/schemas/cardType"
               }
            }
         },
         "newDefaultCardRequestBody": {
            "allOf": [
               {
                  "$ref": "#/components/schemas/newCardRequestBody"
               },
               {
                  "type": "object",
                  "required": [
                     "hint",
                     "frontView",
                     "backView"
                  ],
                  "properties": {
                     "hint": {
                        "$ref": "#/components/schemas/hint"
                     },
                     "frontView": {
                        "$ref": "#/components/schemas/cardView"
                     },
                     "backView": {
                        "$ref": "#/components/schemas/cardView"
                     }
                  }
               }
            ]
         },
         "card": {
            "type": "object",
            "required": [
               "cardId",
               "deckId",
               "cardStatus",
               "cardType"
            ],
            "properties": {
               "cardId": {
                  "$ref": "#/components/schemas/uuid"
               },
               "deckId": {
                  "$ref": "#/components/schemas/uuid"
               },
               "cardStatus": {
                  "$ref": "#/components/schemas/cardStatus"
               },
               "cardType": {
                  "$ref": "#/components/schemas/cardType"
               },
               "scheduler": {
                  "$ref": "#/components/schemas/scheduler"
               }
            }
         },
         "defaultCard": {
            "allOf": [
               {
                  "$ref": "#/components/schemas/card"
               },
               {
                  "type": "object",
                  "required": [
                     "frontView",
                     "backView"
                  ],
                  "properties": {
                     "hint": {
                        "$ref": "#/components/schemas/hint"
                     },
                     "frontView": {
                        "$ref": "#/components/schemas/cardView"
                     },
                     "backView": {
                        "$ref": "#/components/schemas/cardView"
                     }
                  }
               }
            ]
         },
         "newDeckRequestBody": {
            "type": "object",
            "required": [
               "userId",
               "deckName"
            ],
            "properties": {
               "userId": {
                  "$ref": "#/components/schemas/uuid"
               },
               "deckName": {
                  "$ref": "#/components/schemas/deckname"
               }
            }
         },
         "patchDeckName": {
            "type": "object",
            "required": [
               "deckName"
            ],
            "properties": {
               "deckName": {
                  "$ref": "#/components/schemas/deckname"
               }
            }
         },
         "deck": {
            "type": "object",
            "required": [
               "deckId",
               "deckName",
               "userId",
               "schedulerPresetId",
               "isActive"
            ],
            "properties": {
               "deckId": {
                  "$ref": "#/components/schemas/uuid"
               },
               "deckName": {
                  "$ref": "#/components/schemas/deckname"
               },
               "userId": {
                  "$ref": "#/components/schemas/uuid"
               },
               "schedulerPresetId": {
                  "allOf": [
                     {
                        "$ref": "#/components/schemas/uuid"
                     },
                     {
                        "nullable": true
                     }
                  ]
               },
               "isActive": {
                  "type": "boolean"
               }
            }
         },
         "newSchedulerPresetRequestBody": {
            "type": "object",
            "required": [
               "userId",
               "name",
               "learningSteps",
               "lapseSteps",
               "minimumInterval",
               "easeFactor",
               "easyFactorModifier",
               "normalFactorModifier",
               "hardFactorModifier",
               "lapseFactorModifier",
               "easyIntervalModifier",
               "lapseIntervalModifier"
            ],
            "properties": {
               "userId": {
                  "$ref": "#/components/schemas/uuid"
               },
               "name": {
                  "$ref": "#/components/schemas/name"
               },
               "learningSteps": {
                  "$ref": "#/components/schemas/learningSteps"
               },
               "lapseSteps": {
                  "$ref": "#/components/schemas/lapseSteps"
               },
               "minimumInterval": {
                  "$ref": "#/components/schemas/minimumInterval"
               },
               "easeFactor": {
                  "$ref": "#/components/schemas/easeFactor"
               },
               "easyFactorModifier": {
                  "$ref": "#/components/schemas/easyFactorModifier"
               },
               "normalFactorModifier": {
                  "$ref": "#/components/schemas/normalFactorModifier"
               },
               "hardFactorModifier": {
                  "$ref": "#/components/schemas/hardFactorModifier"
               },
               "lapseFactorModifier": {
                  "$ref": "#/components/schemas/lapseFactorModifier"
               },
               "easyIntervalModifier": {
                  "$ref": "#/components/schemas/easyIntervalModifier"
               },
               "lapseIntervalModifier": {
                  "$ref": "#/components/schemas/lapseIntervalModifier"
               }
            }
         },
         "patchSchedulerPresetRequestBody": {
            "allOf": [
               {
                  "$ref": "#/components/schemas/newSchedulerPresetRequestBody"
               }
            ]
         },
         "schedulerPreset": {
            "allOf": [
               {
                  "$ref": "#/components/schemas/newSchedulerPresetRequestBody"
               },
               {
                  "type": "object",
                  "required": [
                     "schedulerPresetId"
                  ],
                  "properties": {
                     "schedulerPresetId": {
                        "$ref": "#/components/schemas/uuid"
                     }
                  }
               }
            ]
         },
         "reviewRequestBody": {
            "type": "object",
            "required": [
               "reviewAction"
            ],
            "properties": {
               "reviewAction": {
                  "$ref": "#/components/schemas/reviewAction"
               }
            }
         },
         "reviewState": {
            "type": "string",
            "enum": [
               "learning",
               "graduated",
               "lapsing"
            ]
         },
         "reviewCount": {
            "type": "integer",
            "minimum": 0
         },
         "dateTime": {
            "type": "string",
            "format": "date-time"
         },
         "intervalInMinutes": {
            "type": "integer",
            "format": "int64"
         },
         "scheduler": {
            "type": "object",
            "required": [
               "presetName",
               "reviewState",
               "reviewCount",
               "lastReview",
               "nextReview",
               "easeFactor",
               "currentInterval",
               "learningStep",
               "lapseStep"
            ],
            "properties": {
               "presetName": {
                  "$ref": "#/components/schemas/name"
               },
               "reviewState": {
                  "$ref": "#/components/schemas/reviewState"
               },
               "reviewCount": {
                  "$ref": "#/components/schemas/reviewCount"
               },
               "lastReview": {
                  "$ref": "#/components/schemas/dateTime"
               },
               "nextReview": {
                  "$ref": "#/components/schemas/dateTime"
               },
               "easeFactor": {
                  "$ref": "#/components/schemas/easeFactor"
               },
               "currentInterval": {
                  "$ref": "#/components/schemas/intervalInMinutes"
               },
               "learningStep": {
                  "type": "integer"
               },
               "lapseStep": {
                  "type": "integer"
               }
            }
         }
      },
      "parameters": {
         "deckId": {
            "in": "path",
            "name": "deck-id",
            "schema": {
               "$ref": "#/components/schemas/uuid"
            },
            "required": true
         },
         "cardId": {
            "in": "path",
            "name": "card-id",
            "schema": {
               "$ref": "#/components/schemas/uuid"
            },
            "required": true
         },
         "schedulerPresetId": {
            "in": "path",
            "name": "scheduler-preset-id",
            "schema": {
               "$ref": "#/components/schemas/uuid"
            },
            "required": true
         }
      }
   }
}