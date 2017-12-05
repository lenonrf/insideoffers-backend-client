'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    deepPopulate = require('mongoose-deep-populate')(mongoose),
    Schema = mongoose.Schema;


var OfferSchema = new Schema({

    affiliationData : [{
        
        affiliation : {
            type: Schema.Types.ObjectId,
            ref: 'Affiliation'
        },

        isSponsoring : {
            type: Boolean,
            default: false
        },

        isSurvey : {
            type: Boolean,
            default: false
        },

        isQuestionHall : {
            type: Boolean,
            default: false
        },

        isBalcony : {
            type: Boolean,
            default: false
        },

        delivery: [{


            isShowAnswerList : {
                type: Boolean,
                default: false
            },

            image:{
                type: String,
                default: ''
            },

            isUploadImage:{
                type: Boolean,
                default: ''
            },

            offerType:{
                type: String,
                default: ''
            },

            url:{
                type: String,
                default: ''
            },

            urlType:{
                type: String,
                default: ''
            },

            gender:{
                
                valueMale: {
                    type: String,
                    default: ''
                },
                
                valueFemale: {
                    type: String,
                    default: ''
                },

                isGender: {
                    type: Boolean,
                    default: false
                }

            }, 

            birthDate:{
                
                mask: {
                    type: String,
                    default: ''
                },

                isBirthDate: {
                    type: Boolean,
                    default: false
                }
            }
        }]

    }],

    status : {
        type: Boolean,
        default: false
    },

    affiliation : [{
        type: Schema.Types.ObjectId,
        ref: 'Affiliation'
    }],


    capping: {

        number:{
            type: Number,
            default: 0
        },

        frequencie:{
            type: String,
            default: 'total'
        }

    },

    codeProvider: {
        type: String,
        default: ''
    },

    delivery: {

        balcony: {

            gender:{
                
                valueMale: {
                    type: String,
                    default: ''
                },
                
                valueFemale: {
                    type: String,
                    default: ''
                },

                isGender: {
                    type: Boolean,
                    default: false
                }

            }, 

            birthDate:{
                
                mask: {
                    type: String,
                    default: ''
                },

                isBirthDate: {
                    type: Boolean,
                    default: false
                }

            },

            largeImage: {
                type: String,
                default: ''
            },

            targetBlankUrl: {
                type: String,
                default: ''
            },

            type: {
                type: String,
                default: ''
            },

            isUploadImage: {
                type: Boolean,
                default: false
            },

            wsUrl: {
                type: String,
                default: ''
            },

            affiliationURL: [{

                affiliation : {
                    type: Schema.Types.ObjectId,
                    ref: 'Affiliation'
                },

                type: {
                    type: String,
                    default: ''
                },

                url: {
                    type: String,
                    default: ''
                }

            }]
        },

        questionHall: {

            gender:{
                
                valueMale: {
                    type: String,
                    default: ''
                },
                
                valueFemale: {
                    type: String,
                    default: ''
                },

                isGender: {
                    type: Boolean,
                    default: false
                }

            }, 

            birthDate:{
                
                mask: {
                    type: String,
                    default: ''
                },

                isBirthDate: {
                    type: Boolean,
                    default: false
                }
            },

            largeImage: {
                type: String,
                default: ''
            },

            targetBlankUrl: {
                type: String,
                default: ''
            },

            type: {
                type: String,
                default: ''
            },

            wsUrl: {
                type: String,
                default: ''
            },

            isUploadImage: {
                type: Boolean,
                default: false
            },

            isShowAnswerList : {
                type: Boolean,
                default: false
            },

            affiliationURL: [{

                affiliation : {
                    type: Schema.Types.ObjectId,
                    ref: 'Affiliation'
                },

                type: {
                    type: String,
                    default: ''
                },

                url: {
                    type: String,
                    default: ''
                }

            }]
        },

        sponsoring: {

            gender:{
                
                valueMale: {
                    type: String,
                    default: ''
                },
                
                valueFemale: {
                    type: String,
                    default: ''
                },

                isGender: {
                    type: Boolean,
                    default: false
                }

            }, 

            birthDate:{
                
                mask: {
                    type: String,
                    default: ''
                },

                isBirthDate: {
                    type: Boolean,
                    default: false
                }

            },

            type: {
                type: String,
                default: ''
            },

            wsUrl: {
                type: String,
                default: ''
            },

            isUploadImage: {
                type: Boolean,
                default: false
            },

            largeImage: {
                type: String,
                default: ''
            },

            affiliationURL: [{

                affiliation : {
                    type: Schema.Types.ObjectId,
                    ref: 'Affiliation'
                },

                type: {
                    type: String,
                    default: ''
                },

                url: {
                    type: String,
                    default: ''
                }

            }]
        },

        survey: {

            gender:{
                
                valueMale: {
                    type: String,
                    default: ''
                },
                
                valueFemale: {
                    type: String,
                    default: ''
                },

                isGender: {
                    type: Boolean,
                    default: false
                }

            }, 

            birthDate:{
                
                mask: {
                    type: String,
                    default: ''
                },

                isBirthDate: {
                    type: Boolean,
                    default: false
                }

            },

            smallImage: {
                type: String,
                default: ''
            },

            targetBlankUrl: {
                type: String,
                default: ''
            },

            type: {
                type: String,
                default: ''
            },

            isUploadImage: {
                type: Boolean,
                default: false
            },

            wsUrl: {
                type: String,
                default: ''
            },

            affiliationURL: [{

                affiliation : {
                    type: Schema.Types.ObjectId,
                    ref: 'Affiliation'
                },

                type: {
                    type: String,
                    default: ''
                },

                url: {
                    type: String,
                    default: ''
                }

            }]


        }

    },


    frequencie : {
        type: String,
        default: ''
    },


    isBalcony : {
        type: Boolean,
        default: false
    },

    isQuestionHall : {
        type: Boolean,
        default: false
    },

    isSponsoring : {
        type: Boolean,
        default: false
    },

    isSurvey : {
        type: Boolean,
        default: false
    },


    mainQuestion : {

        title : {
            type: String,
            default: ''
        },

        description : {
            type: String,
            default: ''
        },

        answerList : [{

            action :{

                type: {
                    type: String,
                    default: ''
                },

                field: {
                    type: String,
                    default: ''
                },

                fieldTag: {
                    type: String,
                    default: ''
                },

                textConfirmation: {
                    type: String,
                    default: ''
                },

                textInput: {
                    type: String,
                    default: ''
                }
            },

            answer: {
                type: String,
                default: ''
            }
        }]
    },


    name : {
        type: String,
        default: ''
    },


    segmentation : {

        age: {

            moreThan: {
                type: Number,
                default: 0
            },

            lessThan: {
                type: Number,
                default: 0
            },
        },


        dddRegion: [{
            type: String,
            default: ''
        }],


        dynamicSegmentation : [{
            type: Schema.Types.ObjectId,
            ref: 'Questions'
        }],


        forbiddenDomains : [{
            type: String,
            default: ''
        }],


        isDesktop : {
            type: Boolean,
            default: false
        },


        isFemale : {
            type: Boolean,
            default: false
        },


        isMale : {
            type: Boolean,
            default: false
        },


        isMobile : {
            type: Boolean,
            default: false
        }

    },

    /*stats : { 

        impressions: {
                type: Number,
                default: 0
        },
        
        clicks: {

            total: {
                type: Number,
                default: 0
            },

            acceptance :{
                type: Number,
                default: 0
            },

            refusal:{
                type: Number,
                default: 0
            }
                
        }
    },*/


    stats : { 

        impressions: [{
                
                created: {
                    type: Date,
                    default: Date.now
                },

                count: {
                    type: Number,
                    default: 0
                }
        }],
        
        clicks: [{

            created: {
                type: Date,
                default: Date.now
            },


            count: {
                type: Number,
                default: 0
            }
                
        }],

        acceptance: [{

            created: {
                type: Date,
                default: Date.now
            },

            acceptanceCount: {
                type: Number,
                default: 0
            },

            refusalCount: {
                type: Number,
                default: 0
            },

        }]
    },



    created: {
        type: Date,
        default: Date.now
    }


},{ versionKey: false });


OfferSchema.plugin(deepPopulate, {});
mongoose.model('Offer', OfferSchema);
