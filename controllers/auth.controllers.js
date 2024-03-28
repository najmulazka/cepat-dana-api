const prisma = require('../libs/prisma.libs');
const { sendMail, getHtml } = require('../libs/nodemailer.libs');
const otp = require('../libs/otp.libs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

module.exports = {
  // Register
  register: async (req, res) => {
    const { fullName, email, password, passwordConfirmation, noTelp } = req.body;
    const requiredFields = ['fullName', 'email', 'password', 'passwordConfirmation', 'noTelp'];

    // Check req.body
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: `field ${field} is required`,
        });
      }
    }

    // Get user
    const userExist = await prisma.users.findUnique({ where: { email } });

    // Check if the user exist and is active
    if (userExist && userExist.isActivated) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'Email has been used',
        data: null,
      });
    }

    // Check password end password confirmation is same
    if (password !== passwordConfirmation) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'password and passwordConfirmation not same',
        data: null,
      });
    }

    // Encrypted password
    const encyptedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.users.upsert({
      where: { email },
      create: {
        fullName,
        email,
        password: encyptedPassword,
        noTelp,
      },
      update: {
        fullName,
        password: encyptedPassword,
        noTelp,
      },
    });

    // save otp in database
    await prisma.activationCodes.upsert({
      where: { userId: user.id },
      create: {
        activationCode: otp,
        createdAt: new Date(Date.now()),
        userId: user.id,
      },
      update: {
        activationCode: otp,
        createdAt: new Date(Date.now()),
        isUse: false,
      },
    });

    // send email to user
    const html = await getHtml('otp.message.ejs', { otp });
    await sendMail(email, 'Activation code verification', html);

    await res.status(201).json({
      status: true,
      message: 'Created',
      err: null,
      data: { user, otp },
    });
  },

  // Activation account
  activationCode: async (req, res) => {
    const { email, otp } = req.body;

    // Check req.body
    if (!otp) return res.status(400).json({ status: false, message: 'Bad Request', err: 'otp is required', data: null });

    // Get user by email
    const user = await prisma.users.findUnique({ where: { email } });

    // Check if the user exist
    if (!user) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'User does not exist',
        data: null,
      });
    }

    // Get otp code in the database by user id
    const activationCode = await prisma.activationCodes.findUnique({ where: { userId: user.id } });

    // Check if the otp code in req.body same with otp code in the database
    if (otp !== activationCode.activationCode) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'Wrong OTP code',
        data: null,
      });
    }

    // Check whether the otp code in the database has expired (5 minutes)
    if (activationCode.createdAt <= new Date(Date.now() - 5 * 60 * 1000)) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'OTP code has expired',
        data: null,
      });
    }

    // Check if the otp code in the database has been used
    if (activationCode.isUse) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'OTP code has been used',
        data: null,
      });
    }

    // Update otp code in the database has been used
    await prisma.activationCodes.update({
      where: { userId: user.id },
      data: {
        isUse: true,
      },
    });

    // Update the user status to active
    await prisma.users.update({
      where: { email },
      data: {
        isActivated: true,
      },
    });

    // Send email to user
    const html = await getHtml('welcome.message.ejs', { user });
    await sendMail(email, 'Activation Success', html);

    // Save notification to database by user id
    await prisma.notifications.create({
      data: {
        title: 'Activation Success',
        header: 'Welcome to Cepat Dana!',
        message: `Congratulations, ${user.fullName}! 
        Your registration was successful. Thank you for joining us!`,
        userId: user.id,
      },
    });

    res.status(200).json({
      status: true,
      message: 'Activation code successful',
      err: '',
      data: { user },
    });
  },

  // Resend activation otp code to gmail
  resendOtp: async (req, res) => {
    const { email } = req.body;

    // Check req.body
    if (!email) return res.status(400).json({ status: false, message: 'Bad Request', err: 'email is required', data: null });

    // Get user
    const user = await prisma.users.findUnique({ where: { email } });

    // Check if the user exist
    if (!user) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'User does not exist',
        data: null,
      });
    }

    // check if the user is active
    if (user.isActivated) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'Active user',
        data: null,
      });
    }

    // Save otp in database
    await prisma.activationCodes.upsert({
      where: { userId: user.id },
      create: {
        activationCode: otp,
        createdAt: new Date(Date.now()),
        userId: user.id,
      },
      update: {
        activationCode: otp,
        createdAt: new Date(Date.now()),
        isUse: false,
      },
    });

    // Send email to user
    const html = await getHtml('otp.message.ejs', { otp });
    await sendMail(email, 'Activation code verification', html);

    await res.status(200).json({
      status: true,
      message: 'resending the otp code was successful',
      err: null,
      data: { user, otp },
    });
  },

  // forrgot password
  forrgotPassword: async (req, res) => {
    const { email } = req.body;

    // Check req.body
    if (!email) return res.status(400).json({ status: false, message: 'Bad Request', err: 'email is required', data: null });

    // Get user
    const user = await prisma.users.findUnique({ where: { email } });

    // Check if the user exist
    if (!user) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'User does not exist',
        data: null,
      });
    }

    // check if the user is active
    if (!user.isActivated) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'Inactive user',
        data: null,
      });
    }

    // Save otp in database
    await prisma.resetCodes.upsert({
      where: { userId: user.id },
      create: {
        resetCode: otp,
        createdAt: new Date(Date.now()),
        userId: user.id,
      },
      update: {
        resetCode: otp,
        createdAt: new Date(Date.now()),
        isUse: false,
      },
    });

    // Send email to user
    const html = await getHtml('otp.forgot.message.ejs', { otp });
    await sendMail(email, 'Forrgot password verification', html);

    await res.status(200).json({
      status: true,
      message: 'Send the otp forrgot password was successful',
      err: null,
      data: { user, otp },
    });
  },

  // Verify OTP password
  verifyOtpPassword: async (req, res) => {
    const { email, otp } = req.body;

    // Check req.body
    if (!email) return res.status(400).json({ status: false, message: 'Bad Request', err: 'email is required', data: null });
    if (!otp) return res.status(400).json({ status: false, message: 'Bad Request', err: 'otp is required', data: null });

    // Get user
    const user = await prisma.users.findUnique({ where: { email } });

    // Check if the user exist
    if (!user) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'User does not exist',
        data: null,
      });
    }

    // Check user if the is active
    if (!user.isActivated) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'Inactive user',
        data: null,
      });
    }

    // Get otp in database by user id
    const verifyOtp = await prisma.resetCodes.findUnique({ where: { userId: user.id } });

    // Check if the otp code in req.body same with otp code in the database
    if (otp !== verifyOtp.resetCode) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'Wrong OTP code',
        data: null,
      });
    }

    // Check whether the otp code in the database has expired (5 minutes)
    if (verifyOtp.createdAt <= new Date(Date.now() - 5 * 60 * 1000)) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'OTP code has expired',
        data: null,
      });
    }

    // Check if the otp code in the database has been used
    if (verifyOtp.isUse) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'OTP code has been used',
        data: null,
      });
    }

    // Update the otp code in the database has been used
    await prisma.resetCodes.update({
      where: { userId: user.id },
      data: {
        isUse: true,
      },
    });

    res.status(200).json({
      status: true,
      message: 'Verify OTP password successful',
      err: null,
      data: { user },
    });
  },

  // forrgot password
  resetPassword: async (req, res) => {
    const { email, password } = req.body;

    // Check req.body
    if (!email) return res.status(400).json({ status: false, message: 'Bad Request', err: 'email is required', data: null });
    if (!password) return res.status(400).json({ status: false, message: 'Bad Request', err: 'password is required', data: null });

    // Get user
    const user = await prisma.users.findUnique({ where: { email } });

    // Check if the user exist
    if (!user) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'User does not exist',
        data: null,
      });
    }

    // Check if the user is active
    if (!user.isActivated) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'Inactive user',
        data: null,
      });
    }

    // bcrypt password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Update user password in the database by email
    await prisma.users.update({
      where: { email },
      data: { password: encryptedPassword },
    });

    // Send email to user
    const html = await getHtml('reset.password.message.ejs', { user });
    await sendMail(email, 'Reset Password', html);

    // Save notification to database by user id
    await prisma.notifications.create({
      data: {
        title: 'Reset password',
        header: 'Forrgot Password Succesful',
        message: 'Congratulations, the password has been successfully reset',
        userId: user.id,
      },
    });

    await res.status(200).json({
      status: true,
      message: 'Reset Password was successful',
      err: null,
      data: { user, otp },
    });
  },

  // Login
  login: async (req, res) => {
    const { email, password } = req.body;

    // Check req.body
    if (!email) return res.status(400).json({ status: false, message: 'Bad Request', err: 'email is required', data: null });
    if (!password) return res.status(400).json({ status: false, message: 'Bad Request', err: 'password is required', data: null });

    // Get user by email
    const user = await prisma.users.findUnique({ where: { email } });

    // Check if the user exist
    if (!user) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'Incorrect email or password',
        data: null,
      });
    }

    // Check if the user is active
    if (!user.isActivated) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'User has not been activated',
        data: null,
      });
    }

    // Check if the password in req.body and password in the database are the same
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'Incorrect email or password',
        data: null,
      });
    }

    // create token
    const token = await jwt.sign({ email: user.email }, JWT_SECRET_KEY);

    res.status(200).json({
      status: true,
      message: 'Login successful',
      err: null,
      data: { user, token },
    });
  },

  // Tes who logged in
  whoiam: async (req, res, next) => {
    try {
      res.status(200).json({
        status: true,
        message: 'Whoiam',
        err: null,
        data: req.user,
      });
    } catch (err) {
      next(err);
    }
  },
};
