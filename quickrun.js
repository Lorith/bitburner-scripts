import {BaseServer} from "libs/if.server"
import {servers} from "./libs/shard/free"
/** @param {NS} ns */
export async function main(ns) {
    //ns.disableLog("ALL")
    ns.clearLog()
    ns.tail()
    //ns.codingcontract.createDummyContract("Encryption I: Caesar Cipher")
    //ns.exit()
    const file = ns.args[0]
    const data = ns.codingcontract.getData(file)
    //const data = ["ABCDEFGHIJKLMNOPQRSTUVWXYZ","E"]
    ns.print(data)
    let result = cipher1(ns, data)
    ns.print(result)
    ns.print(ns.codingcontract.attempt(result, file))
    ns.exit()



//    let targ = new BaseServer(ns, ns.getServer("sigma-cosmetics"));
//    let host = ns.getServer("n00dles");
//    targ.save();
    // const dat = JSON.stringify(targ);
    // ns.write("/data/servers/"+targ.hostname+".txt", dat);

    const dat = JSON.parse(ns.read("/data/servers/"+targ.hostname+".txt"));
    ns.print("Test");
    let serv = new BaseServer(ns, host);
    serv.load("sigma-cosmetics");
    ns.print(dat.hostname+`\n`+serv.id);
    // let c = ns.corporation
    // let x = c.getCorporation().divisions;
    // let select_corp = await ns.prompt("Which division?", { type: "select", choices: x });
    // ns.print(c.getDivision(select_corp));
    // ns.print(x);
    // for (let city of cities) {
    //     c.getOffice()
    // }
    /**
     * c.levelUpgrade(name) to lvl upgrade 1x
     * c.getUpgradeLevel(name) to see what lvl it is
     * c.getUpgradeLevelCost(name) to see next lvl cost
     */
    ns.exit();
}


    /* Get servers with highest money:
    ns.print(servers.length)
    let servs = servers
    let sorted = []
    let max = 0
    let server = ""
    while (servs.length > 0){
        for (let serv of servs){
            let servmoney = ns.getServerMaxMoney(serv)
            if (servmoney > max) {
                max = servmoney
                server = serv
            }
            if (servmoney == 0) {
                const filt = (x) => x !== serv
                servs = servs.filter(filt)
            }
        }
        servs.splice(servs.indexOf(server),1)
        sorted.push(server)
        max = 0
    }
    ns.write("highest_money_servs.txt", '"' + sorted.shift() + '"', "w")
    while (sorted.length > 0) ns.write("highest_money_servs.txt", ',"' + sorted.shift() + '"', "a")
    ns.print(`${sorted}\n${sorted.length}\n${servers.length}`);ns.exit()
    */