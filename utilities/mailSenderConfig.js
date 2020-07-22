function setMailOptions(receiver, verificationLink){
  let Verification_html = `
    <h1>Email verification</h1>
    <h3>Visit the link below to verify email</h3>
    <a href="http://192.168.1.64:3010/verification/${verificationLink}">Click Here</a>`;

  return {
    from: 'Madhyam Team <075bct095.udeshya@pcampus.edu.np>',
    to: receiver,
    subject: 'Email verification',
    html: Verification_html
  }
}

module.exports = setMailOptions;
