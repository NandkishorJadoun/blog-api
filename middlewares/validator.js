const { body } = require("express-validator");
const prisma = require("../configs/prisma");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";
const emptyErr = "shouldn't be empty.";

const signUp = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage(`First name ${emptyErr}`)
    .isAlpha("en-US")
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`First name ${lengthErr}`),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage(`Last name ${emptyErr}`)
    .isAlpha("en-US")
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`Last name ${lengthErr}`),

  body("email")
    .isEmail()
    .withMessage("Enter a valid email.")
    .custom(async (email) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        throw new Error("E-mail already in use.");
      }
      return true;
    }),

  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Minimum Length of Password should be 6 Characters."),

  body("confirmPassword").custom((password, { req }) => {
    if (password !== req.body.password) {
      throw new Error("Both Passwords are not matching.");
    }
    return true;
  }),
];

const comment = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage(`Comment ${emptyErr}`)
    .isLength({ min: 1, max: 1000 })
    .withMessage("Comment must be within 1000 character."),
];

const post = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage(" Title shouldn't be empty.")
    .isLength({ min: 10, max: 120 })
    .withMessage("Title must be between 10 and 120 characters."),

  body("content").custom((content) => {
    const wordCount = content
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ").length;

    if (wordCount < 120) {
      throw new Error("Post must contain at least 120 words");
    }

    if (wordCount > 1500) {
      throw new Error("Post must contain less than 1500 words");
    }

    return true;
  }),
];

module.exports = {
  signUp,
  comment,
  post,
};
