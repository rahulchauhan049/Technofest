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
//............................................................................................................

//About Technofest
app.intent('aboutTechnofest', conv => {
    const category = (conv.parameters['about']);
    return db.ref('about').once("value", snapshot => {
        const data = snapshot.val();
        conv.ask(new SimpleResponse({
            speech: `${data[toString(category)]["speech"]}`,
            text: `${data[toString(category)][`upperText`]}`,
          }));
        // Create a basic card
        conv.ask(new BasicCard({
            text: `${data[toString(category)]['text']}`,
            subtitle: `${data[toString(category)]['subtitle']}`,
            title: `${data[toString(category)]['title']}`,
            buttons: new Button({
               title: 'Website',
               url: `${data[toString(category)]['websiteUrl']}`,
            }),
            image: new Image({
               url: `${data[toString(category)]['imageUrl']}`,
               alt: `Technofest`,
            }),
            display: 'CROPPED',
        }));
    });   
});




//This intent Finds events from database and display it on response and suggestions 
app.intent("events", conv => {
    events = [];

    return db.ref("events/").once("value", snapshot => {
        const data = snapshot.val();
        for (let x in data){
            events.push(`${data[x]["name"]}`);

        }
        conv.ask(`There are many events in technofest such as : ${events.toString()}.  \nClick below suggestions to know more.`);
        events.unshift('Quit');
        conv.ask(new Suggestions(events));
        });
    });

//contact...............................................................................
app.intent('contact', conv => {
    conv.ask("Here's our contact details.");
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
      events.unshift('Quit');
    conv.ask(new Suggestions(events));
});


//This intent run when user ask about a perticular event...................................................
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
        events = [];
        return db.ref("events/").once("value", snapshot => {
            const data = snapshot.val();
            for (let x in data){
                events.push(`${data[x]["name"]}`);
    
            }
            conv.ask(`There are many events in technofest such as : ${events.toString()}.  \nClick below suggestions to know more.`);
            events.unshift('Quit');
            conv.ask(new Suggestions(events));
            });
    }else if(option === 'contact'){
        conv.ask("Here's our contact details.");
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
          events.unshift('Quit');
          conv.ask(new Suggestions(events));
    }
});



//Functions..............................................................................................



exports.googleAction = functions.https.onRequest(app);
 