const AWS = require('aws-sdk');
require('dotenv').config();  // This loads your .env file into process.env

const AWS_ACCESS_KEY_ID = "AKIA2UC27JK6YNTHSIEZ"
const AWS_SECRET_ACCESS_KEY = "WPIdO9TY3YCWwQN4pSezPkfR24Zthux7yTA1zh+/"
const AWS_REGION = "us-east-2"
const BUCKET_NAME = "greenbites";
const POIS_KEY = 'data/pois.json'; // Key for the POIs JSON file in the S3 bucket

const s3 = new AWS.S3({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION
});

console.log(AWS_ACCESS_KEY_ID);  // Should print your AWS Access Key
console.log(AWS_SECRET_ACCESS_KEY);  // Should print your AWS Secret Key
console.log(AWS_REGION);  // Should print 'us-east-2'
console.log(BUCKET_NAME);  // Should print 'greenbites'

// Helper functions to read and write POIs in S3

// Fetch POIs from the S3 bucket
const getPOIs = async () => {
    try {
        const params = {
            Bucket: BUCKET_NAME,
            Key: POIS_KEY,
        };
        const data = await s3.getObject(params).promise();
        console.log(data)
        // Convert the Buffer to a string
        const poisJson = data.Body.toString('utf-8');
        
        // Parse the string as JSON
        const parsedPOIs = JSON.parse(poisJson);   
        console.log(parsedPOIs)     
        // Check if the parsed data is an array
        if (Array.isArray(parsedPOIs)) {
            return parsedPOIs;
        } else {
            console.error('POIs data is not an array:', parsedPOIs);
            return [];  // Return an empty array if data is not an array
        }
    } catch (err) {
        if (err.code === 'NoSuchKey') {
            // If the file doesn't exist, return an empty array
            console.error('NoSuchKey: POIs file does not exist');
            return [];
        }
        console.error('Error reading POIs from S3:', err);
        throw err;
    }
};


// Write POIs to the S3 bucket
const savePOIs = async (pois) => {
    try {
        if (!Array.isArray(pois)) {
            throw new Error('Data to write must be an array');
        }
        const params = {
            Bucket: BUCKET_NAME,
            Key: POIS_KEY,
            Body: JSON.stringify(pois, null, 2),
            ContentType: 'application/json',
        };
        console.log('Saving POIs to S3 with params:', params);
        await s3.putObject(params).promise();
        console.log('POIs successfully saved to S3');
    } catch (err) {
        console.error('Error writing POIs to S3:', {
            error: err.message,
            stack: err.stack,
            bucket: BUCKET_NAME,
            key: POIS_KEY,
        });
        throw err;
    }
};

// Create a new POI
const createPOI = async (nuevoPOI) => {
    const pois = await getPOIs();
    pois.push(nuevoPOI);
    console.log('POIs after adding new POI:', pois);
    await savePOIs(pois);
};

// Approve a POI
const approvePOI = async (id) => {
    const pois = await getPOIs(); // Fetch POIs from the source
    for (const poi of pois) {
        if (poi.id === id) {
            poi.aprobado = true; // Set aprobado to true for the matching POI
            break;
        }
    }
    await savePOIs(pois); // Save updated POIs back to the source
    return pois.find((poi) => poi.id === id); // Return the updated POI
};

// Reject a POI
const rejectPOI = async (id) => {
    const pois = await getPOIs(); // Fetch POIs from the source
    const index = pois.findIndex((poi) => poi.id === id); // Find the index of the POI
    if (index !== -1) {
        pois.splice(index, 1); // Remove the POI from the array
    }
    await savePOIs(pois); // Save updated POIs back to the source
    return pois.find((poi) => poi.id === id) || null; // Return null if POI was rejected
};


module.exports = {
    getPOIs,
    savePOIs,
    approvePOI,
    rejectPOI,
    createPOI,
};
