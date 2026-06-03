import "bootstrap/dist/css/bootstrap.min.css";
import Hero from "../../components/Home/Hero";
import Features from "../../components/Home/Features";
import About from "../../components/Home/About";
import Testimonial  from "../../components/Home/Testimonial";
import Pricing from "../../components/Home/Pricing";
import Footer from "../../components/Home/Footer";

function MainHome (){
  return (
    <>
      {/* Sections */}
        <Hero />
        <Features />
        <About />
        <Testimonial/>
        <Pricing/>
    </>
  );
};

export default MainHome;
