/** @param {NS} ns */
export async function main(ns) {
    ns.tprint("This should not be called, import instead.")
    ns.exit();
}
const save_home_ram = 128;
const save_other_percent_ram = 5 / 100;
/**
 * @class
 * @param {NS} ns
 * @param server_data Output of ns.getServer
 */
export class BaseServer {
    /**
     * @constructor
     * @param {NS} ns
     * @param server_data Output of ns.getServer
     */
    constructor(ns, server_data) {
        this._ns = ns;
        this._data = server_data;
    }
    get id() { return this._data.hostname}
    get hostname() {return this._data.hostname}
    get cash() {
        return {
            max: this._data.moneyMax,
            current: this._data.moneyAvailable,
            difference: this._data.moneyMax - this._data.moneyAvailable,
            ratio: this._data.moneyMax / this._data.moneyAvailable,
            growth_rate: this._data.serverGrowth
        }
    }
    get security() {
        return {
            min: this._data.minDifficulty,
            current: this._data.hackDifficulty,
            difference: this._data.hackDifficulty - this._data.minDifficulty,
            min_skill: this._data.requiredHackingSkill,
            min_ports: this._data.numOpenPortsRequired,
            open_ports: this._data.openPortCount,
            ftp_port: this._data.ftpPortOpen,
            http_port: this._data.httpPortOpen,
            smtp_port: this._data.smtpPortOpen,
            sql_port: this._data.sqlPortOpen,
            ssh_port: this._data.sshPortOpen,
            admin: this._data.hasAdminRights,
            backdoor: this._data.backdoorInstalled
        }
    }
    get cores() { return this.cpuCores }
    get ram() {
        return {
            max: this._data.maxRam,
            used: this._data.ramUsed,
            free: Math.max(0, (this._data.maxRam - this._data.ramUsed - (this.id === "home" ? save_home_ram : (this._data.maxRam * save_other_percent_ram))))
        }
    }
    get home() {return (this.id === "home");}
    get purchased(){return (this.id != "home" && this.purchased == true);}
    get wild() {return (this.purchased != true);}

    load(name = this.id){
        const dat = JSON.parse(this._ns.read("/_data/servers/"+name+".txt"));
        this._data = dat;
    }
    save(){
        const dat = JSON.stringify(this._data);
        this._ns.write("/_data/servers/"+this.id+".txt", dat);
    }
    /**
        async updateCache(repeat=true, kv=new Map()) {
            do {
                const db = await handleDB();
                let old = await db["get"]("servers", this.id) || {}
                let getters = this.listGetters(this)
                getters.forEach(g => {
                    old[g] = this[g];
                })
                kv.forEach((v,k) => old[k] = v)
    
                await db["put"]("servers", old)
                if (repeat) { await this.ns.asleep(Math.random()*10000) + 55000}
            } while (repeat)
        }
     */
}


/*
 * Company + their stock symbol
 *
 * last updated time
 *
 * full _data
 */