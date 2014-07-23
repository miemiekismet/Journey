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

function SystemData() {
    this.init = function () {
        cc.log("#SystemData init");
        if (sys.localStorage.getItem("system_data") == null) {
            sys.localStorage.setItem("system_data", system_data);
        }
        else {
            this.saveToSystem();
        }
    };
    this.saveToSystem = function() {
        sys.localStorage.setItem("system_data", system_data);
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
    this.updateGoods = function(){
        var n = goods_num;
        var top = 2 / 3;
        var bottom = 1 / 3;
        var m = Math.floor((bottom + Math.random() * (top - bottom)) * n);
        cc.log("m:" + m);
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
            i++;
        }
        var chosen_prices = this.updatePrice(chosen);
        cc.log("Chosen: ");
        for (var j = 0; j < m; j++) {
            system_data["Goods"][chosen[j]] = chosen_prices[j];
            cc.log(chosen[j] + ": " + chosen_prices[j]);
        }
        system_data["Updated"] = true;
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
