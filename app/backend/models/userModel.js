const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const AWS_ACCESS_KEY_ID = "AKIA2UC27JK6YNTHSIEZ"
const AWS_SECRET_ACCESS_KEY = "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"
const AWS_REGION = "us-east-2"

const s3 = new AWS.S3({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION
});

const BUCKET_NAME = "greenbites";
const USERS_KEY = 'data/users.json'; // Key for the users JSON file in S3

// Fetch users from the S3 bucket
const readUsers = async () => {
    try {
        const params = {
            Bucket: BUCKET_NAME,
            Key: USERS_KEY
        };
        const data = await s3.getObject(params).promise();
        return JSON.parse(data.Body.toString('utf-8'));
    } catch (err) {
        if (err.code === 'NoSuchKey') {
            // If the file doesn't exist, return an empty array
            return [];
        }
        console.error('Error reading users from S3:', err);
        throw err; // Propagate error
    }
};

// Write users to the S3 bucket
const writeUsers = async (data) => {
    try {
        if (!Array.isArray(data)) {
            throw new Error('Data to write must be an array');
        }
        const params = {
            Bucket: BUCKET_NAME,
            Key: USERS_KEY,
            Body: JSON.stringify(data, null, 2),
            ContentType: 'application/json'
        };
        await s3.putObject(params).promise();
    } catch (err) {
        console.error('Error writing users to S3:', err);
        throw err;
    }
};

// Find a user by username
const findUserByUsername = async (username) => {
    const users = await readUsers();
    console.log(users);
    console.log(username);
    for (const user of users) {
        if (user.username === username) {
            return true;
        }
    }
    return false;
};

// Create a new user
const createUser = async (username, password, role) => {
    const users = await readUsers();
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        id: Date.now(),
        username,
        password: hashedPassword,
        role // 'admin' or 'user'
    };
    users.push(newUser);
    await writeUsers(users);
    return newUser;
};

// Validate user credentials
const validateUserCredentials = async (username, password) => {
    const user = await findUserByUsername(username);
    if (!user) {
        return null; // User not found
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return null; // Incorrect password
    }

    return user; // Valid user
};


// Delete a user by ID
const deleteUserById = async (id) => {
    const users = await readUsers();
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
        return false; // User not found
    }
    users.splice(userIndex, 1);
    await writeUsers(users);
    return true; // User deleted
};

module.exports = {
    readUsers,
    writeUsers,
    findUserByUsername,
    createUser,
    validateUserCredentials,
    deleteUserById
};
