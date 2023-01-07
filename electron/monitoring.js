class TimeMonitor {
    constructor(name, bucketSizes) {
        this.name = name;
        this.sum = 0;
        this.count = 0;
        this.buckets = new Map();
        bucketSizes.forEach(size => this.buckets.set(size, 0));
    }

    start() {
        var begin = new Date();
        return () => {
            var end = new Date();
            setTimeout(() => this.#stop(begin, end), 0);
        };
    }

    #stop(begin, end) {
        this.count++;
        var duration = end.getMilliseconds() - begin.getMilliseconds();
        this.sum += duration;
        for(var bucket of this.buckets.entries()) {
            if(bucket[0] < duration)
                bucket[1]++;
        }
    }

    log() {
        console.log("TimeMonitor: ", {
            name: this.name,
            sum: this.sum,
            count: this.count,
            avg: this.sum / this.count,
            buckets: this.buckets
        });
    }
}

const BUCKET_SIZES = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];

exports.createTimeMonitor = (name) => new TimeMonitor(name, BUCKET_SIZES);