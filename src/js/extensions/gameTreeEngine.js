export default class GameTreeEngine {
    constructor(treePath) {
        this.missions = [
            {
                "and": ["rock", "fish"]
            },
            {
                "or": [
                    {"and": ["rock", "fish"]},
                    {
                        "and": ["rock", {"and": ["fish", "seal"]}
                        ]
                    }
                ]
            },
            {
                "and": ["rock", {
                    "and": ["fish", "seal"]
                }]
            }
        ];
    }

    getInitialMission() {
        return this.getMission(1);
    }

    getOneMission() {
        return this.getMission(Math.random() * this.datas.length);
    }

    getMission(id) {
        return this.missions == null ? null : this.missions[id];
    }
}