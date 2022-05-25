const mongoose = require('mongoose');
const feedbackSchema = mongoose.Schema(
    {
        username:
        {
            type:String,
        },
        data_id_o:
        {
            type:String,
        },
        data_id_d:
        {
            type:String,
        },
        danger_index:
        {
            type:String,
        },
        lighting: {
            type : String,
            //required : true
        },
        ranking: {
            type: String,
           // required : true,
            unique:false
        },
        remark: {
            type : String,
            //required : true
        }
        /*routesWithStreetNames: [{
            type: Array
        }],
        sentiment: {
            type: Number
        }*/
        
    }
);
module.exports = mongoose.model('feedback',feedbackSchema);