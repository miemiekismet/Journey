var system_data = {
    "Day": 1,
    "Goods": {
        "0": -1,
        "1": -1,
        "2": -1,
        "3": -1,
        "4": -1,
        "5": -1
    },
    "Updated": false
};

var SystemData = function() {
    this.init = function () {
        cc.log("#SystemData init");
        if (cc.sys.localStorage.getItem("system_data") == null) {
        cc.log("#system data is null");
            this.saveToSystem();
        }
        else {
        cc.log("#system data is not null");
            system_data = JSON.parse(cc.sys.localStorage.getItem("system_data"));
        }
    };
    this.saveToSystem = function() {
        cc.sys.localStorage.setItem("system_data", JSON.stringify(system_data));
    };
    this.getDay = function() {
        return system_data["Day"];
    };
    this.setDay = function() {
        system_data["Day"]++;
        system_data["Updated"] = false;
        this.saveToSystem();
    };
    this.getGoods = function() {
        var goods = new Array();
        if (!system_data["Updated"]) {
            this.updateGoods();
        }
        for(var i in system_data["Goods"]){
            var good = system_data["Goods"][i];
            if (good != -1){
                goods.push(i);
            }
        }
        return goods;
    }

    this.getPrices = function() {
        var prices = new Array();
        if (!system_data["Updated"]) {
            this.updateGoods();
        }
        for(var i in system_data["Goods"]){
            var good = system_data["Goods"][i];
            if (good != -1){
                prices.push(good);
            }
        }
        return prices;
    }

    this.getPrice = function(good_num) {
        if (!system_data["Updated"]) {
            cc.log("###Warning: unexpected logic - get price before init it###");
            this.updateGoods();
        }
        return system_data["Goods"][good_num];
    }

    this.updateGoods = function(){
        var n = goods_num;
        var top = 2 / 3;
        var bottom = 1 / 3;
        var m = Math.floor((bottom + Math.random() * (top - bottom)) * n);
        cc.log("#Today has: " + m + " goods");
        var chosen = new Array();
        for (var i = 0; i < n; i++) {
            cc.log("chosen.length" + chosen.length);
            if (chosen.length < m) {
                chosen.push(i);
            }
            else {
                if (Math.random() > m / (i + 1)) {
                    chosen[Math.floor(Math.random() * m)] = i;
                }
            }
        }
        var chosen_prices = this.updatePrice(chosen);
        cc.log("Chosen: ");
        for (var i = 0; i < n; i++) {
            system_data["Goods"][i] = -1;
        }
        for (var j = 0; j < m; j++) {
            system_data["Goods"][chosen[j]] = chosen_prices[j];
            cc.log(chosen[j] + ": " + chosen_prices[j]);
        }
        system_data["Updated"] = true;
        this.saveToSystem();
    }
    this.updatePrice = function(goods_today){
    var prices = new Array();
        for (var i in goods_today) {
                var good = goods_today[i];
                var price = Math.floor(goods_price_bottom[good]
                    + Math.random() * (goods_price_top[good] - goods_price_bottom[good]));
                prices.push(price);
            }
        return prices;
    }
}

SystemData.create = function() {
    var system_data = new SystemData();
    system_data.init();
    return system_data;
}