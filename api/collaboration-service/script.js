var spec = {
   "openapi": "3.0.3",
   "info": {
      "title": "Collaboration-Service API",
      "version": "1.0"
   },
   "paths": {
      "/collaborations": {
         "post": {
            "summary": "Invites users to start a new collaboration.",
            "tags": [
               "/collaborations"
            ],
            "requestBody": {
               "required": true,
               "content": {
                  "application/json": {
                     "schema": {
                        "$ref": "#/components/schemas/newCollaborationRequestBody"
                     }
                  }
               }
            },
            "responses": {
               "201": {
                  "description": "Invitation created.",
                  "content": {
                     "application/json": {
                        "schema": {
                           "$ref": "#/components/schemas/collaboration"
                        }
                     }
                  }
               },
               "404": {
                  "description": "One or more users were not found."
               }
            }
         },
         "get": {
            "summary": "Retrieves all matching collaborations.",
            "tags": [
               "/collaborations"
            ],
            "parameters": [
               {
                  "in": "query",
                  "name": "user-id",
                  "schema": {
                     "$ref": "#/components/schemas/uuid"
                  }
               }
            ],
            "responses": {
               "200": {
                  "description": "Retrieves all matching collaborations.",
                  "content": {
                     "application/json": {
                        "schema": {
                           "type": "array",
                           "items": {
                              "$ref": "#/components/schemas/collaboration"
                           }
                        }
                     }
                  }
               }
            }
         }
      },
      "/collaborations/{collaboration-id}": {
         "get": {
            "summary": "Retrieves the collaboration.",
            "tags": [
               "/collaborations"
            ],
            "parameters": [
               {
                  "$ref": "#/components/parameters/collaborationId"
               }
            ],
            "responses": {
               "200": {
                  "description": "Retrieves the corresponding collaboration.",
                  "content": {
                     "application/json": {
                        "schema": {
                           "$ref": "#/components/schemas/collaboration"
                        }
                     }
                  }
               },
               "404": {
                  "description": "Collaboration not found."
               }
            }
         }
      },
      "/collaborations/{collaboration-id}/participants": {
         "post": {
            "summary": "Invites a new user to the existing collaboration.",
            "tags": [
               "/collaborations"
            ],
            "parameters": [
               {
                  "$ref": "#/components/parameters/collaborationId"
               }
            ],
            "requestBody": {
               "required": true,
               "content": {
                  "application/json": {
                     "schema": {
                        "$ref": "#/components/schemas/newParticipantRequestBody"
                     }
                  }
               }
            },
            "responses": {
               "201": {
                  "description": "User invited.",
                  "content": {
                     "application/json": {
                        "schema": {
                           "$ref": "#/components/schemas/participant"
                        }
                     }
                  }
               },
               "404": {
                  "description": "Collaboration or user not found."
               }
            }
         },
         "delete": {
            "summary": "Declines or ends the participation.",
            "tags": [
               "/collaborations"
            ],
            "parameters": [
               {
                  "$ref": "#/components/parameters/collaborationId"
               },
               {
                  "in": "query",
                  "required": true,
                  "name": "user-id",
                  "schema": {
                     "$ref": "#/components/schemas/uuid"
                  }
               }
            ],
            "responses": {
               "200": {
                  "description": "Participant disabled."
               },
               "404": {
                  "description": "Participant not found."
               }
            }
         }
      },
      "/collaborations/{collaboration-id}/participants/{user-id}/state": {
         "post": {
            "summary": "Accepts the invitation.",
            "tags": [
               "/collaborations"
            ],
            "parameters": [
               {
                  "$ref": "#/components/parameters/collaborationId"
               },
               {
                  "$ref": "#/components/parameters/userId"
               }
            ],
            "responses": {
               "201": {
                  "description": "Invitation accepted."
               },
               "403": {
                  "description": "Invitation already accepted or trying to override a terminated state."
               },
               "404": {
                  "description": "Collaboration or user not found."
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
         "username": {
            "type": "string",
            "description": "Usernames must be unique.",
            "example": "dadepu",
            "pattern": "^([A-Za-z0-9]){4,16}$"
         },
         "deckName": {
            "type": "string",
            "example": "TH Koeln DB2",
            "pattern": "^([A-Za-z0-9]){4,16}$"
         },
         "participantStateStatus": {
            "type": "string",
            "enum": [
               "invited",
               "accepted",
               "terminated"
            ]
         },
         "participantState": {
            "type": "object",
            "required": [
               "status",
               "date"
            ],
            "properties": {
               "status": {
                  "$ref": "#/components/schemas/participantStateStatus"
               },
               "date": {
                  "type": "string",
                  "format": "date-time"
               }
            }
         },
         "participantStatus": {
            "type": "string",
            "enum": [
               "INVITED",
               "INVITATION_ACCEPTED",
               "INVITATION_DECLINED",
               "TERMINATED"
            ]
         },
         "participant": {
            "type": "object",
            "required": [
               "userId",
               "participationStatus",
               "stateActivities",
               "deck"
            ],
            "properties": {
               "userId": {
                  "$ref": "#/components/schemas/uuid"
               },
               "participantStatus": {
                  "$ref": "#/components/schemas/participantStatus"
               },
               "deck": {
                  "type": "object",
                  "nullable": true,
                  "required": [
                     "deckId"
                  ],
                  "properties": {
                     "deckId": {
                        "$ref": "#/components/schemas/uuid"
                     }
                  }
               }
            }
         },
         "collaboration": {
            "type": "object",
            "required": [
               "collaborationId",
               "collaborationName",
               "participations"
            ],
            "properties": {
               "collaborationId": {
                  "$ref": "#/components/schemas/uuid"
               },
               "collaborationName": {
                  "$ref": "#/components/schemas/deckName"
               },
               "participants": {
                  "type": "array",
                  "items": {
                     "$ref": "#/components/schemas/participant"
                  }
               }
            }
         },
         "newCollaborationRequestBody": {
            "type": "object",
            "required": [
               "invitedUsers",
               "collaborationName"
            ],
            "properties": {
               "invitedUsers": {
                  "type": "array",
                  "items": {
                     "allOf": [
                        {
                           "$ref": "#/components/schemas/username"
                        },
                        {
                           "minItems": 1
                        }
                     ]
                  }
               },
               "collaborationName": {
                  "$ref": "#/components/schemas/deckName"
               }
            }
         },
         "newParticipantRequestBody": {
            "type": "object",
            "required": [
               "username"
            ],
            "properties": {
               "username": {
                  "$ref": "#/components/schemas/username"
               }
            }
         },
         "newParticipantStateRequestBody": {
            "type": "object",
            "required": [
               "status"
            ],
            "properties": {
               "status": {
                  "type": "string",
                  "enum": [
                     "accepted",
                     "terminated"
                  ]
               }
            }
         }
      },
      "parameters": {
         "collaborationId": {
            "in": "path",
            "name": "collaboration-id",
            "required": true,
            "schema": {
               "$ref": "#/components/schemas/uuid"
            }
         },
         "userId": {
            "in": "path",
            "name": "user-id",
            "required": true,
            "schema": {
               "$ref": "#/components/schemas/uuid"
            }
         }
      }
   }
}