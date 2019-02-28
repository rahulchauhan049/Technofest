"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.database();
const { dialogflow, Suggestions, BasicCard, Button, Image, SimpleResponse } = require('actions-on-google');
const app = dialogflow({
    debug: true
});
var suggestion;
var events = [];

app.intent("events", conv => {
    return db.ref("events/").once("value", snapshot => {
        const data = snapshot.val();
        var events = [];
        for (let x in data){
            events.push(`${data[x]["name"]}`);

        }
        conv.ask(`The events of Technofest are : ${events.toString()}`);
        conv.ask(new Suggestions(events));
        });
    });


app.intent('singleEvent', conv => {
    return db.ref("/").once("value", snapshot => {
        const data = snapshot.val();
        let rawInput = (conv.query);
        const id = data["EventId"][rawInput]["id"];
        conv.ask(`Here's some detail about ${rawInput}`);
        conv.ask(new BasicCard({
            text: `${data["events"][id]["name"]}`, 
            subtitle: 'This is a subtitle',
            title: 'Title: this is a title',
            display: 'CROPPED',
        }));
    });
});


app.intent("option", (conv, input, option) => {
    if(option === 'events'){
        events(conv);
    }else if(option === 'contact'){
        contact(conv);
    }
});



//Functions..............................................................................................
//Event function
function events(conv){
    return db.ref("events/").once("value", snapshot => {
        const data = snapshot.val();
        
        conv.ask(`this is my ${data["2edb2db9aae733dd5c201a588e05f4d3"]["contact_name"]}`)

    });
}

function contact(conv){
    suggestion = ['a'];
    conv.ask(`you choose contact`);
}

exports.googleAction = functions.https.onRequest(app);
 