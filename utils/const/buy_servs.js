/** @param {NS} ns */
import { get_log_size, server_ram_levels, save_money, pprint} from "/libs/shard/free";


/** @param {NS} ns */
export async function main(ns, buylevel, limitlevel, upgrading) {
    ns.disableLog("ALL");

    ns.clearLog();
    ns.tail();
    await ns.sleep(300);

    const win_size = ns.ui.windowSize();
    const linesize = ns.ui.getStyles().lineHeight;
    const logsize = get_log_size(ns, 36, 34, linesize);
    ns.resizeTail(logsize.width, logsize.height);
    ns.moveTail(win_size[0] - logsize.width - 6, win_size[1] - logsize.height - (Math.ceil(17.06 * linesize * 2.5)));
    let seperator = "===================================="; // 36 long fits 350 wide perfectly
//    ns.tprint("Width per char: ", Math.round(350 * 1000 / 36) / 1000); // 9.722
//    ns.tprint("Height per char at 1.0 line height: ", Math.round(580 * 1000 /34) / 1000); // 17.06
//    ns.tprint("Height per char at 1.5 line height: ", Math.round(580 * 1000 * 1.5 /34) / 1000); // 25.59
    ns.print(seperator);
    pprint(ns,"Shard's Server Manager",36);
    ns.print(seperator);
    let temp = [0, 0, false];
    if (ns.args.length > 1) {
        temp[2] = ns.args[2];
        temp[1] = Math.max(ns.args[1], 0);
        temp[0] = Math.max(ns.args[0], 0);
        ns.print(seperator);
//        ns.resizeTail(350,580); // 350, 580 for 1 line height
    } else {
        ns.print("Error: please use the parameters of:");
        ns.print("  (level of RAM to buy at)");
        ns.print("  (level of RAM to upgrade to)");
        ns.print("  (upgrade: true/false)");
        ns.print(" ");
        ns.print("The RAM level is based on the power of two, or you can look at the list below.");
        ns.print(" ");
        for (let i = 0; i < server_ram_levels.length; i++) {
            let x = i;
            if (i < 10) x = " " + i;
            ns.print(x + ": " + ns.formatRam(server_ram_levels[i]));
        }
        ns.print(seperator);
        //ns.resizeTail(350,580 * 1.5);
//        ns.resizeTail(Math.ceil(36 * 9.722),Math.ceil(34 * 25.59)); //Math.ceil(34 * 17.059)); // 350, 580 for 1 line height
        await ns.sleep(300);
        ns.exit();
    }
    const upgrade = temp[2];
    const buy_ram = server_ram_levels[temp[0]];
    const upgrade_ram_limit = server_ram_levels[temp[1]];
    const max_servs = ns.getPurchasedServerLimit();
    const servs = ns.getPurchasedServers();
    let count = servs.length
    const name = "hackserv-";
    let buyname = name + (1+count);
    let cost = ns.getPurchasedServerCost(buy_ram);
    ns.print("Current server count: ", count, "/", max_servs,".");
    while (count < max_servs) {
        if ((spendable_money(ns) > cost && count < max_servs)) {
            ns.purchaseServer(buyname, buy_ram);
            ns.toast("New server purchased!");
            ns.print("Purchased server " + buyname + " with " + ns.formatRam(buy_ram) + " for cost of " + ns.formatNumber(cost) + ".");
            count += 1;
            //            ns.exec("setup-serv.js", "home", 1, name);
            buyname = name + (1+count);
        }
        await ns.sleep(3000);
    }
    ns.print("Max servers reached!");
    if (upgrade) {
        let check_servs = ns.getPurchasedServers();
        count = 0;
        while (check_servs.length != 0) {
            let serv_ram = 0;
            if (count == check_servs.length) {
                count = 0;
                await ns.sleep(30000);
            }
            serv_ram = ns.getServerMaxRam(check_servs[count]);
            //ns.print("Checking server: " + check_servs[count] + ".");
            if (serv_ram < upgrade_ram_limit && check_servs.includes(check_servs[count])) {
                let nextlevel = server_ram_levels[(server_ram_levels.indexOf(serv_ram) + 1)];
                cost = ns.getPurchasedServerUpgradeCost(check_servs[count], nextlevel);
                while (spendable_money(ns) > cost && nextlevel < upgrade_ram_limit) {
                    nextlevel = server_ram_levels[(server_ram_levels.indexOf(nextlevel) + 1)];
                    cost = ns.getPurchasedServerUpgradeCost(check_servs[count], nextlevel);
//                    ns.print("spendable: ", ns.formatNumber(spendable_money(ns)), "  cost:", ns.formatNumber(ns.getPurchasedServerUpgradeCost(check_servs[count],nextlevel)), "  ", serv_ram, ">", nextlevel, "/", upgrade_ram_limit);await ns.sleep(5000);//ns.exit();
                }
                if (spendable_money(ns) > cost) {
                    ns.upgradePurchasedServer(check_servs[count], nextlevel);
                    ns.toast("Server upgraded!");
                    ns.print("Upgraded server " + check_servs[count] + " with " + ns.formatRam(serv_ram) + " to " + ns.formatRam(nextlevel) + " for cost of " + ns.formatNumber(cost) + ".");
                    check_servs.splice(check_servs.indexOf(check_servs[count]), 1);
                }
            } else {
                if (!check_servs.splice(count, 1)) { await ns.sleep(3000); count++; }
            }
            await ns.sleep(1500);
        }
        let tempmessage = "Finished upgrading servers to max of " + ns.formatRam(upgrade_ram_limit) + "!";
        ns.alert(tempmessage);
        ns.print(tempmessage);
    }
}



/**
 * Return amount of usable money, removing a safety amount from your total.
 * @param save_override This amount of money will be excluded from the total, defaults to save_money.
 */
export function spendable_money(ns, save_override = null) {
    if (save_override == null) { save_override = save_money }
    return ns.getServerMoneyAvailable("home") - save_override;
}