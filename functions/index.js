"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.database();
const { dialogflow, Suggestions, BasicCard, Button, Image, SimpleResponse, SignIn } = require('actions-on-google');
const app = dialogflow({
    clientId: "636159713123-41ab6or5hf86ouihqlqr58a5fvpthfg1.apps.googleusercontent.com",
    debug: true
});
var suggestion;
let suggest
var events = [];
//............................................................................................................
//Sign in user................................................................................................

// Intent that starts the account linking flow.
app.intent('Start Signin', (conv) => {
    conv.ask(new SignIn('To get your account details'));
  });



app.intent('Get Signin', (conv, params, signin) => {
  if (signin.status === 'OK') {
    const payload = conv.user.access.token;
    conv.ask(`${payload}`);
  } else {
    conv.ask(`I won't be able to save your data, but what do you want to do next?`);
  }
});


//About Technofest............................................................................................
app.intent('about', conv => {
    const category = (conv.parameters['about']);
    return db.ref('about').once("value", snapshot => {
        const data = snapshot.val();
        conv.ask(new SimpleResponse({
            speech: `${data[category]["speech"]}`,
            text: `${data[category][`upperText`]}`,
          }));
        // Create a basic card
        conv.ask(new BasicCard({
            text: `${data[category]['text']}`,
            subtitle: `${data[category]['subtitle']}`,
            title: `${data[category]['title']}`,
            buttons: new Button({
               title: 'Website',
               url: `${data[category]['websiteUrl']}`,
            }),
            image: new Image({
               url: `${data[category]['imageUrl']}`,
               alt: `Technofest`,
            }),
            display: 'CROPPED',
        }));
        if(category === 'technojam'){
            suggest = ['Quit', 'Technofest', 'Events', 'Galgotias', 'Contact us'];
        }else if(category === 'technofest'){
            suggest = ['Quit', 'Events', 'Contact us'];
        }else if(category === 'Galgotias'){
            suggest = ['Quit', 'Technofest', 'Events', 'Technojam', 'Contact us'];
        }
        conv.ask(new Suggestions(suggest));
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
    }else if(option === 'technojam'){
        return db.ref('about').once("value", snapshot => {
            const data = snapshot.val();
            conv.ask(new SimpleResponse({
                speech: `${data["technojam"]["speech"]}`,
                text: `${data["technojam"][`upperText`]}`,
              }));
            // Create a basic card
            conv.ask(new BasicCard({
                text: `${data["technojam"]['text']}`,
                subtitle: `${data["technojam"]['subtitle']}`,
                title: `${data["technojam"]['title']}`,
                buttons: new Button({
                   title: 'Website',
                   url: `${data["technojam"]['websiteUrl']}`,
                }),
                image: new Image({
                   url: `${data["technojam"]['imageUrl']}`,
                   alt: `TechnoJam`,
                }),
                display: 'CROPPED',
            }));
            suggest = ['Quit', 'Technofest', 'Events', 'Galgotias', 'Contact us'];
            conv.ask(new Suggestions(suggest));
        }); 
    } else if(option === 'technofest'){
        return db.ref('about').once("value", snapshot => {
            const data = snapshot.val();
            conv.ask(new SimpleResponse({
                speech: `${data["technofest"]["speech"]}`,
                text: `${data["technofest"][`upperText`]}`,
              }));
            // Create a basic card
            conv.ask(new BasicCard({
                text: `${data["technofest"]['text']}`,
                subtitle: `${data["technofest"]['subtitle']}`,
                title: `${data["technofest"]['title']}`,
                buttons: new Button({
                   title: 'Website',
                   url: `${data["technofest"]['websiteUrl']}`,
                }),
                image: new Image({
                   url: `${data["technofest"]['imageUrl']}`,
                   alt: `Technofest`,
                }),
                display: 'CROPPED',
            }));
            suggest = ['Quit', 'Events', 'Technojam', 'Galgotias', 'Contact us'];
            conv.ask(new Suggestions(suggest));
        });
    } else if(option === 'galgotias'){
        return db.ref('about').once("value", snapshot => {
            const data = snapshot.val();
            conv.ask(new SimpleResponse({
                speech: `${data["galgotias"]["speech"]}`,
                text: `${data["galgotias"][`upperText`]}`,
              }));
            // Create a basic card
            conv.ask(new BasicCard({
                text: `${data["galgotias"]['text']}`,
                subtitle: `${data["galgotias"]['subtitle']}`,
                title: `${data["galgotias"]['title']}`,
                buttons: new Button({
                   title: 'Website',
                   url: `${data["galgotias"]['websiteUrl']}`,
                }),
                image: new Image({
                   url: `${data["galgotias"]['imageUrl']}`,
                   alt: `Galgotias`,
                }),
                display: 'CROPPED',
            }));
            suggest = ['Quit', 'Technofest', 'Events', 'Technojam', 'Contact us'];
            conv.ask(new Suggestions(suggest));
        });
    }
});



//Functions..............................................................................................



exports.googleAction = functions.https.onRequest(app);
 