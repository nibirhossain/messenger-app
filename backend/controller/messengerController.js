const formidable = require('formidable');
const fs = require('fs');
const User = require('../models/authModel');
const Message = require('../models/messageModel');

module.exports.getFriends = async (req, res) => {
    try {
        const myId = req.myId;
        const friends = await User.find({});
        const filteredFriends = friends.filter(d => d.id !== myId);
        res.status(200).json({ success: true, friends: filteredFriends })
    } catch (error) {
        res.status(500).json({
            error: {
                errorMessage: 'Internal Sever Error'
            }
        })
    }
}

async function saveMessage(message) {
    const messageSaved = await message.save();
    console.log('Stored message', message);
    return messageSaved;
}

module.exports.messageUploadDB = async (req, res) => {
    const { senderName, receiverId, message } = req.body
    const senderId = req.myId;

    try {
        const messageToSave = new Message({
            senderId: senderId,
            senderName: senderName,
            receiverId: receiverId,
            message: {
                text: message,
                image: ''
            }
        });

        const savedMessage = await saveMessage(messageToSave);
        res.status(201).json({
            success: true,
            message: savedMessage
        })

    } catch (error) {
        res.status(500).json({
            error: {
                errorMessage: 'Internal Sever Error'
            }
        })
    }
}

module.exports.getMessages = async (req, res) => {
    const myId = req.myId;
    const fdId = req.params.id;

    try {
        let allMessages = await Message.find({})

        allMessages = allMessages.filter(m => m.senderId === myId && m.receiverId === fdId || m.receiverId === myId && m.senderId === fdId);

        res.status(200).json({
            success: true,
            message: allMessages
        })

    } catch (error) {
        res.status(500).json({
            error: {
                errorMessage: 'Internal Server error'
            }
        })
    }
}

module.exports.ImageMessageSend = (req, res) => {
    const senderId = req.myId;
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
        const {
            senderName,
            receiverId,
            imageName
        } = fields;

        const newPath = __dirname + `../../../frontend/public/images/${imageName}`
        files.image.originalFilename = imageName;
        // console.log(files.image.originalFilename)
        // console.log(imageName)

        try {
            fs.copyFile(files.image[0].filepath, newPath, async (err) => {
                console.log('Image copied successfully')
                if (err) {
                    res.status(500).json({
                        error: {
                            errorMessage: 'Image upload failed'
                        }
                    })
                } else {
                    const messageToSave = new Message({
                        senderId: String(senderId),
                        senderName: String(senderName),
                        receiverId: String(receiverId),
                        message: {
                            text: '',
                            image: String(files.image.originalFilename)
                        }
                    });
            
                    const savedMessage = await saveMessage(messageToSave);
                    res.status(201).json({
                        success: true,
                        message: savedMessage
                    })
                }
            })
        } catch {
            res.status(500).json({
                error: {
                    errorMessage: 'Internal Sever Error'
                }
            })
        }
    })
}