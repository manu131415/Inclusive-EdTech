import React from 'react'

export const aboutText=`Read4All is an open-source project dedicated to making reading accessible to everyone, 
        regardless of their abilities or disabilities. Our mission is to provide tools and resources 
        that empower individuals with diverse reading needs to access and enjoy written content.
      We believe that everyone deserves the right to read, and we are committed to 
        breaking down barriers that prevent people from accessing information. Whether you have a visual
         impairment, dyslexia, or any other reading challenge, Read4All is here to support you.
      
        Join us in our mission to create a more inclusive world where everyone can read and learn
         without limitations. Together, we can make a difference and ensure that no one is left behind 
         in the pursuit of knowledge.`;
const About: React.FC = () => {
  return (
    <section id="about">
      <h2>About Us</h2>
      <p>{aboutText}</p>
    </section>
  );
}
export default About;