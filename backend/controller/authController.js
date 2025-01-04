const formidable = require('formidable');
const validator = require('validator');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/authModel');

async function findUsers() {
  const users = await User.find({});
  console.log("Users", users);
  return users;
}

// Read Single User by ID
async function findUserById(id) {
  try {
    const user = await User.findById(id);
    console.log('User find by Id', user);
    return user;
  } catch (error) {
    console.log('Internal server error while finding a user by Id');
  }
}

// Read Single User by Email
async function findUserByEmail(email) {
  try {
    const user = await User.findOne({ email: email });
    console.log('User find by Email', user);
    return user;
  } catch (error) {
    console.log('Internal server error while finding a user by email');
  }
}

async function createUser(user) {
  const userCreated = await user.save();
  console.log('Created user', user);
  return userCreated;
}

module.exports.userRegister = async (req, res) => {
  const form = new formidable.IncomingForm();

  // Parse the incoming form with fields and files
  form.parse(req, async (err, fields, files) => {
    const { username, email, password, confirmPassword } = fields;
    const { image } = files;
    const error = [];

    if (!username) {
      error.push('Please provide your username');
    }
    if (!email) {
      error.push('Please provide your email');
    }
    if (email && !validator.isEmail(String(email))) {
      error.push('Please provide a valid email');
    }
    if (!password) {
      error.push('Please provide your Password');
    }
    if (!confirmPassword) {
      error.push('Please provide your confirm Password');
    }
    if (password && confirmPassword && password.toString() !== confirmPassword.toString()) {
      error.push('Your Password and Confirm Password not same');
    }
    if (password && password.toString().length < 6) {
      error.push('Please provide password at least 6 characters');
    }
    if (Object.keys(files).length === 0) {
      error.push('Please provide user image');
    }
    if (error.length > 0) {
      console.log(error);
      res.status(400).json({
        error: {
          errorMessage: error
        }
      })
    } else {
      // Access the first file in the image array
      const uploadedFile = files.image[0]; // Access the first file
      const imageName = uploadedFile.originalFilename;
      // console.log('Original Filename:', imageName);
      // console.log('File Path:', uploadedFile.filepath, __dirname);

      const randNumber = Math.floor(Math.random() * 99999);
      const newImageName = randNumber + imageName;
      files.image[0].originalFilename = newImageName;

      const newPath = __dirname + `../../../frontend/public/images/${files.image[0].originalFilename}`;
      // console.log('New path', newPath);
      try {
        const user = await findUserByEmail(email);
        if (user) {
          res.status(404).json({
            error: {
              errorMessage: ['Your email already exist!']
            }
          })
        } else {
          fs.copyFile(files.image[0].filepath, newPath, async (error) => {
            if (!error) {
              console.log('No error')
              const userToCreate = new User({
                username: String(username),
                email: String(email),
                password: await bcrypt.hash(String(password), 10),
                image: files.image[0].originalFilename
              });

              const createdUser = await createUser(userToCreate);
              if (createdUser) {
                const token = jwt.sign({
                  id: createdUser._id,
                  email: createdUser.email,
                  username: createdUser.username,
                  image: createdUser.image,
                  registerTime: createdUser.createdAt
                }, process.env.SECRET, {
                  expiresIn: process.env.TOKEN_EXP
                });

                const options = { expires: new Date(Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000) }
                res.status(201).cookie('authToken', token, options).json({
                  successMessage: 'Your registration is successful!', token: token
                })
                console.log('JWT token', token);
                console.log('Your registration successfully completed!');
              } else {
                res.status(500).json({
                  error: {
                    errorMessage: ['Interanl Server Error while copying image or registering the new user.']
                  }
                })
              }
            }
          })
        }
      } catch (error) {
        res.status(500).json({
          error: {
            errorMessage: ['Internal server error while copying image']
          }
        })

      }
    }
  });
}

module.exports.userLogin = async (req, res) => {
  console.log('Login body', req.body)
  const error = [];
  const { email, password } = req.body;
  if (!email) {
    error.push('Please provide your Email');
  }
  if (!password) {
    error.push('Please provide your Passowrd');
  }
  if (email && !validator.isEmail(email)) {
    error.push('Please provide your Valid Email');
  }
  if (error.length > 0) {
    res.status(400).json({
      error: {
        errorMessage: error
      }
    })
  } else {
    try {
      const checkUser = await User.findOne({
        email: email
      }).select('+password');
      if (checkUser) {
        const matchPassword = await bcrypt.compare(password, checkUser.password);

        if (matchPassword) {
          const token = jwt.sign({
            id: checkUser._id,
            email: checkUser.email,
            username: checkUser.username,
            image: checkUser.image,
            registerTime: checkUser.createdAt
          }, process.env.SECRET, {
            expiresIn: process.env.TOKEN_EXP
          });
          const options = { expires: new Date(Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000) }

          res.status(200).cookie('authToken', token, options).json({
            successMessage: 'Your Login Successful', token
          })

        } else {
          res.status(400).json({
            error: {
              errorMessage: ['Your Password not Valid']
            }
          })
        }
      } else {
        res.status(400).json({
          error: {
            errorMessage: ['Your Email Not Found']
          }
        })
      }

    } catch {
      res.status(404).json({
        error: {
          errorMessage: ['Internal Sever Error']
        }
      })

    }
  }
}

module.exports.userLogout = (req, res) => {
  res.status(200).cookie('authToken', '').json({
    success: true
  })
}