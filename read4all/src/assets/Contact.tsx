import React from 'react'

export const contactText=`
      If you have any questions, suggestions, or would like to get involved with Read4All, please don't hesitate to reach out to us.
      Email:   "" 
      Phone:   "" 
      Address:   "" 
      We look forward to hearing from you!`;
const Contact: React.FC = () => {
  return (
    
    <section id='contact'> 
      <h2>Contact Us</h2>
      <p>{contactText}</p>
      </section>
  )
} 
export default Contact;