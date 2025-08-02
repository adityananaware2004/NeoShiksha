const contactUsEmail = (email, firstname, lastname, message, phoneNo, countrycode) => {
  return `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
      <h2 style="color: #333; text-align: center; margin-bottom: 30px;">Contact Form Submission</h2>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #495057; margin-bottom: 15px;">Contact Information</h3>
        <p style="margin: 8px 0; color: #6c757d;"><strong>Name:</strong> ${firstname} ${lastname}</p>
        <p style="margin: 8px 0; color: #6c757d;"><strong>Email:</strong> ${email}</p>
        <p style="margin: 8px 0; color: #6c757d;"><strong>Phone:</strong> ${countrycode} ${phoneNo}</p>
      </div>
      
      <div style="background-color: #e9ecef; padding: 20px; border-radius: 8px;">
        <h3 style="color: #495057; margin-bottom: 15px;">Message</h3>
        <p style="margin: 0; color: #6c757d; line-height: 1.6;">${message}</p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
        <p style="color: #6c757d; font-size: 14px;">This is an automated response from NeoShiksha Contact Form</p>
        <p style="color: #6c757d; font-size: 12px;">Submitted on: ${new Date().toLocaleString()}</p>
      </div>
    </div>
  `;
};

module.exports = { contactUsEmail };

