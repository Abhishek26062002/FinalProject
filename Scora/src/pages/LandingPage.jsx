import React from "react";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landingpage">
      <div className="landingpage1">
      <div className="main-landing1">
        <div className="main-landing-box1">
        <br /><br />
          <h1 className="heading-land">Smart Test</h1><br /><br />
          <p className="landing-paragraph">
            Because you care about your assessments. <br /> <br />
            We are building a complete ecosystem to help you <br />
            create and manage tests efficiently.
          </p>
          <br />
         <a href="/login"> <button class="getstarted">
  <span class="circle" aria-hidden="true">
  <span class="icon arrow"></span>
  </span>
  <span class="button-text">Get Started</span>
</button></a>
        </div>
        <img className="landingpage-image2" src="src\assets\landingpage.svg" alt="" />
      </div>
      </div>
      <div className="landingpage2">
        <img className="landingpage-image2" src="src\assets\how-it-works.svg" alt="" />
        <div className="main-landing2">
          <div className="main-landing-box2">
            <div className="landing-box1">
              <img src="src\assets\assesments.svg" alt="" />
              <p className="landingpage-paragraph">Take your <br />assessments</p>
            </div>
            <div className="landing-box2">
              <img src="src\assets\analytics.svg" alt="" />
              <p className="landingpage-paragraph">Check your <br />analytics</p>
            </div>
            <div className="landing-box3">
              <img src="src\assets\improve.svg" alt="" />
              <p className="landingpage-paragraph">Improve yourself <br />with recommendations</p>
            </div>
          </div>
        </div>
      </div>
      <div className="landingpage3">
          <p className="landing-paragraph2" >© 2022 to 2024 Scora Labs Pvt Ltd. All rights reserved.</p>
          <img className="footer-image" src="src\assets\footer.png" alt="" />
      </div>
    </div>
  );
};

export default LandingPage;
