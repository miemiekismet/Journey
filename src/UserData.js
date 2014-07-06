/**
 * This class provide user data reading and updating function.
 * Currently it's accomplished by html5 localStorage
 */

var user_data = {
    "Money": 0,
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

function UserData() {
    this.init = function () {
        cc.log("#UserData init");
        if (sys.localStorage.getItem("user_data") == null) {
            sys.localStorage.setItem("user_data", user_data);
        }
        else {
            this.saveToSystem();
        }
    };
    this.saveToSystem = function() {
        sys.localStorage.setItem("user_data", user_data);
    };
    this.getMoney = function() {
        return user_data["Money"];
    };
    this.setMoney = function(num) {
        user_data["Money"] = num;
        this.saveToSystem();
    };
    this.getDebt = function() {
        return user_data["Debt"];
    };
    this.setDebt = function(num) {
        user_data["Debt"] = num;
        this.saveToSystem();
    };
    this.getHealth = function() {
        return user_data["Health"];
    };
    this.setHealth = function(num) {
        user_data["Health"] = num;
        this.saveToSystem();
    };
    this.getAllStock = function() {
        return user_data["Stock"];
    }
    this.getStock = function(id) {
        return user_data["Stock"][id];
    };
    this.setStock = function(id, num) {
        user_data["Stock"][id] = num;
        this.saveToSystem();
    };
}