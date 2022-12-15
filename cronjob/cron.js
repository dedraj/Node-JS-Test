'use strict';
const cron = require('node-cron');
const User = require('../Models/User.model');

const cronPatterns = {
    "every-second": "* * * * * *",
    "every-minute": "* * * * *",
    "every-ten-minute": "10 * * * *",
    "every-odd-minute": "*/3 * * * *",
    "every-even-minute": "*/2 * * * *",
    "every-hour": "0 * * * *",
    "every-odd-hour": "0 */3 * * *",
    "every-even-hour": "0 */2 * * *",
    "every-day-12:00AM": "0 0 * * *"
};

module.exports = new class CronScheduler {
    async updateLogedInUserTime() {
        try {
            cron.schedule(cronPatterns["every-ten-minute"], async () => {
                const allMongoData = await User.find({});
                allMongoData.forEach(async ele => {
                    var user = await User.findById(ele.id);
                    var loginTimeTillNow = ((Number(Date.now()) - Number(Date.parse(user.loginTimeDate))) / 1000);
                    await user.updateOne({loginTime: loginTimeTillNow});
                })
                console.log("Cron after every 10 min");
            })
        } catch (error) {
            console.log(`Error while updating login time: `, error.toString());
        }
    }
};