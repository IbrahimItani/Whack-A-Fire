# 🔥 Whack A Fire 🔥

This game is a modification of the game Whack A Mole. It uses the [“Fire Locations - Current”](https://catalogue.data.gov.bc.ca/dataset/fire-locations-current/resource/a30ba997-2b61-4008-8d1c-eacee0d44fbd) dataset from the BC data catalogue to create forest fires (using real locations) with a random intensity. Users need to click on a forest fire to start to extinguishing fires. Each fire slowly grows stronger if they are not extinguished in a timely manner. Users reach a “game over” scenario if a fire grows too strong.

Features will include Facebook API Integration, account creation, highscores table, custom assets (sprites, music and misc. graphics) and satellite imagery layouts.

###Contributors ([Zach Mackay](https://github.com/ZachAttackUBC), [Kyle Chan](https://github.com/chankyle) and [Ibrahim Itani](https://github.com/IbrahimItani)) 

### Key Features: 
   - Server-Client communication interface (provided via socket.io module) 
   - MongoDB support implementation : basic read/write functionality 
   - Game instantiation using Phaser.IO framework, with socket.io incorporation, and rudimentary IO response


### Development Notes: 
 
  - Both the Server class and the DatabaseManager class are housed within the app.ts/.js file
  - The Server constructor contains all the initial setup for the Server including the client listening functionality.
  - Besides these two classes, any additional TypeScript classes or Assets (like spritesheets, sounds, etc) should be added to the /public/ folder ONLY and into their respective sub-directories   
  - For local MongoDB testing, the databaseUrl field will need to point to the location of your local database (this is set in the constructor for DatabaseManager) 
  - /public/ is the root directory for client-side scripts.  these are loaded by each view in their corresponding .jade file so if a script is inside /public/javascripts/ the src pointer is just /javascripts/ 

