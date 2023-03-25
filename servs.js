import {server_ram_levels, safePrompt} from "./libs/shard/free.js";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
    const servs = ns.getPurchasedServers();
    const player_money = ns.getServerMoneyAvailable("home");
    var cost = null;
    var readable_cost = null;
    var choice_list = [];
    if (servs.length == 0) {
        choice_list = ["Buy", "Find Cost", "Manager"];
    } else if (servs.length == ns.getPurchasedServerLimit()) {
        choice_list = ["Upgrade", "Find Cost", "Rename", "Remove", "Manager"];
    } else {
        choice_list = ["Buy", "Upgrade", "Find Cost", "Rename", "Remove", "Manager"];
    }
// temporary, as it isn't done yet!
choice_list.splice(choice_list.length - 1, 1);
// this just removes manager as an option.
    const command = await safePrompt(ns, "What task?", {type: "select", choices: choice_list});
    var name = null;
    var ram = 0;
    var current_ram = 0;

    var maxram = ns.getPurchasedServerMaxRam();
    var ram_array = [];
    ram_array = server_ram_levels;
    if (ram_array[ram_array.length-1] > maxram) {
        ram_array.splice(ram_array.indexOf(maxram)-1,ram_array.length - ram_array.indexOf(maxram));
    }

    if (command == "Buy") {
        if (servs.length >= ns.getPurchasedServerLimit()) {
            ns.alert("You already have as many servers as you are allowed!");
            ns.exit();
        }
        name = await safePrompt(ns, "Please enter a name for the server.", {type: "text"});
        ram = await safePrompt(ns, "How much RAM for the server?", {type: "select", choices: ram_array});
        cost = ns.getPurchasedServerCost(ram);
        readable_cost = ns.formatNumber(cost);
        if (player_money < cost) {
            ns.alert("Unable to afford server at a cost of " + readable_cost + "!");
            ns.exit();
        }
        else {
            if (await safePrompt(ns, "Purchase server for " + readable_cost + "?")) {
                ns.purchaseServer(name, ram);
            }
        }
    }
    else if (command == "Remove") {
        if (servs.length == 0) {
            ns.alert("You can't get rid of something you don't have.");
            ns.exit();
        }
        name = await safePrompt(ns, "Which server?", {type: "select", choices: servs});
        if (await safePrompt(ns, "Really get rid of the server: " + name + "?")) {
            ns.deleteServer(name);
        }
    } else if (command == "Find Cost" || command == "Upgrade") {
        var upgradable = ["All"];
        for (let i = 0; i < servs.length; i++){
            upgradable.push(servs[i]);
        }
        var upgradetarget = await safePrompt(ns, "Specific server, or all?", {type: "select", choices: upgradable});
        if (upgradetarget == "All") {
            ram = await safePrompt(ns, "How much RAM would you like to upgrade to?", {type: "select", choices: ram_array});
            var total_cost = 0;
            for (let serv of servs) {
                total_cost += Math.max(ns.getPurchasedServerUpgradeCost(serv, ram), 0);
            }
            if (command == "Upgrade") {
                if (player_money < total_cost) {
                    ns.alert("Cannot afford to upgrade all servers to " + ns.formatRam(ram) + " for a cost of " + ns.formatNumber(total_cost) + "!");
                    ns.exit();
                } else {
                    if (await safePrompt(ns, "Are you sure you want to spend " + ns.formatNumber(total_cost) + " on upgrading all servers to " + ns.formatRam(ram) + "?")) {
                        for (let serv of servs) {
                            ns.upgradePurchasedServer(serv, ram);
                        }
                    }
                }
            } else {
                ns.alert("It will cost " + ns.formatNumber(total_cost) + " to upgrade all servers to " + ns.formatRam(ram) + ".");
            }
        } else {
            var temp_ram_list = ram_array;
            temp_ram_list.splice(0, 1+ temp_ram_list.indexOf(ns.getServerMaxRam(upgradetarget)));
            ram = await safePrompt(ns, "How much RAM would you like to upgrade to?", {type: "select", choices: temp_ram_list});
            cost = ns.getPurchasedServerUpgradeCost(upgradetarget, ram);
            if (command == "Upgrade") {
                if (player_money < cost) {
                    ns.alert("You cannot afford to upgrade the server to " + ns.formatRam(ram) + " for the cost of " + ns.formatNumber(cost) + "!");
                    ns.exit();
                } else {
                    if (await safePrompt(ns, "Are you sure you want to upgrade " + upgradetarget + " to " + ns.formatRam(ram) + " for a cost of " + ns.formatNumber(cost) + "?")) {
                        ns.upgradePurchasedServer(upgradetarget, ram);
                    }
                }
            } else {
                ns.alert("It will cost " + ns.formatNumber(cost) + " to upgrade " + upgradetarget + " to " + ns.formatRam(ram) + ".");
            }
        }
    } else if (command == "Rename" || command == "Remove") {
        name = await safePrompt(ns, "Which server?", {type: "select",choices: servs});
        if (command == "Rename") {
            var newname = await safePrompt(ns, "What name should " + name + " be changed to?", {type: "text"});
            ns.renamePurchasedServer(name, newname);
        } else {
            if (await safePrompt(ns, "Are you certain you want to remove the server " + name + "?")) {
                ns.deleteServer(name);
            }
        }
    } else if (command == "Manager") {
        ns. alert("This feature is not coded yet.");
    }
}