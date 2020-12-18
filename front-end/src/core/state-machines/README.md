Trying to develop a ui codebase that is as easily extensible as possible...
... which means it has to be easy to understand/read, and also highly decoupled, so parts can be changed, or new things can be added, without messing everything else up.

Going to be using StateMachines to try to accomplish this... currently stream-of-conciousnessing a way to solve the problem of how extremely flexible UI code needs to be, almost everything about it needs to be able to change easily, since this allows designers to change UX, which is extremely important. 

For example the app currently uses a popup, which partially exposes the main view in the background, to provide places for pages like "Account", "Contact", etc. But this specific UX design choice could change many times. Maybe the "Account" popup needs to be treated as if it were a page in the main view in the future, or maybe it needs to be integrated into the current main view in some way... so it cannot be defined as a "popup" or a "page" or even a "view" really (since it could be part of some other "view")... so what is essential to it that can constitute its definition? Probably the functionality it provides to the user... it allows the user to do stuff like logout, see, and edit their account information... should 'see' be included in there?

I think the only solution is to have many heirarchical layers of abstraction, with the highest layer of abstraction being the things about the app that are LEAST LIKELY TO CHANGE, and the things lower down the tree being progressively more and more likely to change (this is like the Keyline Scale of Permanance!). 

So, for this app what are the most essential functions that make the app what it is, and whithout which the app would be some other sort of app entirely?

    -Rank physical locations according to how closely they conform with user defined preferences.
    ... no, not user-centric/business-centric enough...
    -Communicate to users the relative compatability of physical locations with preferences that user has previously defined.

this is the top layer of abstraction, now lets see if we can make that sentence into a state machine

states: {
    
    getUserPreferences: {
        
        //
    },
    communicateLocationCompatabilities: {
        
    }
}

However, this is missing some essential aspects of the app, aspects that will never change. The app needs USERS, and it needs to sustain itself (this means it needs to make profit, monetary or otherwise). However, maybe these should be separate concerns from the APP, after all the users could be brought to the app by an outside source, a salesforce or something, meaning the App does not need to concern itself with getting or keeping users. And monetization is far to complex to actually be encoded in code. The app needs to concern itself only with providing value to users, and then specific, changeable, monetization strategies can take advantage of that to support the app. 

acquire user > provide value to that user > collect value in return

This is a useful upper layer of abstraction, however it cannot be made into a state machine because the three items can, and probably will, all be occuring simultaneously. I think we would refer to them as separate processess.

So the top layer of the state machine should be the most essential and permanent aspects of that application which have no overlap (ie. if the states are "1", "2" and "3" the app can only be in one of those states it cannot be in "1.5" or "1/2" or "1&2")

Okay, based on the above, what are the substates of getUserPreferences and communicateLocationCompatabilities respectively (these may change, will be more specific).

getUserPreferences: {
    states: {

    }
}

Idea for Xstate based package, to extend features:
    -CLI tool that generates machines using the machine name as folder, and then three files for actions, machine, and states
    -