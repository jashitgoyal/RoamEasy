import nodemailer from "nodemailer";

export const sendBookingEmail = async (recipientEmail, bookingDetails) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "roameasy519@gmail.com", // Replace with your email
      pass: "dhofuvynrowmmsmw", // Replace with your email app password
    },
  });
  console.log("chirag                                     ", bookingDetails);

  const {
    userEmail,
    tourName,
    fullName,
    guestSize,
    phone,
    bookAt,
    totalAmount,
  } = bookingDetails;

  const mailOptions = {
    from: '"RoamEasy" <roameasy519@gmail.com>',
    to: userEmail,
    subject: "Your Booking Details - RoamEasy",
    html: `
      <h2>Booking Confirmation</h2>
      <p>Dear Customer,</p>
      <p>Thank you for booking with RoamEasy! Here are your booking details:</p>
      <ul>
        <li><strong>User-Email</strong> ${userEmail}</li>
        <li><strong>Full-Name</strong> ${fullName || "N/A"}</li>
        <li><strong>Tour-Name</strong> ${tourName || "N/A"} days</li>
        <li><strong>Phone No.</strong> ${phone || "N/A"}</li>
        <li><strong>BookAT</strong> ${bookAt || "N/A"}</li>
        <li><strong>Amount Paid:</strong> $${totalAmount || "N/A"}</li>
      </ul>
      <p>If you have any questions, feel free to contact us at support@roameasy.com.</p>
      <p>Happy Travels!</p>
      <p>Best Regards,<br>RoamEasy Team</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
    return { success: true, message: "Email sent successfully", info };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, message: "Failed to send email", error };
  }
};
