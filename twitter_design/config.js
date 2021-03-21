var config = {
    'development' : {
        'secret': 'saodmipkbp',
        'database': 'mongodb://localhost:27017/twitter',
    },
};

const env = process.env.NODE_ENV || "development"
module.exports = config[env];