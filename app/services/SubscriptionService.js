class SubscriptionService {
    constructor() {
        this.subscriptions = new Map();
    }

    #getOrEmptyMap(outChannel) {
        let channelSubscription = this.subscriptions.get(outChannel);
        channelSubscription ??= new Map();
        return channelSubscription;
    }

    subscribe(id, outChannel, sender){
        let channelSubscription = this.#getOrEmptyMap(outChannel);
        console.log("Found subscription", channelSubscription);
        channelSubscription.set(id, sender);
        this.subscriptions.set(outChannel, channelSubscription);
    }

    broadcast(outChannel, msg) {
        for(let sender of this.#getOrEmptyMap(outChannel).values()) {
            sender.send(outChannel, msg);
        }
    }
}
exports.subscriptionService = new SubscriptionService();