import React from 'react';

function Home() {
  return (
    <div className="home-container">
      <center>
        <h1>
           🐾✨ Welcome to Meow Moments ✨🐾
        </h1>
        <p>
          Meow Moments is a cozy corner for cat lovers to capture, share, and enjoy the little moments that make cats so special. <br/>
        </p>

        <h2>🐱 Latest Meow Moments 🐱</h2>
        <p>💫 <strong>Top 5 Cutest Cat Breeds</strong>: 🔹Discover the fluffiest and most charming felines.</p>
        <p>💫 <strong>Beginner’s Guide to Cat Care</strong>: 🔹Simple tips for first-time cat parents.</p>
        <p>💫 <strong>Why Do Cats Behave Like This?</strong>: 🔹A quick peek into quirky cat habits and mysteries.</p>

        <h2> 🌟 Featured Cat of the Month 🌟 </h2>
        <p className="featured">
         <strong>🐾 Luna 🖤</strong> – A playful little shadow who rules the night with her curious eyes. 
        </p>
      </center>
    </div>
  );
}

export default Home;