/**
 * This class provide user data reading and updating function.
 * Currently it's accomplished by html5 localStorage
 */


var journey_user_data = {
    "Money": 50,
    "Debt": 0,
    "Health": 100,
    "Stock": {
        "0": 0,
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0
    }
};

var UserData = function() {
    this.init = function () {
        cc.log("#UserData init");
        if (cc.sys.localStorage.getItem("journey_user_data") == null) {
            cc.log("#user data is null");
            this.saveToSystem();
        }
        else {
            cc.log("#user data is not null");
            this.update();
        }
    };
    this.update = function() {
        journey_user_data = JSON.parse(cc.sys.localStorage.getItem("journey_user_data"));
    }
    this.saveToSystem = function() {
        cc.sys.localStorage.setItem("journey_user_data", JSON.stringify(journey_user_data));
    };
    this.getMoney = function() {
        this.update();
        return journey_user_data["Money"];
    };
    this.setMoney = function(num) {
        journey_user_data["Money"] += num;
        this.saveToSystem();
    };
    this.getDebt = function() {
        this.update();
        return journey_user_data["Debt"];
    };
    this.setDebt = function(num) {
        journey_user_data["Debt"] += num;
        this.saveToSystem();
    };
    this.getHealth = function() {
        this.update();
        return journey_user_data["Health"];
    };
    this.setHealth = function(num) {
        journey_user_data["Health"] += num;
        this.saveToSystem();
    };
    this.getAllStock = function() {
        this.update();
        return journey_user_data["Stock"];
    }
    this.getStock = function(id) {
        this.update();
        return journey_user_data["Stock"][id];
    };
    this.setStock = function(id, num) {
        journey_user_data["Stock"][id] += num;
        this.saveToSystem();
    };
}

UserData.create = function() {
        var user_data = new UserData();
        user_data.init();
        return user_data;
    }