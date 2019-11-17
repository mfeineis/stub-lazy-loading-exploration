
Acme.AppEvents.logEvent = function (topic, data) {
    console.log("Acme.AppEvents.logEvent", topic, data);
};
Acme.__buffer.replay();
