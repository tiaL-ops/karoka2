//IMPORTANT
//THIS HAS ALREADY BEEN ADDEDD
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(require("./serviceAccountKey.json")),
  databaseURL: "https://karoka-game.firebaseio.com", 
});

const db = admin.firestore();

// Define the competition data
const competitionData = {
  images: [
    {
      key: "forest_tiles",
      url: "https://firebasestorage.googleapis.com/v0/b/karoka-game.firebasestorage.app/o/Beta%2Forest_tiles.png?alt=media",
    },
    {
      key: "sign_post",
      url: "https://firebasestorage.googleapis.com/v0/b/karoka-game.firebasestorage.app/o/Beta%2Fsign_post.svg?alt=media",
    },
    {
      key: "terrain",
      url: "https://firebasestorage.googleapis.com/v0/b/karoka-game.firebasestorage.app/o/Beta%2Fterrain.png?alt=media",
    },
    {
      key: "terrain_atlas",
      url: "https://firebasestorage.googleapis.com/v0/b/karoka-game.firebasestorage.app/o/Beta%2Fterrain_atlas.png?alt=media",
    },
  ],
  spritesheet: [{
    key: "girl",
    url: "https://firebasestorage.googleapis.com/v0/b/karoka-game.firebasestorage.app/o/Beta%2Fgirl.png?alt=media",
    frameWidth: 48,
    frameHeight: 48,
  },
    {key: "boi",
      url: "https://firebasestorage.googleapis.com/v0/b/karoka-game.firebasestorage.app/o/Beta%2FboiTest.png?alt=media",
      frameWidth: 48,
      frameHeight: 48,
    },
],
  tilemap: {
    key: "test",
    url: "https://firebasestorage.googleapis.com/v0/b/karoka-game.firebasestorage.app/o/Beta%2WPMap.json?alt=media",
  },
};

// Add the data to Firestore
async function addCompetitionData() {
  try {
    const competitionId = "Beta"; 
    await db.collection("competitions").doc(competitionId).set(competitionData);
    console.log(`Competition data added successfully for: ${competitionId}`);
  } catch (error) {
    console.error("Error adding competition data:", error);
  }
}

// Run the function
addCompetitionData();
