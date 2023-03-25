/** @param {NS} ns */
export async function main(ns) {
    ns.alert("You shouldn't be calling objects directly.  Use import {target1, target2} from '/utils/libs/objects.js' instead.");
}

export class deathcry {
    /** Contains information to pass through a port when a script ends.
     * @typedef {object} deathcry
     * @constructor
     * @param listeners (string/array) Who is listening for this cry?
     * @param {number} pid Readonly proccess id
     * @param {string} cry_type What type of cry is it?  Listener has to figure out what this is for.
     * @param {string} host Hostname of who is running the script this is from.
     * @param data (best as dictionary) What data are we trying to send back to the listener?
     */
    constructor(listeners, pid, cry_type, host, data) {
        this.listeners = listeners;
        this.process_id = pid;
        this.cry_type = cry_type;
        this.host = host;
        this.data = data;
    }
    get process_id() { return process_id }
    get host() { return host }
}

export class server_data {
    /** @typedef {{
    current:number,min:number,difference:number,
    backdoor:boolean,rooted:boolean,
    port_lock:number,min_skill:number,
    money_per_hack:{current:number,max:number}
    }} serv_security */

    /**@typedef {{
    threads_needed:{
        to_hack:number,
        to_grow:{max:number,counter_hack:number},
        to_weaken:{min:number,counter_hack:number,counter_grow:number}
    },
    RAM_needed:{
        hacking_ram:number,
        growing_ram:{max:number,counter_hack:number},
        weakening_ram:{min:number,counter_hack:number,counter_grow:number}
    }
    }} script_stats*/

    /** @typedef {{
    money:{current:number,max:number,difference:number,ratio:number},
    security:serv_security,
    script_stats:script_stats,
    ram_cpu:{max:number,used:number,free:number,cores:number}
    }} stats */

    /**
     * @constructor
     * @param {string} name
     * @param {object[]} connections The servers connected to this one.
     * @param {object[]} stats Object containing server stats - serv_stats
     */
    constructor(name, connections, stats) {
        this.name = ""
        this.connected = []
        this.stats = stats
    }
}






/** @typedef {{data:{income: inc2}}} data 
 *  @typedef {{income:{total:{exp:number,money:number},save:{exp:number,money:number}}}} inc2
 */

/** Contains the information needed to track a script
 * @class
 */

export class script_data {
    /** @typedef {{total:{exp:number,money:number},save_point:{exp:number,money:number}}} scriptdata_income */
    /**
     * @typedef {object} script_data
     * @constructor
     * @param {number} pid Process ID, read-only after creation.
     * @param {string} name Name to identify the script by.
     * @param {string} type Type of script, usable for misc stuff from other funcs.
     * @param {number} cost How much RAM the script uses.
     * @param {Object[]} servers Dictionary containing host: name, target: name.
     * @param {scriptdata_income} income Dictionary containing total + save_point, each with exp + money
     */
    constructor(pid, name, type, cost, servers, income) {
        this.pid = pid
        this.name = name
        this.type = type
        this.cost = cost
        this.servers = { "name": servers.name, "target": servers.target, "test": 0 }
        /** @see scriptdata_income */
        this.income = income
    }
}



export class stack{
    constructor(input=""){
        if (input != "") this.#data = [...input]
        else this.#data = []
    }
    clean_push(input){if (!this.#data.includes(input)) this.#data.unshift(input)}
    peek(pos=0){
        if (this.#data.length > 0) return this.#data[pos]
        else return null
    }
    pop() {return this.#data.shift()}
    push(input){this.#data.unshift(input)}
    remove(target){
        if (typeof(target) == "number") this.#data.splice(target, 1)
        else this.#data.splice(this.#data.indexOf(target), 1)
    }
}
export class queue extends stack{
    constructor(input=""){
        super(input)
    }
    clean_push(input){if (!this.#data.includes(input)) this.#data.push(input)}
    push(input){this.#data.push(input)}
}


export const objs = {
    deathcry,
    server_data,
    script_data,
    stack,
    queue
}