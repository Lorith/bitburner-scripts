/** @param {NS} ns */
export async function main(ns) {
    const target = ns.args[0];
    const max_money = ns.args[1]; // ns.getServerMaxMoney(target);
    const min_money = (max_money * 0.9);
    const trig_money = (max_money * 0.7);
    const max_sec = ns.args[2]; //(ns.getServerMinSecurityLevel(target) + 3);
    const trig_sec = max_sec - 2;
    var mode = 0;
    var current_money = 0;
    var current_sec = 0;
    while(true) {
        current_money = ns.getServerMoneyAvailable(target);
        current_sec = ns.getServerSecurityLevel(target);
        if(current_sec > max_sec && mode != 1) {
            mode = 1;
        }
        else if(current_money < trig_money && mode != 2) {
            mode = 2;
        }
        else if (current_sec < trig_sec && current_money > min_money) {
            mode = 0;
        }
        switch(mode) {
            case 0:
                await ns.hack(target);
                break;
            case 1:
                await ns.weaken(target);
                break;
            case 2:
                await ns.grow(target);
                break;
            default:
                ns.sleep(30000);
                break;
        }
    }
}