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

    if (!fullName) return res.status(400).json({ status: false, message: 'Bad Request', err: 'fullName is required', data: null });
    if (!email) return res.status(400).json({ status: false, message: 'Bad Request', err: 'email is required', data: null });
    if (!password) return res.status(400).json({ status: false, message: 'Bad Request', err: 'password is required', data: null });
    if (!passwordConfirmation) return res.status(400).json({ status: false, message: 'Bad Request', err: 'passwordConfirmation is required', data: null });
    if (!noTelp) return res.status(400).json({ status: false, message: 'Bad Request', err: 'noTelp is required', data: null });

    const userExist = await prisma.users.findUnique({ where: { email } });
    if (userExist && userExist.isActivated) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'Email has been used',
        data: null,
      });
    }

    if (password !== passwordConfirmation) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'password and passwordConfirmation not same',
        data: null,
      });
    }

    const encyptedPassword = await bcrypt.hash(password, 10);

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

    if (!otp) return res.status(400).json({ status: false, message: 'Bad Request', err: 'otp is required', data: null });
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'User does not exist',
        data: null,
      });
    }

    const activationCode = await prisma.activationCodes.findUnique({ where: { userId: user.id } });
    if (otp !== activationCode.activationCode) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'Wrong OTP code',
        data: null,
      });
    }

    if (activationCode.createdAt <= new Date(Date.now() - 5 * 60 * 1000)) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'OTP code has expired',
        data: null,
      });
    }

    if (activationCode.isUse) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'OTP code has been used',
        data: null,
      });
    }

    await prisma.activationCodes.update({
      where: { userId: user.id },
      data: {
        isUse: true,
      },
    });

    await prisma.users.update({
      where: { email },
      data: {
        isActivated: true,
      },
    });

    const html = await getHtml('welcome.message.ejs', { user });
    await sendMail(email, 'Activation Success', html);

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

  // Resend otp code to gmail
  resendOtp: async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ status: false, message: 'Bad Request', err: 'email is required', data: null });

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'User does not exist',
        data: null,
      });
    }

    if (user && user.isActivated) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'Active user',
        data: null,
      });
    }

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

    const html = await getHtml('otp.message.ejs', { otp });
    await sendMail(email, 'Activation code verification', html);

    await res.status(200).json({
      status: true,
      message: 'resending the otp code was successful',
      err: null,
      data: { user, otp },
    });
  },

  // Login
  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email) return res.status(400).json({ status: false, message: 'Bad Request', err: 'email is required', data: null });
    if (!password) return res.status(400).json({ status: false, message: 'Bad Request', err: 'password is required', data: null });

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'Incorrect email or password',
        data: null,
      });
    }

    if (!user.isActivated) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'User has not been activated',
        data: null,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'Incorrect email or password',
        data: null,
      });
    }

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
