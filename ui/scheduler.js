const scheduler = Object.seal({
    queue: [],
    busy: false,
    interval: null
})

function runner() {
    if (scheduler.queue.length === 0) {
        clearInterval(scheduler.interval);
        scheduler.interval = null
        return;
    }
    if (!scheduler.busy) {
        let [id, task] = scheduler.queue.shift();
        if (scheduler.queue.some(s=>s[0] === id)){
            return;
        }
        task();
        scheduler.busy = false;
    }
}

function start() {
    if (scheduler.interval === null) {
        scheduler.interval = setInterval(runner, 20)
    }
}

function dispatchTask(task, id) {
    if (scheduler.queue.some(s=>s[0] === id)){
        return;
    }
    scheduler.queue.push([id, task]);
    start()
}

module.exports = {dispatchTask}