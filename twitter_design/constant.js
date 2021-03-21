const define = (name, value) => {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
};

define("max_redis_offset", "500");
define("user_collection", "users");
define("tweet_collection", "tweets");
define("unknown_error","An Error has occured");
define("connect_error","Error while connecting");
define("username_taken","Username is already taken");
define("incorrect_email_password","Email or Password is incorrect");
define("registration_success","Registered successfully");
define("shared_tweet","tweet is shared");
define("email_already_present","email is already present");
define("please_register", "Please register first then Login");
define("follow_request","follow request processed");