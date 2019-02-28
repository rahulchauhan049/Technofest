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
var events = ['Quit'];

app.intent("events", conv => {
    return db.ref("events/").once("value", snapshot => {
        const data = snapshot.val();
        for (let x in data){
            events.push(`${data[x]["name"]}`);

        }
        conv.ask(`There are many events in technofest such as : ${events.toString()}.  \nClick below suggestions to know more.`);
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
            subtitle: `The event is on ${data["events"][id]["date"]}`,
            text: `${data["events"][id]["description"]}  \n**venue** : ${data["events"][id]["venue"]}  \nThe Registration will end on ${data["events"][id]["registration_ends"]}`, 
            title: `${data["events"][id]["name"]}`,
            display: 'CROPPED',
        }));
        conv.ask(new Suggestions(events));
    });
});


app.intent("option", (conv, input, option) => {
    if(option === 'events'){
        return db.ref("events/").once("value", snapshot => {
            const data = snapshot.val();
            for (let x in data){
                events.push(`${data[x]["name"]}`);
    
            }
            conv.ask(`There are many events in technofest such as : ${events.toString()}.  \nClick below suggestions to know more.`);
            conv.ask(new Suggestions(events));
            });
    }else if(option === 'contact'){
        conv.ask(new BasicCard({
            text: `Feel free to contact us.  \n**swetank** : 7042435242  \n**Honey** : 9821443576`,
            title: 'Contact us',
            buttons: new Button({
              title: 'Facebook',
              url: 'https://www.facebook.com/technojam.scse/',
            }),
            image: new Image({
              url: 'https://www.efi.com/library/efi/images/banners/about_efi/contact_company_banner.jpg?h=280&w=980',
              alt: 'Contact us',
            }),
            display: 'CROPPED',
          }));
    }
});



//Functions..............................................................................................



exports.googleAction = functions.https.onRequest(app);
 