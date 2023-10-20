exports.SubscriptionService = class SubscriptionService {
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
        channelSubscription.set(id, sender);
        this.subscriptions.set(outChannel, channelSubscription);
    }

    broadcast(outChannel, msg) {
        const failedSenders = [];
        for(let sender of this.#getOrEmptyMap(outChannel).values()) {
            try {
                sender.send(outChannel, msg);
            } catch(error) {
                console.error(`An error occured while broadcasting on channel "${outChannel}: `, error)
            }
        }
    }

    unsubscribeAll(id) {
        for(let channelSubscriptions of this.subscriptions.values()) {
            channelSubscriptions.delete(id);
        }
    }
}