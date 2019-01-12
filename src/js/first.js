var logg = console.log;
var d = document;
d.f = document.querySelector;
d.c = document.createElement;

var _help = require('./_help');

var vTitle = require('./vueTitle');

exports.allcode = () => {

    
    // ALL VUE
    vTitle.run();


    // ALL AFRAME
    var thescene = d.f('a-scene');
    if (thescene.hasLoaded) {
        runcode();
    } else {
        thescene.addEventListener('loaded', runcode);
    }
    function runcode() {
        // Every few sec recalc shadows
        const SHADOWSTANDBY = 1000;
        var intervalID = setInterval(() => {
            thescene.renderer.shadowMap.needsUpdate = true;
        }, SHADOWSTANDBY);

        // Sky Simplicity
        var elsky = d.f('a-sky')
        elsky.setAttribute('geometry', { radius: 1010, segmentsHeight: 24, segmentsWidth: 30, thetaLength: 180 });
        // elsky.setAttribute('material', 'side', 'double');
        elsky.object3D.position.y = 0;
        // Remove stars
        var elstars = d.f('a-entity#stars');
        elstars.object3D.visible = false;
        
        // Refresh if day goes past midnight
        var theday = (new Date()).getDate();
        setInterval(() => {
            if (theday !== (new Date()).getDate()) {
                window.location.reload();
            }
        }, 60000);
    }


    // ALL LOGIC
    if (_help.THEPATH === 'app') {
        // best way to check firebase user exists for 1st time
        var unsubwatchuser = fireauth.onAuthStateChanged((theuser) => {
            unsubwatchuser();

            if (theuser) {
                // alreadyloggedin
                firestore.collection('humans').doc(theuser.uid).get().then((doc) => {
                    if (!doc.exists) {
                        logg('no human uid for this loggedinuser', theuser);
                        return;
                    }
                    var thehandle = doc.data().who_handle;
                    window.location.href = '/' + thehandle;
                }).catch((err) => { logg(err); });
            } else if (_help.localstorage('magic_email')) {
                // logginginorsigninguppostemail
                controllerNewuserenters.allcode();
            } else {
                // totallynewuser
                controllerNewuser.allcode();
            }
        });
    } else {
        var ref1 = firestore.collection("handles").doc(_help.THEPATH);
        var ref2 = firestore.collection("reservedpaths").doc(_help.THEPATH);

        Promise.all([ref1.get(), ref2.get()]).then(([doc1, doc2]) => {
            if (doc1.exists) {
                // realhandle
                controllerUser.allcode();
                firefunctions.httpsCallable('handletopublichuman')({ warmup: true });
                firefunctions.httpsCallable('myevents')({ warmup: true });
                firefunctions.httpsCallable('uidtopublicevents')({ warmup: true });
            } else if (doc2.exists) {
                // reservedpath
                window.location.href = '/_reserved';
            } else {
                // fakehandle
                window.location.href = '/app';
            }
        }).catch((err) => { logg(err); });
    }
}