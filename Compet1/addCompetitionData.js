//IMPORTANT
//THIS HAS ALREADY BEEN ADDEDD
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(require("./serviceAccountKey.json")),
  databaseURL: "https://karoka-game.firebaseio.com", // Replace with your project URL
});

const db = admin.firestore();

// Define the competition data
const competitionData = {
  images: [
    {
      key: "House",
      url: "https://firebasestorage.googleapis.com/v0/b/karoka-game.firebasestorage.app/o/Compet1test%2FHouse.png?alt=media",
    },
    {
      key: "house1",
      url: "https://firebasestorage.googleapis.com/v0/b/karoka-game.firebasestorage.app/o/Compet1test%2Fhouse1.png?alt=media",
    },
    {
      key: "Tilemap",
      url: "https://firebasestorage.googleapis.com/v0/b/karoka-game.firebasestorage.app/o/Compet1test%2FTileMap.png?alt=media",
    },
  ],
  spritesheet: {
    key: "girl",
    url: "https://firebasestorage.googleapis.com/v0/b/karoka-game.firebasestorage.app/o/Compet1test%2Fgirl.png?alt=media",
    frameWidth: 48,
    frameHeight: 48,
  },
  tilemap: {
    key: "test",
    url: "https://firebasestorage.googleapis.com/v0/b/karoka-game.firebasestorage.app/o/Compet1test%2Ftest.json?alt=media",
  },
};

// Add the data to Firestore
async function addCompetitionData() {
  try {
    const competitionId = "compet1Test"; 
    await db.collection("competitions").doc(competitionId).set(competitionData);
    console.log(`Competition data added successfully for: ${competitionId}`);
  } catch (error) {
    console.error("Error adding competition data:", error);
  }
}

// Run the function
addCompetitionData();
