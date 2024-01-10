import { ObjectId } from "mongodb";
import db from "../db/connection.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { log } from "console";
import { update } from "./movieHandlers.js";




let usersCollection = db.collection("Korisnici");


async function _generatePassword(password) {
    return await bcrypt.hash(password, 10);
}


async function generateHash() {
    const randomData = crypto.randomBytes(32);
    const hash = crypto.createHash('sha256');
    hash.update(randomData);
    return hash.digest('hex');
}
//register
async function registerUser(userData) {
    const hashPassword = await _generatePassword(userData.password);
    const randomHash = await generateHash();

    const user = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        DOB: new Date(userData.DOB),
        email: userData.email,
        password: hashPassword,
        createdDate: new Date(),
        lastLogin: new Date(),
        randomHash: randomHash,
    };
    const result = await _addUser(user);
    const token = generateAuthToken(result._id);
    return { user: result, token };
    async function addUser(userData) {
        const result = await _addUser(userData);
        return result;
    }
    async function _addUser(userData) {
        let result = await usersCollection.insertOne(userData);
        if (result.acknowledged === true) {
            userData._id = result.insertedId;
        }
        return userData;
    }


}
function generateAuthToken(userId) {
    const token = jwt.sign({ _id: userId }, "JWT_SECRET_KEY");
    return token;
}
//login
let localStorage = {};
async function loginUser(loginData) {
    const { email, password } = loginData;
    const user = await usersCollection.findOne({ email });

    if (!user) {
        throw new Error("Korisnik nije pronađen");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        throw new Error("Pogrešna lozinka");
    }

    await usersCollection.updateOne(
        { _id: user._id },
        { $set: { lastLogin: new Date() } }
    );

    const token = generateAuthToken(user._id);
    localStorage[user._id] = { user, token };


    return { user, token, localStorage };
}
//update
async function changeUserProfile(userData, updatedData) {
    debugger
    let newdata = {};
    if (updatedData.email === null) {
        newdata.email = userData.email;
    } else {
        console.log(updatedData.email)
        newdata.email = updatedData.email;

    }
    if (updatedData.firstName === null) {
        newdata.firstName = userData.firstName;
    }
    else {
        newdata.firstName = updatedData.firstName;
    }
    if (updatedData.lastName = null) {
        newdata.lastName = userData.lastName;
    }
    else {
        newdata.lastName = updatedData.lastName;
    }

    const updatedUser = await usersCollection.updateOne(
        { _id: userData._id },
        {
            $set: {
                firstName: updatedData.firstName,
                lastName: updatedData.lastName,
                email: updatedData.email
            }
        }
    );
    console.log('Rezultati promjen', updatedUser);
    if (!updatedUser.value || updatedUser.modifiedCount === 0) {
        throw new Error('Greška u promjeni profila');
    }

    return { message: 'Profil uspiješno promjenjen', user: updatedUser.value };
}
async function deleteUser(loginData) {
    const { email, password } = loginData;
    const user = await usersCollection.findOne({ email });

    if (!user) {
        throw new Error("Korisnik nije pronađen");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    debugger
    if (!passwordMatch) {
        throw new Error("Pogrešna lozinka");
    }
    debugger
    const result = await usersCollection.deleteOne({ password: user.password });
    if (result.deletedCount === 0) {
        throw new Error('Pogreška pri brisanju');
    }
    return { message: 'Korisnik je izbrisan' };

}




export {
    registerUser,
    loginUser,
    localStorage,
    changeUserProfile,
    deleteUser
};