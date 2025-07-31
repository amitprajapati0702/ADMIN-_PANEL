import React, { useEffect, useRef, useState } from "react";
import LoginForm from "../components/Auth/Login";
import { useLocation, useParams } from "react-router";
import anime from "animejs/lib/anime.es.js";
import { useTranslation } from "react-i18next";

const AuthLayout = () => {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const location = useLocation();
  const params = useParams();
  const [selectedPage, setSelectedPage] = useState("login");

  // ------------------------------------------------ API -----------------------------------------------

  // Extract the source query parameter and set it in localStorage
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const source = queryParams.get('source');
    if (source) {
      localStorage.setItem('source', source);
    }
  }, [location.search]);
  
  useEffect(() => {
    const slideInAnimation = anime.timeline({
      autoplay: false,
    });
    slideInAnimation.add({
      targets: containerRef.current,
      translateX: ["-100%", "0%"],
      easing: "easeOutQuart",
      duration: 1200,
    });

    slideInAnimation.play();

  }, [location.pathname]);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <section className="loginSection">
        <div className="container centerDiv">
          <div className="loginBgImg"></div>
          <div className="loginBg">
            <div className="row">
              {selectedPage === "resetPassword" &&
                <div className="forgot_password_header">
                  <h3 onClick={() => setSelectedPage("login")}>
                    <a>
                      <i className="fa fa-angle-left"></i>
                    </a>{" "}
                    {t("Login")}
                  </h3>
                </div>
              }
              <LoginForm params={params} selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AuthLayout;
