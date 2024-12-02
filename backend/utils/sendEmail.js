const nodemailer = require("nodemailer");

const sendEmail = async (to, username, password) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail", 
            auth: {
                user: "953621104019@ritrjpm.ac.in", 
                pass: "Aravinth96294@", 
            },
        });

        const mailOptions = {
            from: 'Time Sheet <jeyaaravinths@gmail.com>',
            to: to,
            subject: "Welcome to Our System",
            text: `Hello ${username},\n\nYour account has been created successfully. Here are your login details:\n\nUsername: ${username}\nPassword: ${password}\n\nPlease keep this information secure.\n\nBest regards,\nTime Sheet Team`,
        };

        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully!");
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Unable to send email");
    }
};

module.exports = sendEmail;
