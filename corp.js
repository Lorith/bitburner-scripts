const cities = ["Aevum", "Chongqing", "Ishima", "New Tokyo", "Sector-12", "Volhaven"];
const c_div_types = [
    "Agriculture", "Chemical", "Computer Hardware",
    "Fishing", "Healthcare", "Mining",
    "Pharmaceutical", "Real Estate", "Refinery",
    "Restaurant", "Robotics", "Software",
    "Spring Water", "Tobacco", "Water Utilities"
];
const c_mat_types = [
    "AI Cores", "Chemicals", "Drugs",
    "Food", "Hardware", "Plants",
    "Metal", "Minerals", "Ore",
    "Real Estate", "Robots", "Water"
];
const stages = {
    "Agriculture": ["init", "stage1", "stage2"]
};
const boost_mats_stages = {
    "Agriculture": {
        //Hardware, Robots, AI Cores, Real Estate
        "init": [125, 0, 75, 27000],
        "stage1": [2675, 96, 2445, 119400],
        "stage2": [6500, 630, 3750, 84000]
    }
};
const jobs = ["Operations", "Engineer", "Business", "Management", "Research & Development", "Training"];
const boostMaterials = ["Hardware", "Robots", "AI Cores", "Real Estate"];
const levelUpgrades = [
    "Smart Factories", "Smart Storage", "FocusWires",
    "Neural Accelerators", "Speech Processor Implants",
    "Nuoptimal Nootropic Injector Implants", "Wilson Analytics"
];

/** @param {NS} ns */
export async function main(ns) {
    if (!ns.corporation.hasCorporation()) {
        initialize(ns)
    }
}

function initialize(ns) {
    const corpname = "Lethis";
    const startdiv = { "name": "Farming", "type": "Agriculture" };
    const sellmats = ["Food", "Plants"];
    let fund = true;
    if (ns.getPlayer().bitNodeN == 3) fund = false;

    ns.corporation.createCorporation(corpname, fund);
    ns.corporation.expandIndustry(startdiv.type, startdiv.name);
    for (let city of cities) {
        try { ns.corporation.expandCity(startdiv.name, city) } catch { };
        for (let sellmat of sellmats) {
            ns.corporation.sellMaterial(startdiv.name, city, sellmat, "MAX", "MP");
        }
    }
}